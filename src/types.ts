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

export type CurrentView = 
  | { page: 'home' }
  | { page: 'all-products' }
  | { page: 'category'; category: PrimaryCategory }
  | { page: 'product'; productId: string }
  | { page: 'admin' }
  | { page: 'admin-login' };
