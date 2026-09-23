import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db, OWNER_EMAIL } from './firebase';
import { Product, PrimaryCategory } from '../types';
import { INITIAL_PRODUCTS } from '../data/products';

export interface OrderRecord {
  id: string;
  orderRef?: string;
  userId?: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  productIds: string[];
  productTitles: string[];
  amount: number;
  currency: string;
  paymentStatus: 'completed' | 'pending' | 'failed';
  paymentMethod: string;
  licenseKey: string;
  orderDate: string;
  createdAt?: any;
}

export interface CustomerRecord {
  id: string;
  email: string;
  name: string;
  phone?: string;
  purchasedProducts: {
    productId: string;
    productTitle: string;
    price: number;
    purchasedAt: string;
  }[];
  totalSpent: number;
  orderCount: number;
  createdAt: string;
  lastOrderDate: string;
}

export interface CouponRecord {
  id: string;
  code: string;
  discountPercent: number;
  isActive: boolean;
  expiryDate?: string;
  usageCount: number;
  description?: string;
}

export interface TestimonialRecord {
  id: string;
  authorName: string;
  authorTitle: string;
  quote: string;
  discipline: 'ai' | 'finance' | 'communication' | 'general';
  isApproved: boolean;
  rating?: number;
  createdAt: string;
}

export interface HomepageConfigRecord {
  id: string;
  headline: string;
  tagline: string;
  featuredProductIds: string[];
  announcement?: string;
  updatedAt: string;
}

export interface CategoryRecord {
  id: PrimaryCategory;
  name: string;
  tagline: string;
  description: string;
  accent: string;
}

export interface AdminUserRecord {
  id: string;
  email: string;
  role: 'owner' | 'admin';
  createdAt: string;
}

// -------------------------------------------------------------
// ADMIN AUTHORIZATION CHECK
// -------------------------------------------------------------
export async function checkIsAdmin(uid: string, email: string | null): Promise<boolean> {
  if (!uid) return false;
  
  // 1. Direct Owner Email Match
  if (email && email.toLowerCase() === OWNER_EMAIL.toLowerCase()) {
    // Auto-provision the owner document in admins collection for rules lookup
    try {
      await setDoc(doc(db, 'admins', uid), {
        email: email.toLowerCase(),
        role: 'owner',
        createdAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.warn('Owner doc auto-provision note:', e);
    }
    return true;
  }

  // 2. Check UID in Firestore 'admins'
  try {
    const adminDoc = await getDoc(doc(db, 'admins', uid));
    if (adminDoc.exists()) return true;

    // 3. Check Email in Firestore 'admins'
    if (email) {
      const emailDoc = await getDoc(doc(db, 'admins', email.toLowerCase()));
      if (emailDoc.exists()) return true;
    }
  } catch (err) {
    console.error('Error checking admin permissions:', err);
  }

  return false;
}

// -------------------------------------------------------------
// HELPER: SANITIZE OBJECTS FOR FIRESTORE
// -------------------------------------------------------------
/**
 * Recursively strips undefined values and normalizes primitives for Firestore.
 * Firestore rejects any document containing `undefined` values.
 */
export function sanitizeForFirestore<T extends Record<string, any>>(obj: T): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined) {
      continue;
    }
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      result[key] = sanitizeForFirestore(value);
    } else if (Array.isArray(value)) {
      result[key] = value
        .filter((item) => item !== undefined)
        .map((item) => (item !== null && typeof item === 'object' ? sanitizeForFirestore(item) : item));
    } else {
      result[key] = value;
    }
  }
  return result;
}

// -------------------------------------------------------------
// PRODUCTS MANAGEMENT
// -------------------------------------------------------------
export async function fetchProductsFromFirestore(): Promise<Product[]> {
  try {
    const snap = await getDocs(collection(db, 'products'));
    const firestoreMap = new Map<string, Product>();

    if (!snap.empty) {
      snap.forEach((d) => {
        const data = d.data() as Product;
        firestoreMap.set(d.id, { ...data, id: d.id });
      });
    }

    // Merge with INITIAL_PRODUCTS:
    // Any document saved in Firestore overrides INITIAL_PRODUCTS.
    // Any INITIAL_PRODUCT not yet customized in Firestore is preserved.
    // Any newly created products in Firestore are included.
    const mergedList: Product[] = [];
    const processedIds = new Set<string>();

    for (const initP of INITIAL_PRODUCTS) {
      if (firestoreMap.has(initP.id)) {
        mergedList.push(firestoreMap.get(initP.id)!);
      } else {
        mergedList.push(initP);
      }
      processedIds.add(initP.id);
    }

    firestoreMap.forEach((fProd, fId) => {
      if (!processedIds.has(fId)) {
        mergedList.push(fProd);
        processedIds.add(fId);
      }
    });

    return mergedList;
  } catch (err) {
    console.error('Error loading products from Firestore, falling back to initial:', err);
    return INITIAL_PRODUCTS;
  }
}

export async function saveProductToFirestore(product: Product): Promise<void> {
  if (!product.id || typeof product.id !== 'string' || product.id.trim() === '') {
    throw new Error('Product ID is required for saving.');
  }

  const payload = sanitizeForFirestore({
    id: product.id.trim(),
    title: product.title?.trim() || '',
    category: (product.category as PrimaryCategory) || 'ai',
    shortDescription: product.shortDescription?.trim() || '',
    fullDescription: product.fullDescription?.trim() || '',
    price: typeof product.price === 'number' ? product.price : (Number(product.price) || 0),
    originalPrice: product.originalPrice !== undefined ? (Number(product.originalPrice) || 0) : 0,
    discount: product.discount !== undefined ? (Number(product.discount) || 0) : 0,
    badge: product.badge?.trim() || '',
    coverImage: product.coverImage?.trim() || '',
    productFormat: product.productFormat?.trim() || 'Digital eBook (PDF & EPUB)',
    digitalFile: product.digitalFile?.trim() || '',
    whatsIncluded: Array.isArray(product.whatsIncluded) ? product.whatsIncluded : [],
    whatYoullLearn: Array.isArray(product.whatYoullLearn) ? product.whatYoullLearn : [],
    whoItsFor: Array.isArray(product.whoItsFor) ? product.whoItsFor : [],
    chapters: Array.isArray(product.chapters)
      ? product.chapters.map((ch) => ({
          title: ch?.title?.trim() || '',
          description: ch?.description?.trim() || ''
        }))
      : [],
    features: Array.isArray(product.features) ? product.features : [],
    isPublished: product.isPublished !== undefined ? Boolean(product.isPublished) : true,
    isFeatured: Boolean(product.isFeatured),
    isBundle: Boolean(product.isBundle),
    updatedAt: new Date().toISOString()
  });

  try {
    const docRef = doc(db, 'products', payload.id);
    await setDoc(docRef, payload, { merge: true });
  } catch (err: any) {
    console.error(`Failed to save product "${payload.id}" to Firestore:`, err);
    throw new Error(err?.message || `Failed to persist product "${payload.id}" to Firestore.`);
  }
}

export async function deleteProductFromFirestore(productId: string): Promise<void> {
  await deleteDoc(doc(db, 'products', productId));
}

// -------------------------------------------------------------
// ORDERS & CUSTOMERS
// -------------------------------------------------------------
export async function fetchOrdersFromFirestore(): Promise<OrderRecord[]> {
  try {
    const snap = await getDocs(collection(db, 'orders'));
    const orders: OrderRecord[] = [];
    snap.forEach((d) => {
      orders.push({ ...d.data(), id: d.id } as OrderRecord);
    });
    // Sort descending by date
    orders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
    return orders;
  } catch (err) {
    console.error('Error fetching orders:', err);
    return [];
  }
}

export async function recordOrderInFirestore(order: Omit<OrderRecord, 'id'>): Promise<string> {
  const colRef = collection(db, 'orders');
  const docRef = await addDoc(colRef, {
    ...order,
    createdAt: serverTimestamp()
  });

  // Also update or create customer record
  try {
    const customerId = order.customerEmail.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const custRef = doc(db, 'customers', customerId);
    const custSnap = await getDoc(custRef);

    const purchasedItems = order.productIds.map((pid, idx) => ({
      productId: pid,
      productTitle: order.productTitles[idx] || pid,
      price: Math.round(order.amount / order.productIds.length),
      purchasedAt: order.orderDate
    }));

    if (custSnap.exists()) {
      const current = custSnap.data() as CustomerRecord;
      await updateDoc(custRef, {
        purchasedProducts: [...(current.purchasedProducts || []), ...purchasedItems],
        totalSpent: (current.totalSpent || 0) + order.amount,
        orderCount: (current.orderCount || 0) + 1,
        lastOrderDate: order.orderDate
      });
    } else {
      await setDoc(custRef, {
        id: customerId,
        email: order.customerEmail,
        name: order.customerName,
        phone: order.customerPhone || '',
        purchasedProducts: purchasedItems,
        totalSpent: order.amount,
        orderCount: 1,
        createdAt: order.orderDate,
        lastOrderDate: order.orderDate
      });
    }
  } catch (custErr) {
    console.warn('Error updating customer record on order:', custErr);
  }

  return docRef.id;
}

export async function fetchCustomersFromFirestore(): Promise<CustomerRecord[]> {
  try {
    const snap = await getDocs(collection(db, 'customers'));
    const customers: CustomerRecord[] = [];
    snap.forEach((d) => {
      customers.push({ ...d.data(), id: d.id } as CustomerRecord);
    });
    customers.sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0));
    return customers;
  } catch (err) {
    console.error('Error fetching customers:', err);
    return [];
  }
}

// -------------------------------------------------------------
// CATEGORIES
// -------------------------------------------------------------
export const DEFAULT_CATEGORIES: CategoryRecord[] = [
  {
    id: 'ai',
    name: 'AI & Intelligence',
    tagline: 'Build with AI. Create more. Earn smarter.',
    description: 'Practical guides, prompt blueprints, and modern artificial intelligence workflows designed to multiply output and sovereign earnings.',
    accent: '#3B82F6'
  },
  {
    id: 'finance',
    name: 'Finance & Wealth Mastery',
    tagline: 'Understand money. Build better financial habits.',
    description: 'Disciplined capital frameworks, budgeting systems, wealth preservation doctrine, and scalable revenue diversification.',
    accent: '#10B981'
  },
  {
    id: 'communication',
    name: 'Executive Communication',
    tagline: 'Speak clearly. Communicate confidently.',
    description: 'High-leverage interpersonal persuasion, strategic vocal presence, negotiation architectures, and leadership clarity.',
    accent: '#8B5CF6'
  }
];

export async function fetchCategoriesFromFirestore(): Promise<CategoryRecord[]> {
  try {
    const snap = await getDocs(collection(db, 'categories'));
    if (!snap.empty) {
      const cats: CategoryRecord[] = [];
      snap.forEach((d) => cats.push({ ...d.data(), id: d.id as PrimaryCategory } as CategoryRecord));
      return cats;
    }
    // Seed defaults
    const batch = writeBatch(db);
    for (const c of DEFAULT_CATEGORIES) {
      batch.set(doc(db, 'categories', c.id), c);
    }
    await batch.commit();
    return DEFAULT_CATEGORIES;
  } catch (err) {
    return DEFAULT_CATEGORIES;
  }
}

export async function saveCategoryToFirestore(category: CategoryRecord): Promise<void> {
  await setDoc(doc(db, 'categories', category.id), category, { merge: true });
}

// -------------------------------------------------------------
// COUPONS
// -------------------------------------------------------------
export const DEFAULT_COUPONS: CouponRecord[] = [
  {
    id: 'novora10',
    code: 'NOVORA10',
    discountPercent: 10,
    isActive: true,
    usageCount: 42,
    description: 'Official 10% store privilege code'
  },
  {
    id: 'wealth20',
    code: 'WEALTH20',
    discountPercent: 20,
    isActive: true,
    usageCount: 15,
    description: 'Special seasonal promotion'
  }
];

export async function fetchCouponsFromFirestore(): Promise<CouponRecord[]> {
  try {
    const snap = await getDocs(collection(db, 'coupons'));
    if (!snap.empty) {
      const coupons: CouponRecord[] = [];
      snap.forEach((d) => coupons.push({ ...d.data(), id: d.id } as CouponRecord));
      return coupons;
    }
    const batch = writeBatch(db);
    for (const c of DEFAULT_COUPONS) {
      batch.set(doc(db, 'coupons', c.id), c);
    }
    await batch.commit();
    return DEFAULT_COUPONS;
  } catch (err) {
    return DEFAULT_COUPONS;
  }
}

export async function saveCouponToFirestore(coupon: CouponRecord): Promise<void> {
  await setDoc(doc(db, 'coupons', coupon.id), coupon, { merge: true });
}

export async function deleteCouponFromFirestore(couponId: string): Promise<void> {
  await deleteDoc(doc(db, 'coupons', couponId));
}

// -------------------------------------------------------------
// TESTIMONIALS (Admin-curated only)
// -------------------------------------------------------------
export const DEFAULT_TESTIMONIALS: TestimonialRecord[] = [
  {
    id: 't-1',
    authorName: 'Vikram Malhotra',
    authorTitle: 'Founder, Apex Digital Labs',
    quote: 'The AI Income Blueprint completely restructured how our product studio uses generative pipelines. Practical, zero fluff, and extraordinarily dense with value.',
    discipline: 'ai',
    isApproved: true,
    rating: 5,
    createdAt: '2026-03-10'
  },
  {
    id: 't-2',
    authorName: 'Ananya Deshmukh',
    authorTitle: 'Investment Banker & Angel Investor',
    quote: 'Personal Finance for Beginners and Salary Budgeting are modern masterpieces for anyone navigating the Indian tax and capital growth ecosystem.',
    discipline: 'finance',
    isApproved: true,
    rating: 5,
    createdAt: '2026-03-14'
  },
  {
    id: 't-3',
    authorName: 'Rohan Sethi',
    authorTitle: 'Head of Enterprise Sales',
    quote: 'Speak With Confidence directly impacted my ability to command boardrooms. The vocal modulation chapters alone paid for the publication 100x over.',
    discipline: 'communication',
    isApproved: true,
    rating: 5,
    createdAt: '2026-03-18'
  }
];

export async function fetchTestimonialsFromFirestore(): Promise<TestimonialRecord[]> {
  try {
    const snap = await getDocs(collection(db, 'testimonials'));
    if (!snap.empty) {
      const list: TestimonialRecord[] = [];
      snap.forEach((d) => list.push({ ...d.data(), id: d.id } as TestimonialRecord));
      return list;
    }
    const batch = writeBatch(db);
    for (const t of DEFAULT_TESTIMONIALS) {
      batch.set(doc(db, 'testimonials', t.id), t);
    }
    await batch.commit();
    return DEFAULT_TESTIMONIALS;
  } catch (err) {
    return DEFAULT_TESTIMONIALS;
  }
}

export async function saveTestimonialToFirestore(t: TestimonialRecord): Promise<void> {
  await setDoc(doc(db, 'testimonials', t.id), t, { merge: true });
}

export async function deleteTestimonialFromFirestore(id: string): Promise<void> {
  await deleteDoc(doc(db, 'testimonials', id));
}

// -------------------------------------------------------------
// HOMEPAGE CONFIG
// -------------------------------------------------------------
export const DEFAULT_HOMEPAGE_CONFIG: HomepageConfigRecord = {
  id: 'main',
  headline: 'High-Leverage Blueprints For Sovereign Minds',
  tagline: 'Executive monographs, autonomous AI architectures, and disciplined communication protocols.',
  featuredProductIds: ['ai-income-blueprint', 'personal-finance-beginners', 'speak-with-confidence', 'novora-ai-bundle'],
  announcement: 'Complimentary Pan-India UPI & Instant DRM-free Access Active.',
  updatedAt: new Date().toISOString()
};

export async function fetchHomepageConfigFromFirestore(): Promise<HomepageConfigRecord> {
  try {
    const snap = await getDoc(doc(db, 'homepage_config', 'main'));
    if (snap.exists()) {
      return snap.data() as HomepageConfigRecord;
    }
    await setDoc(doc(db, 'homepage_config', 'main'), DEFAULT_HOMEPAGE_CONFIG);
    return DEFAULT_HOMEPAGE_CONFIG;
  } catch (err) {
    return DEFAULT_HOMEPAGE_CONFIG;
  }
}

export async function saveHomepageConfigToFirestore(cfg: HomepageConfigRecord): Promise<void> {
  await setDoc(doc(db, 'homepage_config', 'main'), {
    ...cfg,
    updatedAt: new Date().toISOString()
  }, { merge: true });
}

// -------------------------------------------------------------
// CUSTOMER AUTH & DASHBOARD SERVICES
// -------------------------------------------------------------
export async function syncCustomerAfterAuth(
  uid: string,
  email: string,
  displayName?: string | null
): Promise<{
  id: string;
  email: string;
  name: string;
  phone?: string;
  purchasedProducts: any[];
  totalSpent: number;
  orderCount: number;
  createdAt: string;
}> {
  const customerId = email.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const userRef = doc(db, 'users', uid);
  const custRef = doc(db, 'customers', customerId);

  let profileData = {
    id: uid,
    userId: uid,
    email: email.toLowerCase(),
    name: displayName || email.split('@')[0] || 'Executive Member',
    purchasedProducts: [] as any[],
    totalSpent: 0,
    orderCount: 0,
    createdAt: new Date().toISOString()
  };

  try {
    const [userSnap, custSnap] = await Promise.all([
      getDoc(userRef),
      getDoc(custRef)
    ]);

    if (userSnap.exists()) {
      const uData = userSnap.data();
      profileData = { ...profileData, ...uData };
    }

    if (custSnap.exists()) {
      const cData = custSnap.data() as CustomerRecord;
      profileData.purchasedProducts = cData.purchasedProducts || profileData.purchasedProducts;
      profileData.totalSpent = cData.totalSpent || profileData.totalSpent;
      profileData.orderCount = cData.orderCount || profileData.orderCount;
      if (cData.name && !userSnap.exists()) profileData.name = cData.name;
      if (cData.phone) (profileData as any).phone = cData.phone;
    }

    // Persist/Update user profile in Firestore
    await setDoc(userRef, {
      id: uid,
      email: email.toLowerCase(),
      name: profileData.name,
      phone: (profileData as any).phone || '',
      role: 'customer',
      lastLoginAt: new Date().toISOString()
    }, { merge: true });

    // Link customer record if exists
    if (custSnap.exists()) {
      await updateDoc(custRef, {
        userId: uid
      });
    }
  } catch (err) {
    console.warn('Customer profile sync note:', err);
  }

  return profileData;
}

export async function fetchCustomerOrders(email: string): Promise<OrderRecord[]> {
  try {
    const colRef = collection(db, 'orders');
    const q = query(colRef, where('customerEmail', '==', email.toLowerCase()));
    const snap = await getDocs(q);
    const orders: OrderRecord[] = [];
    snap.forEach((d) => {
      orders.push({ ...d.data(), id: d.id } as OrderRecord);
    });

    if (email !== email.toLowerCase()) {
      const q2 = query(colRef, where('customerEmail', '==', email));
      const snap2 = await getDocs(q2);
      snap2.forEach((d) => {
        if (!orders.some((o) => o.id === d.id)) {
          orders.push({ ...d.data(), id: d.id } as OrderRecord);
        }
      });
    }

    orders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
    return orders;
  } catch (err) {
    console.error('Error fetching customer orders:', err);
    return [];
  }
}

export async function updateCustomerProfileData(
  uid: string,
  email: string,
  updates: { name?: string; phone?: string }
): Promise<void> {
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, updates, { merge: true });

  const customerId = email.toLowerCase().replace(/[^a-z0-9]/g, '_');
  try {
    const custRef = doc(db, 'customers', customerId);
    await setDoc(custRef, updates, { merge: true });
  } catch (e) {
    console.warn('Customer record sync note:', e);
  }
}
