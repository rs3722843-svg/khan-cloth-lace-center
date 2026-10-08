import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_SETTINGS, INITIAL_CATEGORIES } from './src/data/initialData';
import { Product, Order, StoreSettings, OrderStatus, CategoryItem } from './src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.resolve(DATA_DIR, 'store.json');

interface DbSchema {
  products: Product[];
  orders: Order[];
  settings: StoreSettings;
  categories: CategoryItem[];
}

// Ensure database file exists with initial data
function initDatabase(): DbSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const data = JSON.parse(content) as DbSchema;
      if (Array.isArray(data.products) && Array.isArray(data.orders) && data.settings) {
        if (!Array.isArray(data.categories) || data.categories.length === 0) {
          data.categories = INITIAL_CATEGORIES;
          fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
        }
        return data;
      }
    } catch (err) {
      console.error('Failed reading existing store.json, re-initializing', err);
    }
  }

  const defaultData: DbSchema = {
    products: INITIAL_PRODUCTS,
    orders: INITIAL_ORDERS,
    settings: INITIAL_SETTINGS,
    categories: INITIAL_CATEGORIES,
  };

  fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
  return defaultData;
}

let dbData = initDatabase();

function saveDatabase(): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(dbData, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving store.json:', err);
  }
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // --- CATEGORY API ROUTES ---
  // Get all categories
  app.get('/api/categories', (req, res) => {
    res.json(dbData.categories || INITIAL_CATEGORIES);
  });

  // Add new category (Admin)
  app.post('/api/categories', (req, res) => {
    const { name, nameRomanUrdu, icon, description, id: customId } = req.body;
    if (!name && !nameRomanUrdu) {
      return res.status(400).json({ error: 'Category name lazmi hai (Category name is required)' });
    }

    const baseName = (name || nameRomanUrdu || '').toLowerCase().trim();
    const slug = (customId || baseName)
      .replace(/[^a-z0-9]/gi, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || `cat-${Date.now()}`;

    // Check if category ID already exists
    const exists = (dbData.categories || []).some(
      (c) => c.id.toLowerCase() === slug.toLowerCase()
    );
    if (exists) {
      return res.status(400).json({ error: 'Is naam ya code ki category pehle se mojood hai!' });
    }

    const newCategory: CategoryItem = {
      id: slug,
      name: name || nameRomanUrdu,
      nameRomanUrdu: nameRomanUrdu || name,
      icon: icon || 'tag',
      description: description || '',
      isSystem: false,
    };

    if (!Array.isArray(dbData.categories)) {
      dbData.categories = [...INITIAL_CATEGORIES];
    }

    dbData.categories.push(newCategory);
    saveDatabase();
    res.status(201).json(newCategory);
  });

  // Update category (Admin)
  app.put('/api/categories/:id', (req, res) => {
    const { id } = req.params;
    const { name, nameRomanUrdu, icon, description } = req.body;
    const index = (dbData.categories || []).findIndex((c) => c.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Category nahi mili' });
    }

    const current = dbData.categories[index];
    const updated: CategoryItem = {
      ...current,
      name: name || current.name,
      nameRomanUrdu: nameRomanUrdu || current.nameRomanUrdu,
      icon: icon || current.icon,
      description: description !== undefined ? description : current.description,
    };

    dbData.categories[index] = updated;

    // Also update categoryName in any product associated with this category
    if (name && name !== current.name) {
      dbData.products.forEach((p) => {
        if (p.category === id) {
          p.categoryName = name;
        }
      });
    }

    saveDatabase();
    res.json(updated);
  });

  // Delete category (Admin)
  app.delete('/api/categories/:id', (req, res) => {
    const { id } = req.params;
    const cat = (dbData.categories || []).find((c) => c.id === id);
    if (!cat) {
      return res.status(404).json({ error: 'Category nahi mili' });
    }

    // Check if any product belongs to this category
    const countInProducts = dbData.products.filter((p) => p.category === id).length;
    if (countInProducts > 0) {
      return res.status(400).json({
        error: `Is category mein ${countInProducts} products mojood hain! Pehle un products ki category tabdeel karein ya unhein delete karein.`,
      });
    }

    dbData.categories = (dbData.categories || []).filter((c) => c.id !== id);
    saveDatabase();
    res.json({ success: true, id });
  });

  // --- PRODUCT API ROUTES ---
  // 1. Get all products
  app.get('/api/products', (req, res) => {
    res.json(dbData.products);
  });

  // 2. Add product (Admin)
  app.post('/api/products', (req, res) => {
    const newProd = req.body;
    if (!newProd.title && !newProd.titleRomanUrdu) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const id = `prod-${Date.now()}`;
    const product: Product = {
      ...newProd,
      id,
      inStock: (newProd.stock || 0) > 0,
      rating: newProd.rating || 5.0,
      reviewsCount: newProd.reviewsCount || 1,
    };

    dbData.products.unshift(product);
    saveDatabase();
    res.status(201).json(product);
  });

  // 3. Update product (Admin)
  app.put('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const index = dbData.products.findIndex((p) => p.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const current = dbData.products[index];
    const updated = { ...current, ...updates };
    if (typeof updates.stock === 'number') {
      updated.inStock = updates.stock > 0;
    }

    dbData.products[index] = updated;
    saveDatabase();
    res.json(updated);
  });

  // 4. Delete product (Admin)
  app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const beforeLength = dbData.products.length;
    dbData.products = dbData.products.filter((p) => p.id !== id);

    if (dbData.products.length === beforeLength) {
      return res.status(404).json({ error: 'Product not found' });
    }

    saveDatabase();
    res.json({ success: true, id });
  });

  // 5. Get all orders (Admin)
  app.get('/api/orders', (req, res) => {
    res.json(dbData.orders);
  });

  // 6. Track order (Customer public)
  app.get('/api/orders/track/:query', (req, res) => {
    const query = req.params.query.trim().toLowerCase();
    if (!query) {
      return res.status(400).json({ error: 'Query required' });
    }

    const cleanNumber = query.replace(/\D/g, '');
    const found = dbData.orders.find((o) => {
      const matchId = o.id.toLowerCase() === query;
      const matchPlainId = o.id.replace(/\D/g, '') === cleanNumber;
      const matchPhone = o.phone.replace(/\D/g, '').includes(cleanNumber);
      return matchId || (cleanNumber.length >= 4 && matchPlainId) || (cleanNumber.length >= 7 && matchPhone);
    });

    if (!found) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(found);
  });

  // 7. Place new customer order
  app.post('/api/orders', (req, res) => {
    const data = req.body;
    if (!data.customerName || !data.phone || !data.address) {
      return res.status(400).json({ error: 'Missing customer details' });
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `KCLC-${randomSuffix}`;
    const now = new Date();
    const formattedDate = now.toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    const newOrder: Order = {
      ...data,
      id: orderId,
      createdAt: now.toISOString(),
      status: 'pending',
      statusHistory: [
        {
          status: 'pending',
          timestamp: formattedDate,
          note: 'Aapka order website par mosool ho gaya hai. Hamari team jald iski tasdeeq karegi.',
        },
      ],
    };

    // Deduct stock for ordered items
    if (Array.isArray(data.items)) {
      data.items.forEach((item: { product: { id: string }; quantity: number }) => {
        const prod = dbData.products.find((p) => p.id === item.product.id);
        if (prod) {
          prod.stock = Math.max(0, prod.stock - (item.quantity || 1));
          prod.inStock = prod.stock > 0;
        }
      });
    }

    dbData.orders.unshift(newOrder);
    saveDatabase();
    res.status(201).json(newOrder);
  });

  // 8. Update order status (Admin)
  app.put('/api/orders/:id/status', (req, res) => {
    const { id } = req.params;
    const { status, note, courierName, courierTrackingNumber } = req.body as {
      status: OrderStatus;
      note?: string;
      courierName?: string;
      courierTrackingNumber?: string;
    };

    const order = dbData.orders.find((o) => o.id === id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const now = new Date();
    const formattedDate = now.toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    const statusNotes: Record<OrderStatus, string> = {
      pending: 'Order tasdeeq ke intezar mein hai (Pending)',
      confirmed: 'Order ki tasdeeq mukammal ho gayi hai (Confirmed)',
      processing: 'Kapra cutting aur packing jari hai (Cutting & Packing in progress)',
      dispatched: courierTrackingNumber
        ? `Parcel ${courierName || 'Courier'} ke hawale kar diya gaya. Tracking: ${courierTrackingNumber}`
        : 'Parcel courier service ke hawale kar diya gaya (Dispatched)',
      delivered: 'Order kamyabi se customer ko deliver ho gaya (Delivered)',
      cancelled: 'Order mansookh kar diya gaya hai (Cancelled)',
    };

    order.status = status;
    if (courierName !== undefined) order.courierName = courierName;
    if (courierTrackingNumber !== undefined) order.courierTrackingNumber = courierTrackingNumber;

    order.statusHistory.push({
      status,
      timestamp: formattedDate,
      note: note || statusNotes[status] || `Status updated to ${status}`,
    });

    saveDatabase();
    res.json(order);
  });

  // 9. Get store settings
  app.get('/api/settings', (req, res) => {
    // Exclude actual adminPin from public payload
    const { adminPin, ...safeSettings } = dbData.settings;
    res.json({ ...safeSettings, hasPinSet: !!adminPin });
  });

  // 10. Update store settings (Admin)
  app.put('/api/settings', (req, res) => {
    const updates = req.body;
    dbData.settings = { ...dbData.settings, ...updates };
    saveDatabase();
    res.json(dbData.settings);
  });

  // 11. Admin login verification
  app.post('/api/admin/verify', (req, res) => {
    const { pin } = req.body;
    const currentPin = dbData.settings.adminPin || '1234';

    if (pin === currentPin) {
      const secretToken = `admin-token-${Date.now()}`;
      return res.json({ success: true, token: secretToken });
    }

    res.status(401).json({ success: false, error: 'Ghalat PIN code! (Incorrect PIN)' });
  });

  // 12. Reset to defaults
  app.post('/api/admin/reset', (req, res) => {
    dbData = {
      products: INITIAL_PRODUCTS,
      orders: INITIAL_ORDERS,
      settings: INITIAL_SETTINGS,
      categories: INITIAL_CATEGORIES,
    };
    saveDatabase();
    res.json({ success: true, message: 'Store reset to factory defaults' });
  });

  // --- VITE MIDDLEWARE (DEV) OR STATIC FILES (PROD) ---
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
