export type ProductCategory = string;

export interface CategoryItem {
  id: string; // e.g. 'ladies-suits', 'shawls', 'ready-to-wear'
  name: string; // e.g. 'Ladies Suits'
  nameRomanUrdu: string; // e.g. 'Zanana Suit'
  icon?: string; // 'layers' | 'scissors' | 'sparkles' | 'wind' | 'bed' | 'heart' | 'shirt' | 'shopping-bag' | 'tag' | 'gift' | 'star'
  description?: string;
  isSystem?: boolean;
}

export interface Product {
  id: string;
  title: string;
  titleRomanUrdu: string;
  category: ProductCategory;
  categoryName: string;
  price: number;
  originalPrice?: number;
  unit: string; // e.g. "3-Piece Suit (Unstitched)", "4-Meter Cut", "9 Gaz Roll", "King Size (Set of 3)"
  stock: number;
  inStock: boolean;
  images: string[];
  description: string;
  fabric: string; // e.g. "Pure Lawn 90/70", "Egyptian Cotton", "Gotta & Resham Work"
  badge?: string; // "Bestseller" | "Nayi Variety" | "Khas Discount"
  isFeatured?: boolean;
  rating: number;
  reviewsCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'dispatched'
  | 'delivered'
  | 'cancelled';

export interface OrderStatusHistoryItem {
  status: OrderStatus;
  timestamp: string;
  note: string;
}

export interface OrderItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string; // e.g. "KCLC-1001"
  createdAt: string;
  customerName: string;
  phone: string;
  altPhone?: string;
  city: string;
  address: string;
  notes?: string;
  paymentMethod: 'cod' | 'easypaisa' | 'jazzcash' | 'bank';
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  courierName?: string; // e.g. "TCS Express", "Leopards", "Trax"
  courierTrackingNumber?: string;
  statusHistory: OrderStatusHistoryItem[];
}

export interface StoreSettings {
  storeName: string;
  phone: string;
  whatsapp: string;
  address: string;
  announcement: string;
  freeDeliveryThreshold: number;
  standardDeliveryFee: number;
  adminPin: string;
}
