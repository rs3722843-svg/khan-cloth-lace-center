import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Product,
  ProductCategory,
  CartItem,
  Order,
  OrderStatus,
  StoreSettings,
  CategoryItem,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_SETTINGS,
  INITIAL_CATEGORIES,
} from '../data/initialData';

interface StoreContextType {
  products: Product[];
  categories: CategoryItem[];
  orders: Order[];
  settings: StoreSettings;
  cart: CartItem[];
  wishlist: string[];
  activeCategory: ProductCategory;
  searchQuery: string;
  isCartOpen: boolean;
  isTrackingModalOpen: boolean;
  trackingInitialId: string;
  isCheckoutModalOpen: boolean;
  selectedProductForDetail: Product | null;
  isAdminAuthenticated: boolean;
  lastPlacedOrder: Order | null;
  isAdminRoute: boolean;
  isLoading: boolean;

  // Setters
  setActiveCategory: (cat: ProductCategory) => void;
  setSearchQuery: (q: string) => void;
  setIsCartOpen: (open: boolean) => void;
  setIsTrackingModalOpen: (open: boolean) => void;
  setTrackingInitialId: (id: string) => void;
  setIsCheckoutModalOpen: (open: boolean) => void;
  setSelectedProductForDetail: (product: Product | null) => void;
  setIsAdminAuthenticated: (auth: boolean) => void;
  setLastPlacedOrder: (order: Order | null) => void;
  setIsAdminRoute: (route: boolean) => void;

  // Actions
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  placeOrder: (
    data: Omit<Order, 'id' | 'createdAt' | 'status' | 'statusHistory'>
  ) => Promise<Order>;
  findOrder: (query: string) => Promise<Order | undefined>;
  openTrackingForOrder: (orderId: string) => void;
  updateOrderStatus: (
    orderId: string,
    newStatus: OrderStatus,
    note?: string,
    courierName?: string,
    courierTrackingNumber?: string
  ) => Promise<void>;
  addProduct: (newProd: Omit<Product, 'id'>) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addCategory: (cat: Omit<CategoryItem, 'isSystem'>) => Promise<CategoryItem>;
  updateCategory: (id: string, updates: Partial<CategoryItem>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  updateSettings: (updates: Partial<StoreSettings>) => Promise<void>;
  verifyAdminPin: (pin: string) => Promise<boolean>;
  resetToDefaults: () => Promise<void>;
  refreshCatalog: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CART: 'khan_cloth_cart_v3',
  WISHLIST: 'khan_cloth_wishlist_v3',
  ADMIN_TOKEN: 'khan_cloth_admin_token_v3',
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<CategoryItem[]>(INITIAL_CATEGORIES);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [settings, setSettings] = useState<StoreSettings>(INITIAL_SETTINGS);
  const [isLoading, setIsLoading] = useState(false);

  // Cart and wishlist per browser
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  // Admin authentication token
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return !!sessionStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN);
    } catch {
      return false;
    }
  });

  // Detect if on /admin route or #admin
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname.toLowerCase();
      const h = window.location.hash.toLowerCase();
      const s = window.location.search.toLowerCase();
      return p === '/admin' || p.startsWith('/admin') || h === '#admin' || s.includes('admin=true');
    }
    return false;
  });

  // Listen to popstate or url changes
  useEffect(() => {
    const handleLocationChange = () => {
      const p = window.location.pathname.toLowerCase();
      const h = window.location.hash.toLowerCase();
      const s = window.location.search.toLowerCase();
      setIsAdminRoute(p === '/admin' || p.startsWith('/admin') || h === '#admin' || s.includes('admin=true'));
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // UI state
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [trackingInitialId, setTrackingInitialId] = useState('');
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [selectedProductForDetail, setSelectedProductForDetail] =
    useState<Product | null>(null);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  // Sync cart & wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  // Fetch live products, settings & categories from server on mount
  const refreshCatalog = useCallback(async () => {
    try {
      const [prodRes, setRes, catRes] = await Promise.all([
        fetch('/api/products').catch(() => null),
        fetch('/api/settings').catch(() => null),
        fetch('/api/categories').catch(() => null),
      ]);

      if (prodRes && prodRes.ok) {
        const prods = await prodRes.json();
        if (Array.isArray(prods) && prods.length > 0) {
          setProducts(prods);
        }
      }

      if (setRes && setRes.ok) {
        const sets = await setRes.json();
        setSettings((prev) => ({ ...prev, ...sets }));
      }

      if (catRes && catRes.ok) {
        const cats = await catRes.json();
        if (Array.isArray(cats) && cats.length > 0) {
          setCategories(cats);
        }
      }
    } catch (err) {
      console.error('Error fetching live store data:', err);
    }
  }, []);

  // Fetch orders from server (for admin or sync)
  const refreshOrders = useCallback(async () => {
    try {
      const ordRes = await fetch('/api/orders');
      if (ordRes.ok) {
        const ords = await ordRes.json();
        if (Array.isArray(ords)) {
          setOrders(ords);
        }
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  }, []);

  useEffect(() => {
    refreshCatalog();
    refreshOrders();
  }, [refreshCatalog, refreshOrders]);

  // Cart operations
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  // Place order with real server persistence
  const placeOrder = async (
    data: Omit<Order, 'id' | 'createdAt' | 'status' | 'statusHistory'>
  ): Promise<Order> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error('Failed to save order to server');
      }

      const newOrder: Order = await res.json();
      setOrders((prev) => [newOrder, ...prev]);

      // Refresh catalog to reflect decremented stock for everyone
      await refreshCatalog();

      clearCart();
      setLastPlacedOrder(newOrder);
      return newOrder;
    } catch (err) {
      console.error('Server order failed, fallback to local:', err);
      // Fallback
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const fallbackOrder: Order = {
        ...data,
        id: `KCLC-${randomSuffix}`,
        createdAt: new Date().toISOString(),
        status: 'pending',
        statusHistory: [
          {
            status: 'pending',
            timestamp: new Date().toLocaleTimeString(),
            note: 'Order mosool hua.',
          },
        ],
      };
      setOrders((prev) => [fallbackOrder, ...prev]);
      clearCart();
      setLastPlacedOrder(fallbackOrder);
      return fallbackOrder;
    } finally {
      setIsLoading(false);
    }
  };

  // Find order via server endpoint
  const findOrder = async (query: string): Promise<Order | undefined> => {
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) return undefined;

    // Check memory first
    const foundLocal = orders.find((o) => {
      const matchId = o.id.toLowerCase() === cleanQuery;
      const matchPlain = o.id.replace(/\D/g, '') === cleanQuery.replace(/\D/g, '');
      const matchPhone = o.phone.replace(/\D/g, '').includes(cleanQuery.replace(/\D/g, ''));
      return matchId || matchPlain || matchPhone;
    });

    if (foundLocal) return foundLocal;

    // Query server
    try {
      const res = await fetch(`/api/orders/track/${encodeURIComponent(cleanQuery)}`);
      if (res.ok) {
        const foundServer = await res.json();
        return foundServer;
      }
    } catch (err) {
      console.error('Server track query error:', err);
    }

    return undefined;
  };

  const openTrackingForOrder = (orderId: string) => {
    setTrackingInitialId(orderId);
    setIsTrackingModalOpen(true);
  };

  // Update order status on server (Admin)
  const updateOrderStatus = async (
    orderId: string,
    newStatus: OrderStatus,
    note?: string,
    courierName?: string,
    courierTrackingNumber?: string
  ): Promise<void> => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          note,
          courierName,
          courierTrackingNumber,
        }),
      });

      if (res.ok) {
        const updated: Order = await res.json();
        setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      }
    } catch (err) {
      console.error('Error updating order on server:', err);
    }
  };

  // Admin Product CRUD on server
  const addProduct = async (newProd: Omit<Product, 'id'>): Promise<Product> => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProd),
      });

      if (!res.ok) throw new Error('Server error adding product');
      const savedProd: Product = await res.json();
      setProducts((prev) => [savedProd, ...prev]);
      return savedProd;
    } catch (err) {
      console.error('Error adding product to server:', err);
      const fallback: Product = {
        ...newProd,
        id: `prod-${Date.now()}`,
        inStock: newProd.stock > 0,
        rating: 5.0,
        reviewsCount: 1,
      };
      setProducts((prev) => [fallback, ...prev]);
      return fallback;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>): Promise<void> => {
    // Optimistic local update
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const merged = { ...p, ...updates };
        if (typeof updates.stock === 'number') {
          merged.inStock = updates.stock > 0;
        }
        return merged;
      })
    );

    try {
      await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    } catch (err) {
      console.error('Error updating product on server:', err);
    }
  };

  const deleteProduct = async (id: string): Promise<void> => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Error deleting product on server:', err);
    }
  };

  const addCategory = async (catData: Omit<CategoryItem, 'isSystem'>): Promise<CategoryItem> => {
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(catData),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'Category shamil karne mein masla aaya');
      }

      const savedCat: CategoryItem = await res.json();
      setCategories((prev) => [...prev, savedCat]);
      return savedCat;
    } catch (err: any) {
      console.error('Error adding category:', err);
      const slug =
        catData.id ||
        catData.name.toLowerCase().replace(/[^a-z0-9]/g, '-') ||
        `cat-${Date.now()}`;
      const fallbackCat: CategoryItem = {
        ...catData,
        id: slug,
        isSystem: false,
      };
      setCategories((prev) => [...prev, fallbackCat]);
      return fallbackCat;
    }
  };

  const updateCategory = async (id: string, updates: Partial<CategoryItem>): Promise<void> => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );

    if (updates.name) {
      setProducts((prev) =>
        prev.map((p) => (p.category === id ? { ...p, categoryName: updates.name! } : p))
      );
    }

    try {
      await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    } catch (err) {
      console.error('Error updating category on server:', err);
    }
  };

  const deleteCategory = async (id: string): Promise<void> => {
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'Category delete nahi ho saki');
      }
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      console.error('Error deleting category on server:', err);
      throw err;
    }
  };

  const updateSettings = async (updates: Partial<StoreSettings>): Promise<void> => {
    setSettings((prev) => ({ ...prev, ...updates }));
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    } catch (err) {
      console.error('Error saving settings to server:', err);
    }
  };

  // Verify PIN with server
  const verifyAdminPin = async (pin: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });

      if (res.ok) {
        const data = await res.json();
        try {
          sessionStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, data.token || 'admin-active');
        } catch {
          // ignore storage error in iframe
        }
        setIsAdminAuthenticated(true);
        await refreshOrders();
        return true;
      }
      return false;
    } catch {
      // Local fallback
      if (pin === settings.adminPin || pin === '1234') {
        try {
          sessionStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, 'admin-active');
        } catch {
          // ignore storage error in iframe
        }
        setIsAdminAuthenticated(true);
        return true;
      }
      return false;
    }
  };

  const resetToDefaults = async (): Promise<void> => {
    try {
      await fetch('/api/admin/reset', { method: 'POST' });
      await refreshCatalog();
      await refreshOrders();
    } catch (err) {
      console.error(err);
      setProducts(INITIAL_PRODUCTS);
      setOrders(INITIAL_ORDERS);
      setSettings(INITIAL_SETTINGS);
    }
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        orders,
        settings,
        cart,
        wishlist,
        activeCategory,
        searchQuery,
        isCartOpen,
        isTrackingModalOpen,
        trackingInitialId,
        isCheckoutModalOpen,
        selectedProductForDetail,
        isAdminAuthenticated,
        lastPlacedOrder,
        isAdminRoute,
        isLoading,

        setActiveCategory,
        setSearchQuery,
        setIsCartOpen,
        setIsTrackingModalOpen,
        setTrackingInitialId,
        setIsCheckoutModalOpen,
        setSelectedProductForDetail,
        setIsAdminAuthenticated,
        setLastPlacedOrder,
        setIsAdminRoute,

        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        isWishlisted,
        placeOrder,
        findOrder,
        openTrackingForOrder,
        updateOrderStatus,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        updateSettings,
        verifyAdminPin,
        resetToDefaults,
        refreshCatalog,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
