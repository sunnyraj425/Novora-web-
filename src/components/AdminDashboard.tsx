import React, { useState, useEffect } from 'react';
import { 
  Product, 
  PrimaryCategory, 
  Currency,
  Chapter
} from '../types';
import { formatPrice, saveStoredProducts } from '../data/products';
import { useAuth } from '../lib/AuthContext';
import { 
  fetchProductsFromFirestore,
  saveProductToFirestore,
  deleteProductFromFirestore,
  fetchOrdersFromFirestore,
  fetchCustomersFromFirestore,
  fetchCategoriesFromFirestore,
  saveCategoryToFirestore,
  fetchCouponsFromFirestore,
  saveCouponToFirestore,
  deleteCouponFromFirestore,
  fetchTestimonialsFromFirestore,
  saveTestimonialToFirestore,
  deleteTestimonialFromFirestore,
  fetchHomepageConfigFromFirestore,
  saveHomepageConfigToFirestore,
  OrderRecord,
  CustomerRecord,
  CategoryRecord,
  CouponRecord,
  TestimonialRecord,
  HomepageConfigRecord
} from '../lib/firestoreService';
import { NovoraLogo } from './NovoraLogo';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  FolderTree, 
  Tag, 
  MessageSquareQuote, 
  Home, 
  Settings, 
  LogOut, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  Save, 
  Upload, 
  FileText, 
  Sparkles, 
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export type AdminSection = 
  | 'dashboard' 
  | 'products' 
  | 'orders' 
  | 'customers' 
  | 'categories' 
  | 'coupons' 
  | 'testimonials' 
  | 'homepage' 
  | 'settings';

interface AdminDashboardProps {
  onBackToStore: () => void;
  onNavigateToCategory?: (cat: PrimaryCategory) => void;
  initialEditProduct?: Product | null;
  initialSection?: AdminSection;
  onProductUpdated?: (product: Product, allProducts: Product[]) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onBackToStore,
  onNavigateToCategory,
  initialEditProduct = null,
  initialSection,
  onProductUpdated,
}) => {
  const { user, isAdmin, signOut, ownerEmail } = useAuth();

  // Active section
  const [activeSection, setActiveSection] = useState<AdminSection>(
    initialSection || (initialEditProduct ? 'products' : 'dashboard')
  );

  // Firestore Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [coupons, setCoupons] = useState<CouponRecord[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialRecord[]>([]);
  const [homepageConfig, setHomepageConfig] = useState<HomepageConfigRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusNotification, setStatusNotification] = useState<string | null>(null);

  // Product Form state & Save handling
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    category: 'ai',
    price: 999,
    isPublished: true,
    isFeatured: false,
    productFormat: 'Instant DRM-Free PDF + EPUB',
    whatsIncluded: [],
    whatYoullLearn: [],
    whoItsFor: [],
    chapters: [],
    features: [],
  });

  // Coupon form state
  const [isAddingCoupon, setIsAddingCoupon] = useState(false);
  const [couponForm, setCouponForm] = useState<Partial<CouponRecord>>({
    code: '',
    discountPercent: 10,
    isActive: true,
    usageCount: 0
  });

  // Testimonial form state
  const [isAddingTestimonial, setIsAddingTestimonial] = useState(false);
  const [testimonialForm, setTestimonialForm] = useState<Partial<TestimonialRecord>>({
    authorName: '',
    authorTitle: '',
    quote: '',
    discipline: 'ai',
    isApproved: true,
    rating: 5
  });

  // Category filter in Products tab
  const [productCategoryFilter, setProductCategoryFilter] = useState<'all' | PrimaryCategory>('all');
  const [productSearch, setProductSearch] = useState('');

  const notify = (msg: string) => {
    setStatusNotification(msg);
    setTimeout(() => setStatusNotification(null), 3000);
  };

  // Load all data from Firestore
  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [prods, ords, custs, cats, cpus, tests, hp] = await Promise.all([
        fetchProductsFromFirestore(),
        fetchOrdersFromFirestore(),
        fetchCustomersFromFirestore(),
        fetchCategoriesFromFirestore(),
        fetchCouponsFromFirestore(),
        fetchTestimonialsFromFirestore(),
        fetchHomepageConfigFromFirestore()
      ]);

      setProducts(prods);
      setOrders(ords);
      setCustomers(custs);
      setCategories(cats);
      setCoupons(cpus);
      setTestimonials(tests);
      setHomepageConfig(hp);
    } catch (err) {
      console.error('Error loading Firestore data:', err);
      notify('Notice: Loading remote data. Falling back to local cache if offline.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    if (initialEditProduct) {
      handleStartEditProduct(initialEditProduct);
    }
  }, [initialEditProduct]);

  // Refresh handler
  const handleRefresh = () => {
    setIsRefreshing(true);
    loadAllData();
    notify('Dashboard synced with Firebase Firestore.');
  };

  // -------------------------------------------------------------
  // PRODUCT ACTIONS
  // -------------------------------------------------------------
  const handleStartCreateProduct = () => {
    setProductForm({
      id: `novora-${Date.now().toString(36)}`,
      title: '',
      category: 'ai',
      shortDescription: '',
      fullDescription: '',
      price: 999,
      originalPrice: 1999,
      discount: 50,
      coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
      productFormat: 'Instant DRM-Free PDF + EPUB',
      whatsIncluded: ['Comprehensive master eBook (PDF & EPUB)', 'Actionable spreadsheet framework', 'Lifetime revision updates'],
      whatYoullLearn: ['Fundamental operational principles', 'Step-by-step implementation guide', 'High-leverage scaling tactics'],
      whoItsFor: ['Founders, executives & sovereign operators seeking compounding leverage.'],
      chapters: [
        { title: 'Chapter 01: Foundations & Architecture', description: 'Core principles and mental models.' },
        { title: 'Chapter 02: Execution Protocol', description: 'Step-by-step practical implementation.' }
      ],
      features: ['DRM-Free Universal Format', 'Immediate Digital Delivery'],
      isBundle: false,
      isFeatured: false,
      isPublished: true,
      digitalFile: 'novora_publication_master.pdf',
      badge: 'New Release'
    });
    setEditingProductId(null);
    setSaveError(null);
    setSaveSuccess(null);
    setIsEditingProduct(true);
  };

  const handleStartEditProduct = (prod: Product) => {
    setProductForm({
      id: prod.id,
      title: prod.title || '',
      category: prod.category || 'ai',
      shortDescription: prod.shortDescription || '',
      fullDescription: prod.fullDescription || '',
      price: prod.price ?? 0,
      originalPrice: prod.originalPrice ?? 0,
      discount: prod.discount ?? 0,
      coverImage: prod.coverImage || '',
      productFormat: prod.productFormat || 'Digital eBook (PDF & EPUB)',
      digitalFile: prod.digitalFile || '',
      badge: prod.badge || '',
      isPublished: prod.isPublished !== undefined ? prod.isPublished : true,
      isFeatured: prod.isFeatured ?? false,
      isBundle: prod.isBundle ?? false,
      whatsIncluded: Array.isArray(prod.whatsIncluded) ? [...prod.whatsIncluded] : [],
      whatYoullLearn: Array.isArray(prod.whatYoullLearn) ? [...prod.whatYoullLearn] : [],
      whoItsFor: Array.isArray(prod.whoItsFor) ? [...prod.whoItsFor] : [],
      chapters: Array.isArray(prod.chapters) ? prod.chapters.map(c => ({ title: c.title || '', description: c.description || '' })) : [],
      features: Array.isArray(prod.features) ? [...prod.features] : []
    });
    setEditingProductId(prod.id);
    setSaveError(null);
    setSaveSuccess(null);
    setIsEditingProduct(true);
    setActiveSection('products');
  };

  const handleAddChapter = () => {
    const currentChapters = productForm.chapters || [];
    const nextNum = currentChapters.length + 1;
    setProductForm({
      ...productForm,
      chapters: [
        ...currentChapters,
        { title: `Chapter ${String(nextNum).padStart(2, '0')}: `, description: '' }
      ]
    });
  };

  const handleUpdateChapter = (index: number, field: 'title' | 'description', value: string) => {
    const currentChapters = [...(productForm.chapters || [])];
    if (currentChapters[index]) {
      currentChapters[index] = {
        ...currentChapters[index],
        [field]: value
      };
      setProductForm({ ...productForm, chapters: currentChapters });
    }
  };

  const handleRemoveChapter = (index: number) => {
    const currentChapters = (productForm.chapters || []).filter((_, i) => i !== index);
    setProductForm({ ...productForm, chapters: currentChapters });
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSavingProduct) return;

    setSaveError(null);
    setSaveSuccess(null);

    if (!productForm.title?.trim()) {
      setSaveError('Please enter a valid product title.');
      return;
    }
    if (productForm.price === undefined || productForm.price === null || isNaN(Number(productForm.price))) {
      setSaveError('Please enter a valid selling price.');
      return;
    }
    if (!productForm.category) {
      setSaveError('Please choose a valid product category.');
      return;
    }

    // Preserve the exact document ID when editing; do NOT generate a new ID or create duplicate
    const targetDocId = editingProductId ? editingProductId : (productForm.id || `novora-${Date.now().toString(36)}`);

    const finalProduct: Product = {
      id: targetDocId,
      title: productForm.title.trim(),
      category: (productForm.category as PrimaryCategory) || 'ai',
      shortDescription: productForm.shortDescription?.trim() || '',
      fullDescription: productForm.fullDescription?.trim() || '',
      price: Math.max(0, Number(productForm.price) || 0),
      originalPrice: Math.max(0, Number(productForm.originalPrice) || 0),
      discount: Math.max(0, Math.min(100, Number(productForm.discount) || 0)),
      coverImage: productForm.coverImage?.trim() || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
      productFormat: productForm.productFormat?.trim() || 'Instant DRM-Free PDF + EPUB',
      digitalFile: productForm.digitalFile?.trim() || 'novora_publication_master.pdf',
      badge: productForm.badge?.trim() || '',
      isPublished: productForm.isPublished !== undefined ? Boolean(productForm.isPublished) : true,
      isFeatured: Boolean(productForm.isFeatured),
      isBundle: Boolean(productForm.isBundle),
      whatsIncluded: Array.isArray(productForm.whatsIncluded) ? productForm.whatsIncluded : [],
      whatYoullLearn: Array.isArray(productForm.whatYoullLearn) ? productForm.whatYoullLearn : [],
      whoItsFor: Array.isArray(productForm.whoItsFor) ? productForm.whoItsFor : [],
      chapters: Array.isArray(productForm.chapters)
        ? productForm.chapters.map((ch) => ({
            title: ch.title?.trim() || '',
            description: ch.description?.trim() || ''
          }))
        : [],
      features: Array.isArray(productForm.features) ? productForm.features : []
    };

    setIsSavingProduct(true);

    try {
      // 1. Persist directly to Firebase Firestore
      await saveProductToFirestore(finalProduct);

      // 2. Update local state and catalog cache immediately
      let updatedCatalog: Product[] = [];
      setProducts((prev) => {
        const idx = prev.findIndex((p) => p.id === finalProduct.id);
        if (idx >= 0) {
          updatedCatalog = [...prev];
          updatedCatalog[idx] = finalProduct;
        } else {
          updatedCatalog = [finalProduct, ...prev];
        }
        // Sync with localStorage so refresh immediately displays the persisted changes
        saveStoredProducts(updatedCatalog);
        return updatedCatalog;
      });

      // 3. Inform parent component if callback provided
      onProductUpdated?.(finalProduct, updatedCatalog);

      // 4. Show success message
      setSaveSuccess('Product updated successfully.');
      notify('Product updated successfully.');

      // 5. Close edit modal after visual confirmation
      setTimeout(() => {
        setIsEditingProduct(false);
        setEditingProductId(null);
        setSaveSuccess(null);
      }, 1000);
    } catch (err: any) {
      console.error('Firestore Product Save Failure:', err);
      setSaveError(err?.message || 'Failed to update product in Firebase Firestore.');
    } finally {
      setIsSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"?`)) return;
    try {
      await deleteProductFromFirestore(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      notify(`Deleted "${title}".`);
    } catch (err: any) {
      alert(`Failed to delete product: ${err.message}`);
    }
  };

  const handleTogglePublishProduct = async (prod: Product) => {
    const updated = { ...prod, isPublished: !prod.isPublished };
    try {
      await saveProductToFirestore(updated);
      setProducts((prev) => prev.map((p) => (p.id === prod.id ? updated : p)));
      notify(`${prod.title} is now ${updated.isPublished ? 'Published' : 'Draft'}.`);
    } catch (err: any) {
      alert(`Error updating publication status: ${err.message}`);
    }
  };

  // Image Upload helper (converts to base64 for reliable instant preview)
  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvt) => {
        if (uploadEvt.target?.result) {
          setProductForm((prev) => ({ ...prev, coverImage: uploadEvt.target!.result as string }));
          notify('Cover image loaded.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // -------------------------------------------------------------
  // CATEGORY ACTIONS
  // -------------------------------------------------------------
  const handleSaveCategory = async (cat: CategoryRecord) => {
    try {
      await saveCategoryToFirestore(cat);
      setCategories((prev) => prev.map((c) => (c.id === cat.id ? cat : c)));
      notify(`Category "${cat.name}" updated.`);
    } catch (err: any) {
      alert(`Error updating category: ${err.message}`);
    }
  };

  // -------------------------------------------------------------
  // COUPON ACTIONS
  // -------------------------------------------------------------
  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponForm.code || !couponForm.discountPercent) return;
    const newCoupon: CouponRecord = {
      id: couponForm.id || couponForm.code.toLowerCase().trim(),
      code: couponForm.code.toUpperCase().trim(),
      discountPercent: Number(couponForm.discountPercent),
      isActive: couponForm.isActive ?? true,
      usageCount: couponForm.usageCount || 0,
      description: couponForm.description || ''
    };
    try {
      await saveCouponToFirestore(newCoupon);
      setCoupons((prev) => {
        const idx = prev.findIndex((c) => c.id === newCoupon.id);
        if (idx >= 0) {
          const cp = [...prev];
          cp[idx] = newCoupon;
          return cp;
        }
        return [...prev, newCoupon];
      });
      setIsAddingCoupon(false);
      setCouponForm({ code: '', discountPercent: 10, isActive: true, usageCount: 0 });
      notify(`Coupon ${newCoupon.code} saved.`);
    } catch (err: any) {
      alert(`Error saving coupon: ${err.message}`);
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm('Delete coupon?')) return;
    try {
      await deleteCouponFromFirestore(id);
      setCoupons((prev) => prev.filter((c) => c.id !== id));
      notify('Coupon removed.');
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  // -------------------------------------------------------------
  // TESTIMONIAL ACTIONS
  // -------------------------------------------------------------
  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testimonialForm.authorName || !testimonialForm.quote) return;
    const item: TestimonialRecord = {
      id: testimonialForm.id || `t-${Date.now()}`,
      authorName: testimonialForm.authorName,
      authorTitle: testimonialForm.authorTitle || '',
      quote: testimonialForm.quote,
      discipline: (testimonialForm.discipline as any) || 'ai',
      isApproved: testimonialForm.isApproved ?? true,
      rating: testimonialForm.rating || 5,
      createdAt: new Date().toISOString().split('T')[0]
    };
    try {
      await saveTestimonialToFirestore(item);
      setTestimonials((prev) => [item, ...prev.filter((t) => t.id !== item.id)]);
      setIsAddingTestimonial(false);
      setTestimonialForm({ authorName: '', authorTitle: '', quote: '', discipline: 'ai', isApproved: true, rating: 5 });
      notify('Testimonial saved.');
    } catch (err: any) {
      alert(`Error saving testimonial: ${err.message}`);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm('Delete testimonial?')) return;
    try {
      await deleteTestimonialFromFirestore(id);
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
      notify('Testimonial deleted.');
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  // -------------------------------------------------------------
  // HOMEPAGE CONFIG ACTIONS
  // -------------------------------------------------------------
  const handleSaveHomepage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!homepageConfig) return;
    try {
      await saveHomepageConfigToFirestore(homepageConfig);
      notify('Homepage configuration saved.');
    } catch (err: any) {
      alert(`Error saving homepage config: ${err.message}`);
    }
  };

  // -------------------------------------------------------------
  // COMPUTED STATS (NO FAKE DATA)
  // -------------------------------------------------------------
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === 'completed')
    .reduce((acc, o) => acc + (o.amount || 0), 0);

  const completedOrdersCount = orders.filter((o) => o.paymentStatus === 'completed').length;
  const publishedProductsCount = products.filter((p) => p.isPublished).length;

  const filteredProducts = products.filter((p) => {
    const matchesCat = productCategoryFilter === 'all' || p.category === productCategoryFilter;
    const matchesQuery = !productSearch.trim() || 
      p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(productSearch.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-[#040404] text-[#F5F5F5] flex flex-col md:flex-row font-sans">
      
      {/* Toast Notification */}
      {statusNotification && (
        <div className="fixed top-6 right-6 z-50 bg-[#080808] border border-[#D4AF37] text-white text-xs px-4 py-3 rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.9)] flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-[#F5D76E]" />
          <span>{statusNotification}</span>
        </div>
      )}

      {/* --------------------------------------------------------- */}
      {/* SIDEBAR NAVIGATION */}
      {/* --------------------------------------------------------- */}
      <aside className="w-full md:w-64 bg-[#070707] border-r border-[#D4AF37]/20 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand header */}
          <div className="p-6 border-b border-[#D4AF37]/15">
            <NovoraLogo variant="horizontal" size="sm" />
            <div className="mt-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37]">
                Executive Control
              </span>
            </div>
          </div>

          {/* Nav Items (Exactly the 9 sections) */}
          <nav className="p-3 space-y-1 text-xs">
            
            <button
              onClick={() => { setIsEditingProduct(false); setActiveSection('dashboard'); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-all text-left cursor-pointer ${
                activeSection === 'dashboard'
                  ? 'bg-[#D4AF37]/15 text-[#F5D76E] border border-[#D4AF37]/40 font-semibold'
                  : 'text-[#A8A8A8] hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>1. Dashboard</span>
            </button>

            <button
              onClick={() => { setIsEditingProduct(false); setActiveSection('products'); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-all text-left cursor-pointer ${
                activeSection === 'products'
                  ? 'bg-[#D4AF37]/15 text-[#F5D76E] border border-[#D4AF37]/40 font-semibold'
                  : 'text-[#A8A8A8] hover:text-white hover:bg-white/5'
              }`}
            >
              <Package className="w-4 h-4" />
              <div className="flex-1 flex items-center justify-between">
                <span>2. Products</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 text-white font-mono">
                  {products.length}
                </span>
              </div>
            </button>

            <button
              onClick={() => { setIsEditingProduct(false); setActiveSection('orders'); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-all text-left cursor-pointer ${
                activeSection === 'orders'
                  ? 'bg-[#D4AF37]/15 text-[#F5D76E] border border-[#D4AF37]/40 font-semibold'
                  : 'text-[#A8A8A8] hover:text-white hover:bg-white/5'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <div className="flex-1 flex items-center justify-between">
                <span>3. Orders</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 text-white font-mono">
                  {orders.length}
                </span>
              </div>
            </button>

            <button
              onClick={() => { setIsEditingProduct(false); setActiveSection('customers'); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-all text-left cursor-pointer ${
                activeSection === 'customers'
                  ? 'bg-[#D4AF37]/15 text-[#F5D76E] border border-[#D4AF37]/40 font-semibold'
                  : 'text-[#A8A8A8] hover:text-white hover:bg-white/5'
              }`}
            >
              <Users className="w-4 h-4" />
              <div className="flex-1 flex items-center justify-between">
                <span>4. Customers</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 text-white font-mono">
                  {customers.length}
                </span>
              </div>
            </button>

            <button
              onClick={() => { setIsEditingProduct(false); setActiveSection('categories'); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-all text-left cursor-pointer ${
                activeSection === 'categories'
                  ? 'bg-[#D4AF37]/15 text-[#F5D76E] border border-[#D4AF37]/40 font-semibold'
                  : 'text-[#A8A8A8] hover:text-white hover:bg-white/5'
              }`}
            >
              <FolderTree className="w-4 h-4" />
              <span>5. Categories (3)</span>
            </button>

            <button
              onClick={() => { setIsEditingProduct(false); setActiveSection('coupons'); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-all text-left cursor-pointer ${
                activeSection === 'coupons'
                  ? 'bg-[#D4AF37]/15 text-[#F5D76E] border border-[#D4AF37]/40 font-semibold'
                  : 'text-[#A8A8A8] hover:text-white hover:bg-white/5'
              }`}
            >
              <Tag className="w-4 h-4" />
              <span>6. Coupons</span>
            </button>

            <button
              onClick={() => { setIsEditingProduct(false); setActiveSection('testimonials'); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-all text-left cursor-pointer ${
                activeSection === 'testimonials'
                  ? 'bg-[#D4AF37]/15 text-[#F5D76E] border border-[#D4AF37]/40 font-semibold'
                  : 'text-[#A8A8A8] hover:text-white hover:bg-white/5'
              }`}
            >
              <MessageSquareQuote className="w-4 h-4" />
              <span>7. Testimonials</span>
            </button>

            <button
              onClick={() => { setIsEditingProduct(false); setActiveSection('homepage'); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-all text-left cursor-pointer ${
                activeSection === 'homepage'
                  ? 'bg-[#D4AF37]/15 text-[#F5D76E] border border-[#D4AF37]/40 font-semibold'
                  : 'text-[#A8A8A8] hover:text-white hover:bg-white/5'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>8. Homepage</span>
            </button>

            <button
              onClick={() => { setIsEditingProduct(false); setActiveSection('settings'); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-all text-left cursor-pointer ${
                activeSection === 'settings'
                  ? 'bg-[#D4AF37]/15 text-[#F5D76E] border border-[#D4AF37]/40 font-semibold'
                  : 'text-[#A8A8A8] hover:text-white hover:bg-white/5'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>9. Settings</span>
            </button>

          </nav>
        </div>

        {/* Bottom User Bar & Storefront link */}
        <div className="p-4 border-t border-white/5 bg-[#050505] space-y-3">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <div className="text-[11px] font-medium text-white truncate">
                {user?.email || ownerEmail}
              </div>
              <div className="text-[9px] font-mono text-[#D4AF37] uppercase">
                Authorized Owner
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="p-1.5 rounded hover:bg-white/10 text-[#888] hover:text-red-400 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onBackToStore}
            className="w-full py-2 px-3 rounded border border-[#D4AF37]/30 text-white hover:bg-white/5 transition-colors text-xs flex items-center justify-center gap-2 cursor-pointer font-medium"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Return to Store</span>
          </button>
        </div>
      </aside>

      {/* --------------------------------------------------------- */}
      {/* MAIN CONTENT AREA */}
      {/* --------------------------------------------------------- */}
      <main className="flex-1 min-w-0 bg-[#040404] flex flex-col overflow-y-auto">
        
        {/* Top Action Bar */}
        <header className="h-16 px-4 sm:px-6 border-b border-[#D4AF37]/20 flex items-center justify-between bg-[#060606] sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="md:hidden">
              <NovoraLogo variant="compact" size="sm" />
            </div>
            <h1 className="font-serif text-base sm:text-lg font-light text-white capitalize tracking-wide">
              {activeSection}
            </h1>
            <span className="text-[11px] text-[#666] font-mono uppercase hidden sm:inline">
              / Firestore Live
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 rounded border border-white/10 hover:border-[#D4AF37] text-[#A8A8A8] hover:text-white transition-colors cursor-pointer"
              title="Sync from Firestore"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#D4AF37]' : ''}`} />
            </button>

            {activeSection === 'products' && !isEditingProduct && (
              <button
                onClick={handleStartCreateProduct}
                className="px-3.5 py-1.5 rounded bg-gradient-to-r from-[#D4AF37] to-[#C9A227] text-black text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 hover:brightness-110 transition-all cursor-pointer shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Product</span>
              </button>
            )}
          </div>
        </header>

        {/* Content Body */}
        <div className="p-6 sm:p-8 flex-1">
          
          {/* ======================================================= */}
          {/* 1. DASHBOARD OVERVIEW */}
          {/* ======================================================= */}
          {activeSection === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              
              {/* Metric Cards (Real Production Stats, No Fake Data) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                
                <div className="p-5 rounded-xl bg-[#080808] border border-[#D4AF37]/25 relative overflow-hidden">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#A8A8A8] block">
                    Gross Completed Revenue
                  </span>
                  <div className="text-2xl sm:text-3xl font-serif text-[#F5D76E] font-normal mt-2">
                    {formatPrice(totalRevenue, 'INR')}
                  </div>
                  <span className="text-[10px] text-[#666] mt-1 block">
                    Real orders ledger from Firestore
                  </span>
                </div>

                <div className="p-5 rounded-xl bg-[#080808] border border-[#D4AF37]/25 relative overflow-hidden">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#A8A8A8] block">
                    Completed Orders
                  </span>
                  <div className="text-2xl sm:text-3xl font-serif text-white font-normal mt-2">
                    {completedOrdersCount}
                  </div>
                  <span className="text-[10px] text-[#666] mt-1 block">
                    Total recorded: {orders.length}
                  </span>
                </div>

                <div className="p-5 rounded-xl bg-[#080808] border border-[#D4AF37]/25 relative overflow-hidden">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#A8A8A8] block">
                    Customer Database
                  </span>
                  <div className="text-2xl sm:text-3xl font-serif text-white font-normal mt-2">
                    {customers.length}
                  </div>
                  <span className="text-[10px] text-[#666] mt-1 block">
                    Unique purchaser profiles
                  </span>
                </div>

                <div className="p-5 rounded-xl bg-[#080808] border border-[#D4AF37]/25 relative overflow-hidden">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#A8A8A8] block">
                    Active Catalog
                  </span>
                  <div className="text-2xl sm:text-3xl font-serif text-white font-normal mt-2">
                    {publishedProductsCount} <span className="text-xs text-[#888]">/ {products.length}</span>
                  </div>
                  <span className="text-[10px] text-[#666] mt-1 block">
                    Across AI, Finance, Communication
                  </span>
                </div>

              </div>

              {/* Category Breakdown & Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 3 Categories Breakdown */}
                <div className="lg:col-span-2 p-6 rounded-xl bg-[#080808] border border-[#D4AF37]/20 space-y-4">
                  <h3 className="font-serif text-lg text-white font-light">
                    The 3 Sovereign Disciplines
                  </h3>
                  <p className="text-xs text-[#888] font-light">
                    NOVORA strictly enforces exactly three primary digital knowledge categories.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    {(['ai', 'finance', 'communication'] as PrimaryCategory[]).map((cat) => {
                      const count = products.filter((p) => p.category === cat).length;
                      return (
                        <div
                          key={cat}
                          onClick={() => {
                            setProductCategoryFilter(cat);
                            setActiveSection('products');
                          }}
                          className="p-4 rounded-lg bg-[#050505] border border-white/10 hover:border-[#D4AF37] transition-all cursor-pointer group"
                        >
                          <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] block">
                            Discipline
                          </span>
                          <span className="font-serif text-base text-white uppercase mt-1 block group-hover:text-[#F5D76E] transition-colors">
                            {cat}
                          </span>
                          <span className="text-xs text-[#888] mt-2 block font-mono">
                            {count} Publications
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Shortcuts */}
                <div className="p-6 rounded-xl bg-[#080808] border border-[#D4AF37]/20 space-y-4 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-lg text-white font-light">
                      Quick Operations
                    </h3>
                    <p className="text-xs text-[#888] font-light mt-1">
                      Direct shortcuts for store administration.
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    <button
                      onClick={handleStartCreateProduct}
                      className="w-full py-2.5 px-3 rounded-lg bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#F5D76E] text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span>Add New Digital Publication</span>
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setActiveSection('orders')}
                      className="w-full py-2.5 px-3 rounded-lg bg-[#050505] hover:bg-white/5 border border-white/10 text-white text-xs flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span>Inspect Recent Orders</span>
                      <ShoppingCart className="w-3.5 h-3.5 text-[#D4AF37]" />
                    </button>
                    <button
                      onClick={() => setActiveSection('homepage')}
                      className="w-full py-2.5 px-3 rounded-lg bg-[#050505] hover:bg-white/5 border border-white/10 text-white text-xs flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span>Configure Homepage Featured</span>
                      <Home className="w-3.5 h-3.5 text-[#D4AF37]" />
                    </button>
                  </div>
                </div>

              </div>

              {/* Recent Orders Stream */}
              <div className="p-6 rounded-xl bg-[#080808] border border-[#D4AF37]/20 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg text-white font-light">
                    Recent Purchase Ledger
                  </h3>
                  <button
                    onClick={() => setActiveSection('orders')}
                    className="text-xs text-[#D4AF37] hover:underline cursor-pointer"
                  >
                    View All Orders →
                  </button>
                </div>

                {orders.length === 0 ? (
                  <div className="p-8 text-center text-xs text-[#666] border border-dashed border-white/10 rounded-lg">
                    No orders have been recorded in Firestore yet. Test purchases made in checkout will appear here in real-time.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-white/10 text-[#888] font-mono uppercase text-[10px]">
                          <th className="py-2.5 px-3">Order Ref</th>
                          <th className="py-2.5 px-3">Customer</th>
                          <th className="py-2.5 px-3">Products</th>
                          <th className="py-2.5 px-3">Amount</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {orders.slice(0, 5).map((o) => (
                          <tr key={o.id} className="hover:bg-white/[0.02]">
                            <td className="py-3 px-3 font-mono text-[#D4AF37]">{o.id.substring(0, 10)}</td>
                            <td className="py-3 px-3">
                              <div className="font-medium text-white">{o.customerName}</div>
                              <div className="text-[10px] text-[#666]">{o.customerEmail}</div>
                            </td>
                            <td className="py-3 px-3 truncate max-w-xs text-[#A8A8A8]">
                              {o.productTitles?.join(', ') || o.productIds?.join(', ')}
                            </td>
                            <td className="py-3 px-3 font-semibold text-white">
                              {formatPrice(o.amount, 'INR')}
                            </td>
                            <td className="py-3 px-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                                o.paymentStatus === 'completed'
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                  : 'bg-amber-950 text-amber-300 border border-amber-800'
                              }`}>
                                {o.paymentStatus}
                              </span>
                            </td>
                            <td className="py-3 px-3 font-mono text-[#666] text-[10px]">
                              {o.orderDate?.split('T')[0] || 'Today'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ======================================================= */}
          {/* 2. PRODUCTS SECTION */}
          {/* ======================================================= */}
          {activeSection === 'products' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* EDIT / CREATE FORM MODAL OR INLINE VIEW */}
              {isEditingProduct ? (
                <div className="bg-[#080808] border border-[#D4AF37]/35 rounded-xl p-6 sm:p-8 space-y-6">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <h2 className="font-serif text-2xl text-white font-light">
                        {editingProductId ? 'Edit Product Publication' : 'Add New Digital Product'}
                      </h2>
                      <p className="text-xs text-[#888]">
                        Changes sync directly to Firestore and update the storefront immediately.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsEditingProduct(false)}
                      className="p-1.5 rounded hover:bg-white/10 text-[#888] hover:text-white transition-colors cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveProduct} className="space-y-6">
                    
                    {/* Visual Success & Error Banners */}
                    {saveSuccess && (
                      <div className="p-4 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2.5 animate-in fade-in">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="font-semibold text-sm">{saveSuccess}</span>
                      </div>
                    )}

                    {saveError && (
                      <div className="p-4 rounded-lg bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-center gap-2.5 animate-in fade-in">
                        <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                        <span className="font-semibold">{saveError}</span>
                      </div>
                    )}

                    {/* Document ID Preservation Indicator */}
                    {editingProductId && (
                      <div className="flex items-center justify-between px-3.5 py-2 rounded-lg bg-[#040404] border border-[#D4AF37]/25 text-[11px] font-mono">
                        <span className="text-[#888]">Target Firestore Document ID:</span>
                        <span className="text-[#F5D76E] font-bold">{editingProductId}</span>
                      </div>
                    )}

                    {/* Basic Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-[#A8A8A8] mb-1.5">
                          Product Title / Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={productForm.title || ''}
                          onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                          placeholder="e.g. AI Income Blueprint"
                          className="w-full bg-[#040404] border border-[#D4AF37]/30 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#F5D76E]"
                        />
                      </div>

                      {/* STRICT CATEGORY DROPDOWN: ONLY AI, FINANCE, COMMUNICATION */}
                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-[#A8A8A8] mb-1.5">
                          Category * (Strictly 3 Disciplines)
                        </label>
                        <select
                          required
                          value={productForm.category || 'ai'}
                          onChange={(e) => setProductForm({ ...productForm, category: e.target.value as PrimaryCategory })}
                          className="w-full bg-[#040404] border border-[#D4AF37]/40 text-[#F5D76E] rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#F5D76E] font-mono uppercase"
                        >
                          <option value="ai">AI</option>
                          <option value="finance">FINANCE</option>
                          <option value="communication">COMMUNICATION</option>
                        </select>
                      </div>

                    </div>

                    {/* Pricing & Ribbon Badge */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-[#A8A8A8] mb-1.5">
                          Selling Price (₹ INR) *
                        </label>
                        <input
                          type="number"
                          required
                          min={0}
                          value={productForm.price ?? 0}
                          onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                          className="w-full bg-[#040404] border border-[#D4AF37]/30 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#F5D76E]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-[#A8A8A8] mb-1.5">
                          Original Price (₹ INR)
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={productForm.originalPrice ?? 0}
                          onChange={(e) => setProductForm({ ...productForm, originalPrice: Number(e.target.value) })}
                          className="w-full bg-[#040404] border border-[#D4AF37]/30 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#F5D76E]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-[#A8A8A8] mb-1.5">
                          Discount %
                        </label>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={productForm.discount ?? 0}
                          onChange={(e) => setProductForm({ ...productForm, discount: Number(e.target.value) })}
                          className="w-full bg-[#040404] border border-[#D4AF37]/30 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#F5D76E]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-[#A8A8A8] mb-1.5">
                          Ribbon Badge
                        </label>
                        <input
                          type="text"
                          value={productForm.badge || ''}
                          onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                          placeholder="e.g. Flagship, Bestseller, Bundle"
                          className="w-full bg-[#040404] border border-[#D4AF37]/30 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#F5D76E]"
                        />
                      </div>
                    </div>

                    {/* Descriptions */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-[#A8A8A8] mb-1.5">
                          Short Description / Hook
                        </label>
                        <input
                          type="text"
                          value={productForm.shortDescription || ''}
                          onChange={(e) => setProductForm({ ...productForm, shortDescription: e.target.value })}
                          placeholder="Concise one-liner summary of value proposition"
                          className="w-full bg-[#040404] border border-[#D4AF37]/30 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#F5D76E]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-[#A8A8A8] mb-1.5">
                          Full Comprehensive Description
                        </label>
                        <textarea
                          rows={4}
                          value={productForm.fullDescription || ''}
                          onChange={(e) => setProductForm({ ...productForm, fullDescription: e.target.value })}
                          placeholder="Detailed overview explaining why this publication matters..."
                          className="w-full bg-[#040404] border border-[#D4AF37]/30 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#F5D76E]"
                        />
                      </div>
                    </div>

                    {/* Product Format & Digital Deliverable Asset */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-[#A8A8A8] mb-1.5">
                          Product Format *
                        </label>
                        <input
                          type="text"
                          value={productForm.productFormat || ''}
                          onChange={(e) => setProductForm({ ...productForm, productFormat: e.target.value })}
                          placeholder="e.g. Instant DRM-Free PDF + EPUB"
                          className="w-full bg-[#040404] border border-[#D4AF37]/30 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#F5D76E]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-[#A8A8A8] mb-1.5">
                          Digital Asset Deliverable (File / Storage Key)
                        </label>
                        <input
                          type="text"
                          value={productForm.digitalFile || ''}
                          onChange={(e) => setProductForm({ ...productForm, digitalFile: e.target.value })}
                          placeholder="e.g. novora-ai-income-blueprint.pdf"
                          className="w-full bg-[#040404] border border-[#D4AF37]/30 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#F5D76E]"
                        />
                      </div>
                    </div>

                    {/* Cover Image Upload */}
                    <div className="p-4 rounded-lg bg-[#050505] border border-white/5 space-y-3">
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-[#A8A8A8]">
                        Product Cover Image (URL or Upload)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={productForm.coverImage || ''}
                          onChange={(e) => setProductForm({ ...productForm, coverImage: e.target.value })}
                          placeholder="https://..."
                          className="flex-1 bg-[#030303] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white"
                        />
                        <label className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs flex items-center gap-1.5 cursor-pointer shrink-0">
                          <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>Upload File</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleCoverUpload}
                          />
                        </label>
                      </div>
                      {productForm.coverImage && (
                        <div className="flex items-center gap-3 pt-1">
                          <img
                            src={productForm.coverImage}
                            alt="Cover Preview"
                            className="w-16 h-20 object-cover rounded border border-[#D4AF37]/40 shadow-sm"
                          />
                          <span className="text-[10px] text-[#888]">Live Cover Image Preview</span>
                        </div>
                      )}
                    </div>

                    {/* Features & Deliverables Checklist */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-[#A8A8A8] mb-1.5">
                          Product Features (1 per line)
                        </label>
                        <textarea
                          rows={3}
                          value={productForm.features?.join('\n') || ''}
                          onChange={(e) => setProductForm({ ...productForm, features: e.target.value.split('\n').filter(Boolean) })}
                          placeholder="Step-by-step practical implementation&#10;DRM-free universal PDF and EPUB formats&#10;Interactive workflow schematics"
                          className="w-full bg-[#040404] border border-[#D4AF37]/30 rounded-lg px-3 py-2 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-[#A8A8A8] mb-1.5">
                          What's Included (1 per line)
                        </label>
                        <textarea
                          rows={3}
                          value={productForm.whatsIncluded?.join('\n') || ''}
                          onChange={(e) => setProductForm({ ...productForm, whatsIncluded: e.target.value.split('\n').filter(Boolean) })}
                          placeholder="Complete 120-page Master Guide&#10;Editable Notion Workflow Hub&#10;Lifetime Revision Updates"
                          className="w-full bg-[#040404] border border-[#D4AF37]/30 rounded-lg px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>

                    {/* Learning Outcomes & Target Audience */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-[#A8A8A8] mb-1.5">
                          What You'll Learn (1 per line)
                        </label>
                        <textarea
                          rows={3}
                          value={productForm.whatYoullLearn?.join('\n') || ''}
                          onChange={(e) => setProductForm({ ...productForm, whatYoullLearn: e.target.value.split('\n').filter(Boolean) })}
                          placeholder="How to prompt LLMs for production software&#10;Building high-converting digital assets&#10;Autonomous monetization pipelines"
                          className="w-full bg-[#040404] border border-[#D4AF37]/30 rounded-lg px-3 py-2 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-[#A8A8A8] mb-1.5">
                          Who It's For (1 per line)
                        </label>
                        <textarea
                          rows={3}
                          value={productForm.whoItsFor?.join('\n') || ''}
                          onChange={(e) => setProductForm({ ...productForm, whoItsFor: e.target.value.split('\n').filter(Boolean) })}
                          placeholder="Digital freelancers seeking to accelerate deliverable speed&#10;Consultants looking to integrate AI into existing service models"
                          className="w-full bg-[#040404] border border-[#D4AF37]/30 rounded-lg px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>

                    {/* CHAPTERS CURRICULUM SECTION */}
                    <div className="p-4 rounded-lg bg-[#050505] border border-white/5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="block text-[11px] font-mono uppercase tracking-wider text-[#A8A8A8]">
                            Curriculum Chapters ({productForm.chapters?.length || 0})
                          </label>
                          <p className="text-[10px] text-[#666]">
                            Breakdown of modules or chapters displayed in the publication syllabus.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleAddChapter}
                          className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-[#F5D76E] text-xs font-mono flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Chapter</span>
                        </button>
                      </div>

                      {productForm.chapters && productForm.chapters.length > 0 ? (
                        <div className="space-y-3">
                          {productForm.chapters.map((ch, idx) => (
                            <div key={idx} className="p-3 rounded bg-[#030303] border border-white/10 space-y-2">
                              <div className="flex items-center justify-between gap-2">
                                <input
                                  type="text"
                                  value={ch.title || ''}
                                  onChange={(e) => handleUpdateChapter(idx, 'title', e.target.value)}
                                  placeholder={`Chapter ${idx + 1} Title`}
                                  className="flex-1 bg-transparent border-b border-white/10 text-xs text-white font-medium focus:outline-none focus:border-[#F5D76E] py-1"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveChapter(idx)}
                                  className="text-red-400/70 hover:text-red-400 p-1 rounded hover:bg-white/5 cursor-pointer"
                                  title="Remove Chapter"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <input
                                type="text"
                                value={ch.description || ''}
                                onChange={(e) => handleUpdateChapter(idx, 'description', e.target.value)}
                                placeholder="Chapter overview or summary"
                                className="w-full bg-transparent text-[11px] text-[#888] focus:outline-none focus:text-white"
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-3 text-center text-xs text-[#666] border border-dashed border-white/10 rounded">
                          No chapters configured. Click "Add Chapter" to create the syllabus.
                        </div>
                      )}
                    </div>

                    {/* Publication Toggles */}
                    <div className="flex flex-wrap items-center gap-6 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer text-xs">
                        <input
                          type="checkbox"
                          checked={productForm.isPublished ?? true}
                          onChange={(e) => setProductForm({ ...productForm, isPublished: e.target.checked })}
                          className="accent-[#D4AF37] w-4 h-4 rounded"
                        />
                        <span className="text-white font-medium">Publish to Live Store (Visible in Catalog)</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer text-xs">
                        <input
                          type="checkbox"
                          checked={productForm.isFeatured ?? false}
                          onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                          className="accent-[#D4AF37] w-4 h-4 rounded"
                        />
                        <span className="text-white font-medium">Pin to Homepage Featured</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer text-xs">
                        <input
                          type="checkbox"
                          checked={productForm.isBundle ?? false}
                          onChange={(e) => setProductForm({ ...productForm, isBundle: e.target.checked })}
                          className="accent-[#D4AF37] w-4 h-4 rounded"
                        />
                        <span className="text-white font-medium">Treat as Master Bundle</span>
                      </label>
                    </div>

                    {/* Submit Bar with Loading State & Duplicate Request Prevention */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                      <button
                        type="button"
                        disabled={isSavingProduct}
                        onClick={() => {
                          setIsEditingProduct(false);
                          setEditingProductId(null);
                          setSaveError(null);
                          setSaveSuccess(null);
                        }}
                        className="px-4 py-2 rounded border border-white/10 text-[#888] hover:text-white text-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSavingProduct}
                        className="px-6 py-2.5 rounded bg-[#D4AF37] text-black font-semibold text-xs uppercase tracking-wider hover:brightness-110 flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        {isSavingProduct ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                            <span>Saving to Firestore...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            <span>Save Product</span>
                          </>
                        )}
                      </button>
                    </div>

                  </form>
                </div>
              ) : (
                /* PRODUCTS CATALOG TABLE */
                <div className="space-y-4">
                  {/* Filter & Search Bar */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-[#080808] border border-white/10">
                    
                    {/* Category Filter: ALL, AI, FINANCE, COMMUNICATION */}
                    <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
                      {(['all', 'ai', 'finance', 'communication'] as const).map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setProductCategoryFilter(cat)}
                          className={`px-3 py-1.5 rounded-lg text-xs uppercase font-mono tracking-wider transition-colors cursor-pointer ${
                            productCategoryFilter === cat
                              ? 'bg-[#D4AF37] text-black font-bold'
                              : 'text-[#888] hover:text-white bg-[#040404]'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    {/* Search */}
                    <div className="relative w-full sm:w-64">
                      <Search className="w-3.5 h-3.5 text-[#666] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        placeholder="Search publications..."
                        className="w-full bg-[#040404] border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                  </div>

                  {/* Products Table */}
                  <div className="bg-[#080808] border border-white/10 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-white/10 text-[#888] font-mono uppercase text-[10px] bg-[#060606]">
                          <th className="py-3 px-4">Publication</th>
                          <th className="py-3 px-3">Discipline</th>
                          <th className="py-3 px-3">Price</th>
                          <th className="py-3 px-3">Status</th>
                          <th className="py-3 px-3">Featured</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {filteredProducts.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-8 text-center text-xs text-[#666]">
                              No products found.
                            </td>
                          </tr>
                        ) : (
                          filteredProducts.map((p) => (
                            <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={p.coverImage}
                                    alt={p.title}
                                    className="w-9 h-11 object-cover rounded border border-[#D4AF37]/30 shrink-0"
                                  />
                                  <div className="min-w-0 max-w-sm">
                                    <div className="font-medium text-white truncate">{p.title}</div>
                                    <div className="text-[10px] text-[#666] truncate">{p.shortDescription}</div>
                                  </div>
                                </div>
                              </td>

                              <td className="py-3 px-3">
                                <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#D4AF37]">
                                  {p.category}
                                </span>
                              </td>

                              <td className="py-3 px-3 font-semibold text-[#F5D76E]">
                                {formatPrice(p.price, 'INR')}
                                {p.discount ? (
                                  <span className="text-[10px] text-emerald-400 block font-normal">
                                    {p.discount}% off
                                  </span>
                                ) : null}
                              </td>

                              <td className="py-3 px-3">
                                <button
                                  onClick={() => handleTogglePublishProduct(p)}
                                  className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase flex items-center gap-1 cursor-pointer ${
                                    p.isPublished
                                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                      : 'bg-zinc-900 text-zinc-400 border border-zinc-700'
                                  }`}
                                >
                                  {p.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                  <span>{p.isPublished ? 'Live' : 'Draft'}</span>
                                </button>
                              </td>

                              <td className="py-3 px-3">
                                {p.isFeatured ? (
                                  <span className="text-[10px] text-[#F5D76E] font-mono flex items-center gap-1">
                                    <Sparkles className="w-3 h-3 text-[#D4AF37]" /> Yes
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-[#555] font-mono">No</span>
                                )}
                              </td>

                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => handleStartEditProduct(p)}
                                    className="p-1.5 rounded hover:bg-white/10 text-[#A8A8A8] hover:text-[#F5D76E] transition-colors cursor-pointer"
                                    title="Edit Product"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProduct(p.id, p.title)}
                                    className="p-1.5 rounded hover:bg-white/10 text-[#666] hover:text-red-400 transition-colors cursor-pointer"
                                    title="Delete Product"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ======================================================= */}
          {/* 3. ORDERS SECTION */}
          {/* ======================================================= */}
          {activeSection === 'orders' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-2xl text-white font-light">Acquisition Orders</h2>
                  <p className="text-xs text-[#888]">
                    Real order records stored in the Firestore database.
                  </p>
                </div>
                <span className="text-xs font-mono text-[#D4AF37] px-2.5 py-1 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                  {orders.length} Total Orders
                </span>
              </div>

              <div className="bg-[#080808] border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-[#888] font-mono uppercase text-[10px] bg-[#060606]">
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-3">Customer</th>
                      <th className="py-3 px-3">Product(s)</th>
                      <th className="py-3 px-3">Amount</th>
                      <th className="py-3 px-3">Payment Status</th>
                      <th className="py-3 px-3">License Key</th>
                      <th className="py-3 px-4">Order Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-xs text-[#666]">
                          No orders in database yet. Place a test order through the storefront bag to see it appear here immediately.
                        </td>
                      </tr>
                    ) : (
                      orders.map((o) => (
                        <tr key={o.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3 px-4 font-mono text-[#D4AF37] font-semibold">
                            {o.id.substring(0, 10)}
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-medium text-white">{o.customerName}</div>
                            <div className="text-[10px] text-[#666]">{o.customerEmail}</div>
                            {o.customerPhone && <div className="text-[9px] text-[#555]">{o.customerPhone}</div>}
                          </td>
                          <td className="py-3 px-3 max-w-xs truncate text-[#A8A8A8]">
                            {o.productTitles?.join(', ') || o.productIds?.join(', ')}
                          </td>
                          <td className="py-3 px-3 font-semibold text-[#F5D76E]">
                            {formatPrice(o.amount, 'INR')}
                          </td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                              o.paymentStatus === 'completed'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : 'bg-amber-950 text-amber-300 border border-amber-800'
                            }`}>
                              {o.paymentStatus}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-mono text-[10px] text-[#888]">
                            {o.licenseKey ? o.licenseKey.substring(0, 14) + '...' : '—'}
                          </td>
                          <td className="py-3 px-4 font-mono text-[#666] text-[10px]">
                            {o.orderDate?.split('T')[0] || 'Today'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* 4. CUSTOMERS SECTION */}
          {/* ======================================================= */}
          {activeSection === 'customers' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-2xl text-white font-light">Registered Customers</h2>
                  <p className="text-xs text-[#888]">
                    Client profiles tracking lifetime value and purchased publications.
                  </p>
                </div>
                <span className="text-xs font-mono text-[#D4AF37] px-2.5 py-1 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                  {customers.length} Accounts
                </span>
              </div>

              <div className="bg-[#080808] border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-[#888] font-mono uppercase text-[10px] bg-[#060606]">
                      <th className="py-3 px-4">Client</th>
                      <th className="py-3 px-3">Purchased Products</th>
                      <th className="py-3 px-3">Orders</th>
                      <th className="py-3 px-3">Total Invested</th>
                      <th className="py-3 px-4">Last Order</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {customers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-xs text-[#666]">
                          No customer records in database yet.
                        </td>
                      </tr>
                    ) : (
                      customers.map((c) => (
                        <tr key={c.id} className="hover:bg-white/[0.02]">
                          <td className="py-3 px-4">
                            <div className="font-medium text-white">{c.name}</div>
                            <div className="text-[10px] text-[#666]">{c.email}</div>
                          </td>
                          <td className="py-3 px-3">
                            <div className="space-y-1">
                              {c.purchasedProducts?.map((item, idx) => (
                                <span
                                  key={idx}
                                  className="inline-block px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-[#D4AF37] mr-1 mb-1 font-mono"
                                >
                                  {item.productTitle}
                                </span>
                              )) || <span className="text-[#666]">—</span>}
                            </div>
                          </td>
                          <td className="py-3 px-3 font-mono text-white">
                            {c.orderCount || 1}
                          </td>
                          <td className="py-3 px-3 font-semibold text-[#F5D76E]">
                            {formatPrice(c.totalSpent, 'INR')}
                          </td>
                          <td className="py-3 px-4 font-mono text-[#666] text-[10px]">
                            {c.lastOrderDate?.split('T')[0] || '—'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* 5. CATEGORIES SECTION (EXACTLY 3) */}
          {/* ======================================================= */}
          {activeSection === 'categories' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="font-serif text-2xl text-white font-light">The 3 Primary Categories</h2>
                <p className="text-xs text-[#888]">
                  NOVORA's architectural foundation rests strictly on AI, Finance, and Communication.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {categories.map((cat) => {
                  const prodsInCat = products.filter((p) => p.category === cat.id);
                  return (
                    <div
                      key={cat.id}
                      className="p-6 rounded-xl bg-[#080808] border border-[#D4AF37]/30 flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37]">
                            DISCIPLINE {cat.id.toUpperCase()}
                          </span>
                          <span className="text-xs font-mono text-white bg-white/10 px-2 py-0.5 rounded">
                            {prodsInCat.length} products
                          </span>
                        </div>

                        <h3 className="font-serif text-xl text-white font-normal">
                          {cat.name}
                        </h3>

                        <p className="text-xs text-[#F5D76E] italic">
                          “{cat.tagline}”
                        </p>

                        <p className="text-xs text-[#888] leading-relaxed">
                          {cat.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                        <button
                          onClick={() => {
                            if (onNavigateToCategory) onNavigateToCategory(cat.id);
                          }}
                          className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>Open Storefront Page</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => {
                            setProductCategoryFilter(cat.id);
                            setActiveSection('products');
                          }}
                          className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-white text-xs cursor-pointer"
                        >
                          Manage Items
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* 6. COUPONS SECTION */}
          {/* ======================================================= */}
          {activeSection === 'coupons' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-2xl text-white font-light">Privilege Codes & Coupons</h2>
                  <p className="text-xs text-[#888]">
                    Discount codes accepted by the customer checkout terminal.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddingCoupon(true)}
                  className="px-3.5 py-1.5 rounded bg-[#D4AF37] text-black text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 hover:brightness-110 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Coupon</span>
                </button>
              </div>

              {/* Add coupon form */}
              {isAddingCoupon && (
                <form onSubmit={handleSaveCoupon} className="p-5 rounded-xl bg-[#080808] border border-[#D4AF37]/40 space-y-4">
                  <h3 className="text-sm font-semibold text-white">Create New Privilege Code</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-[#A8A8A8] mb-1">Code *</label>
                      <input
                        type="text"
                        required
                        value={couponForm.code || ''}
                        onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                        placeholder="SUMMER25"
                        className="w-full bg-[#040404] border border-white/20 rounded p-2 text-xs text-white uppercase font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-[#A8A8A8] mb-1">Discount % *</label>
                      <input
                        type="number"
                        required
                        min={1}
                        max={100}
                        value={couponForm.discountPercent || 10}
                        onChange={(e) => setCouponForm({ ...couponForm, discountPercent: Number(e.target.value) })}
                        className="w-full bg-[#040404] border border-white/20 rounded p-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-[#A8A8A8] mb-1">Description</label>
                      <input
                        type="text"
                        value={couponForm.description || ''}
                        onChange={(e) => setCouponForm({ ...couponForm, description: e.target.value })}
                        placeholder="Seasonal incentive"
                        className="w-full bg-[#040404] border border-white/20 rounded p-2 text-xs text-white"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingCoupon(false)}
                      className="px-3 py-1.5 text-xs text-[#888] hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded bg-[#D4AF37] text-black text-xs font-semibold cursor-pointer"
                    >
                      Save Coupon
                    </button>
                  </div>
                </form>
              )}

              {/* Coupons List */}
              <div className="bg-[#080808] border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-[#888] font-mono uppercase text-[10px] bg-[#060606]">
                      <th className="py-3 px-4">Coupon Code</th>
                      <th className="py-3 px-3">Discount</th>
                      <th className="py-3 px-3">Redemptions</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3">Description</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {coupons.map((c) => (
                      <tr key={c.id} className="hover:bg-white/[0.02]">
                        <td className="py-3 px-4 font-mono text-[#F5D76E] font-bold text-sm">
                          {c.code}
                        </td>
                        <td className="py-3 px-3 font-semibold text-white">
                          {c.discountPercent}% OFF
                        </td>
                        <td className="py-3 px-3 font-mono text-[#888]">
                          {c.usageCount || 0} times
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                            c.isActive ? 'bg-emerald-950 text-emerald-300' : 'bg-zinc-800 text-zinc-400'
                          }`}>
                            {c.isActive ? 'Active' : 'Disabled'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-[#A8A8A8] text-xs">
                          {c.description || 'Standard promotion'}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleDeleteCoupon(c.id)}
                            className="p-1 text-[#666] hover:text-red-400 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* 7. TESTIMONIALS SECTION */}
          {/* ======================================================= */}
          {activeSection === 'testimonials' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-2xl text-white font-light">Verified Testimonials</h2>
                  <p className="text-xs text-[#888]">
                    Strict Authenticity Rule: Only admin-curated reviews are stored here.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddingTestimonial(true)}
                  className="px-3.5 py-1.5 rounded bg-[#D4AF37] text-black text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 hover:brightness-110 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Review</span>
                </button>
              </div>

              {isAddingTestimonial && (
                <form onSubmit={handleSaveTestimonial} className="p-5 rounded-xl bg-[#080808] border border-[#D4AF37]/40 space-y-4">
                  <h3 className="text-sm font-semibold text-white">Add Curated Review</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-[#A8A8A8] mb-1">Author Name *</label>
                      <input
                        type="text"
                        required
                        value={testimonialForm.authorName || ''}
                        onChange={(e) => setTestimonialForm({ ...testimonialForm, authorName: e.target.value })}
                        className="w-full bg-[#040404] border border-white/20 rounded p-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-[#A8A8A8] mb-1">Title / Organization</label>
                      <input
                        type="text"
                        value={testimonialForm.authorTitle || ''}
                        onChange={(e) => setTestimonialForm({ ...testimonialForm, authorTitle: e.target.value })}
                        className="w-full bg-[#040404] border border-white/20 rounded p-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-[#A8A8A8] mb-1">Category Discipline</label>
                      <select
                        value={testimonialForm.discipline || 'ai'}
                        onChange={(e) => setTestimonialForm({ ...testimonialForm, discipline: e.target.value as any })}
                        className="w-full bg-[#040404] border border-white/20 rounded p-2 text-xs text-white uppercase font-mono"
                      >
                        <option value="ai">AI</option>
                        <option value="finance">Finance</option>
                        <option value="communication">Communication</option>
                        <option value="general">General</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-[#A8A8A8] mb-1">Quote *</label>
                    <textarea
                      required
                      rows={3}
                      value={testimonialForm.quote || ''}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, quote: e.target.value })}
                      className="w-full bg-[#040404] border border-white/20 rounded p-2 text-xs text-white"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingTestimonial(false)}
                      className="px-3 py-1.5 text-xs text-[#888]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded bg-[#D4AF37] text-black text-xs font-semibold cursor-pointer"
                    >
                      Save Testimonial
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {testimonials.map((t) => (
                  <div key={t.id} className="p-5 rounded-xl bg-[#080808] border border-white/10 space-y-3 relative">
                    <button
                      onClick={() => handleDeleteTestimonial(t.id)}
                      className="absolute top-4 right-4 text-[#666] hover:text-red-400 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] font-mono uppercase text-[#D4AF37] block">
                      {t.discipline}
                    </span>
                    <p className="text-xs text-[#C8C8C8] italic leading-relaxed">
                      “{t.quote}”
                    </p>
                    <div className="pt-2 border-t border-white/5">
                      <div className="text-xs font-medium text-white">{t.authorName}</div>
                      <div className="text-[10px] text-[#888]">{t.authorTitle}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* 8. HOMEPAGE SECTION */}
          {/* ======================================================= */}
          {activeSection === 'homepage' && homepageConfig && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="font-serif text-2xl text-white font-light">Homepage Management</h2>
                <p className="text-xs text-[#888]">
                  Select featured publications and customize prominent landing copy.
                </p>
              </div>

              <form onSubmit={handleSaveHomepage} className="space-y-6 bg-[#080808] border border-white/10 rounded-xl p-6">
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-[#A8A8A8] mb-1.5">
                      Hero Headline
                    </label>
                    <input
                      type="text"
                      value={homepageConfig.headline}
                      onChange={(e) => setHomepageConfig({ ...homepageConfig, headline: e.target.value })}
                      className="w-full bg-[#040404] border border-white/20 rounded-lg p-2.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-[#A8A8A8] mb-1.5">
                      Hero Tagline
                    </label>
                    <input
                      type="text"
                      value={homepageConfig.tagline}
                      onChange={(e) => setHomepageConfig({ ...homepageConfig, tagline: e.target.value })}
                      className="w-full bg-[#040404] border border-white/20 rounded-lg p-2.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-[#A8A8A8] mb-1.5">
                      Storefront Announcement Banner
                    </label>
                    <input
                      type="text"
                      value={homepageConfig.announcement || ''}
                      onChange={(e) => setHomepageConfig({ ...homepageConfig, announcement: e.target.value })}
                      className="w-full bg-[#040404] border border-white/20 rounded-lg p-2.5 text-xs text-white"
                    />
                  </div>
                </div>

                {/* Select Featured Products */}
                <div className="pt-4 border-t border-white/10">
                  <label className="block text-[11px] font-mono uppercase text-[#A8A8A8] mb-3">
                    Featured Products Spotlight (Select which items appear on homepage)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {products.map((p) => {
                      const isFeatured = homepageConfig.featuredProductIds?.includes(p.id);
                      return (
                        <div
                          key={p.id}
                          onClick={() => {
                            const current = homepageConfig.featuredProductIds || [];
                            const updated = isFeatured
                              ? current.filter((id) => id !== p.id)
                              : [...current, p.id];
                            setHomepageConfig({ ...homepageConfig, featuredProductIds: updated });
                          }}
                          className={`p-3 rounded-lg border flex items-center gap-3 cursor-pointer transition-all ${
                            isFeatured
                              ? 'bg-[#D4AF37]/10 border-[#D4AF37] text-white'
                              : 'bg-[#040404] border-white/10 text-[#888]'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                            isFeatured ? 'bg-[#D4AF37] border-[#D4AF37] text-black' : 'border-white/20'
                          }`}>
                            {isFeatured && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <div className="min-w-0 flex-1 truncate">
                            <div className="text-xs font-medium truncate">{p.title}</div>
                            <div className="text-[10px] font-mono uppercase text-[#D4AF37]">{p.category}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2 rounded bg-[#D4AF37] text-black text-xs font-semibold uppercase tracking-wider hover:brightness-110 cursor-pointer flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Homepage Settings</span>
                  </button>
                </div>

              </form>
            </div>
          )}

          {/* ======================================================= */}
          {/* 9. SETTINGS SECTION */}
          {/* ======================================================= */}
          {activeSection === 'settings' && (
            <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl">
              <div>
                <h2 className="font-serif text-2xl text-white font-light">Store Configuration & Security</h2>
                <p className="text-xs text-[#888]">
                  Verified Firebase parameters and authorized administrator profile.
                </p>
              </div>

              {/* Admin Identity Card */}
              <div className="p-6 rounded-xl bg-[#080808] border border-[#D4AF37]/30 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/40 text-[#F5D76E]">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-white font-light">
                      Authenticated Store Executive
                    </h3>
                    <p className="text-xs text-[#888]">
                      Role verification enforced via Firebase Authentication and Firestore Security Rules.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 font-mono text-xs">
                  <div className="p-3 rounded bg-[#040404] border border-white/5">
                    <span className="text-[10px] text-[#666] block uppercase">Current Email</span>
                    <span className="text-white text-xs mt-1 block truncate">
                      {user?.email || ownerEmail}
                    </span>
                  </div>
                  <div className="p-3 rounded bg-[#040404] border border-white/5">
                    <span className="text-[10px] text-[#666] block uppercase">Access Role</span>
                    <span className="text-emerald-400 text-xs mt-1 block font-bold uppercase">
                      Authorized Owner
                    </span>
                  </div>
                  <div className="p-3 rounded bg-[#040404] border border-white/5">
                    <span className="text-[10px] text-[#666] block uppercase">Authentication State</span>
                    <span className="text-[#F5D76E] text-xs mt-1 block">
                      {user ? 'Verified Session' : 'Local Master Key'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Cloud Database Parameters */}
              <div className="p-6 rounded-xl bg-[#080808] border border-white/10 space-y-4">
                <h3 className="font-serif text-lg text-white font-light">
                  Cloud Infrastructure Parameters
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="p-3 rounded bg-[#040404] border border-white/5">
                    <span className="text-[10px] text-[#666] block">FIREBASE PROJECT ID</span>
                    <span className="text-white mt-1 block">local-airlock-f41j7</span>
                  </div>
                  <div className="p-3 rounded bg-[#040404] border border-white/5">
                    <span className="text-[10px] text-[#666] block">FIRESTORE DATABASE ID</span>
                    <span className="text-white mt-1 block truncate">
                      ai-studio-novora-e837b882-d9c0-4118-be01-890c74c4bc93
                    </span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-[11px] text-emerald-300 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Firestore rules deployed with strict RBAC: only owner email and admins collection can modify products.</span>
                </div>
              </div>

              {/* Sign Out */}
              <div className="pt-4 flex justify-between items-center">
                <button
                  onClick={onBackToStore}
                  className="px-4 py-2 rounded border border-white/10 text-white text-xs hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Return to Storefront
                </button>
                <button
                  onClick={() => signOut()}
                  className="px-4 py-2 rounded bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out of Admin Console</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </main>

    </div>
  );
};
