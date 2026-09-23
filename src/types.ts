export type PrimaryCategory = 'ai' | 'finance' | 'communication';
export type CategoryFilter = 'all' | PrimaryCategory;

export interface Chapter {
  title: string;
  description: string;
}

export interface Product {
  id: string;
  title: string;
  category: PrimaryCategory;
  shortDescription: string;
  fullDescription: string;
  price: number; // in INR base
  originalPrice?: number;
  discount?: number; // percentage discount (e.g. 20 for 20% off)
  coverImage: string;
  productFormat: string; // e.g. "Digital eBook (PDF & EPUB)"
  whatsIncluded: string[];
  whatYoullLearn: string[];
  whoItsFor: string[];
  chapters: Chapter[];
  features: string[];
  isBundle?: boolean;
  isFeatured?: boolean;
  isPublished?: boolean;
  digitalFile?: string; // name or download reference
  badge?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP';

export type CustomerAccountTab = 'overview' | 'library' | 'orders' | 'settings';

export type CurrentView = 
  | { page: 'home' }
  | { page: 'all-products' }
  | { page: 'category'; category: PrimaryCategory }
  | { page: 'product'; productId: string }
  | { page: 'login'; redirectAfter?: string }
  | { page: 'signup'; redirectAfter?: string }
  | { page: 'account'; tab?: CustomerAccountTab }
  | { page: 'admin'; section?: 'overview' | 'products' | 'orders' | 'customers' | 'coupons' | 'settings' }
  | { page: 'admin-login' };

export interface PurchasedEbook {
  productId: string;
  productTitle: string;
  price: number;
  purchasedAt: string;
  orderId?: string;
  licenseKey?: string;
  coverImage?: string;
}

export interface CustomerProfile {
  id: string;
  userId?: string;
  email: string;
  name: string;
  phone?: string;
  purchasedProducts: PurchasedEbook[];
  totalSpent: number;
  orderCount: number;
  createdAt: string;
  lastOrderDate?: string;
}
