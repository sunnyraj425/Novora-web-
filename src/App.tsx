import React, { useState, useEffect } from 'react';
import { 
  Product, 
  CartItem, 
  Currency, 
  PrimaryCategory, 
  CurrentView 
} from './types';
import { 
  loadStoredProducts, 
  saveStoredProducts 
} from './data/products';
import { 
  fetchProductsFromFirestore 
} from './lib/firestoreService';
import { AuthProvider, useAuth } from './lib/AuthContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ExploreCategories } from './components/ExploreCategories';
import { FeaturedProducts } from './components/FeaturedProducts';
import { CategoryPage } from './components/CategoryPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { AllProductsPage } from './components/AllProductsPage';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLogin } from './components/AdminLogin';
import { BrandManifesto } from './components/BrandManifesto';
import { FaqSection } from './components/FaqSection';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { SearchModal } from './components/SearchModal';
import { NovoraLogo } from './components/NovoraLogo';
import { Check, ShieldAlert, ArrowLeft } from 'lucide-react';

function NovoraStoreApp() {
  const { user, isAdmin, loading: authLoading, ownerEmail } = useAuth();

  // Products state (initial cache from localStorage, synced with Firestore)
  const [products, setProducts] = useState<Product[]>(() => loadStoredProducts());

  // Routing / View state
  const [currentView, setCurrentView] = useState<CurrentView>({ page: 'home' });
  const [editingProductInAdmin, setEditingProductInAdmin] = useState<Product | null>(null);

  // Commerce state
  const [currency, setCurrency] = useState<Currency>('INR');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync products with Firestore on initial load
  useEffect(() => {
    let isMounted = true;
    fetchProductsFromFirestore()
      .then((prods) => {
        if (isMounted && prods && prods.length > 0) {
          setProducts(prods);
          saveStoredProducts(prods);
        }
      })
      .catch((err) => {
        console.warn('Initial Firestore product sync note:', err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync with browser URL pathname and hash for seamless Netlify SPA routing
  const parseLocation = (): { view: CurrentView; openCheckout?: boolean } => {
    if (typeof window === 'undefined') return { view: { page: 'home' } };

    // 1. Check hash first if deep linked with #
    let clean = window.location.hash.replace(/^#\/?/, '').replace(/\/+$/, '').trim();

    // 2. If no hash, inspect the HTML5 pathname (strip leading and trailing slashes)
    if (!clean) {
      clean = window.location.pathname.replace(/^\/+|\/+$/g, '').trim();
    }

    if (!clean || clean === '') return { view: { page: 'home' } };
    if (clean === 'checkout') return { view: { page: 'home' }, openCheckout: true };
    if (clean === 'admin/login' || clean === 'admin-login') return { view: { page: 'admin-login' } };
    if (clean === 'admin') return { view: { page: 'admin' } };
    if (clean === 'account') {
      return { view: { page: 'admin' } };
    }
    if (clean === 'products' || clean === 'all-products') return { view: { page: 'all-products' } };
    if (clean.startsWith('category/')) {
      const cat = clean.split('/')[1]?.replace(/\/+$/, '') as PrimaryCategory;
      if (cat === 'ai' || cat === 'finance' || cat === 'communication') {
        return { view: { page: 'category', category: cat } };
      }
    }
    if (clean.startsWith('product/')) {
      const pid = clean.split('/')[1]?.replace(/\/+$/, '');
      if (pid) return { view: { page: 'product', productId: pid } };
    }
    return { view: { page: 'home' } };
  };

  useEffect(() => {
    const handleUrlChange = () => {
      const parsed = parseLocation();
      setCurrentView(parsed.view);
      if (parsed.openCheckout) {
        setIsCheckoutOpen(true);
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);

    // Initial mount check for direct deep links
    const initial = parseLocation();
    setCurrentView(initial.view);
    if (initial.openCheckout) {
      setIsCheckoutOpen(true);
    }

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  const navigateTo = (view: CurrentView) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    let targetPath = '/';
    if (view.page === 'all-products') {
      targetPath = '/products';
    } else if (view.page === 'category') {
      targetPath = `/category/${view.category}`;
    } else if (view.page === 'product') {
      targetPath = `/product/${view.productId}`;
    } else if (view.page === 'admin') {
      targetPath = '/admin';
    } else if (view.page === 'admin-login') {
      targetPath = '/admin/login';
    }

    try {
      if (window.location.pathname !== targetPath || window.location.hash) {
        window.history.pushState(null, '', targetPath);
      }
    } catch {
      // Fallback if pushState is restricted
      if (view.page === 'home') window.location.hash = '';
      else window.location.hash = targetPath;
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2800);
  };

  // Cart operations
  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    showToast(`Added "${product.title}" to bag.`);
  };

  const handleInstantBuy = (product: Product) => {
    handleAddToCart(product);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Active category highlight in Navbar
  const getActiveCategoryForNav = (): PrimaryCategory | 'all' | null => {
    if (currentView.page === 'category') return currentView.category;
    if (currentView.page === 'all-products') return 'all';
    return null;
  };

  // -------------------------------------------------------------
  // SECURE ADMIN ROUTING GATE
  // -------------------------------------------------------------
  if (currentView.page === 'admin-login') {
    return (
      <AdminLogin
        onLoginSuccess={() => navigateTo({ page: 'admin' })}
        onBackToStore={() => navigateTo({ page: 'home' })}
      />
    );
  }

  if (currentView.page === 'admin') {
    // If auth state is still determining
    if (authLoading) {
      return (
        <div className="min-h-screen bg-[#040404] flex items-center justify-center text-white">
          <div className="text-center space-y-4">
            <NovoraLogo variant="vertical" size="sm" />
            <div className="w-6 h-6 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mt-2" />
            <div className="text-[11px] font-mono uppercase tracking-widest text-[#D4AF37]">
              Verifying Security Protocol...
            </div>
          </div>
        </div>
      );
    }

    // If user is not authenticated at all, redirect to /admin/login
    if (!user) {
      return (
        <AdminLogin
          onLoginSuccess={() => navigateTo({ page: 'admin' })}
          onBackToStore={() => navigateTo({ page: 'home' })}
        />
      );
    }

    // If user is authenticated, but not authorized as admin/owner
    if (!isAdmin) {
      return (
        <div className="min-h-screen bg-[#030303] flex flex-col items-center justify-center p-6 text-center text-white">
          <div className="max-w-md w-full p-8 rounded-2xl bg-[#080808] border border-red-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.9)] space-y-5">
            <div className="flex justify-center mb-1">
              <NovoraLogo variant="vertical" size="sm" />
            </div>
            <div className="w-12 h-12 rounded-full bg-red-950/60 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-light text-white">
                Access Denied: Unauthorized
              </h2>
              <p className="text-xs text-[#888] mt-2 leading-relaxed">
                You are authenticated as <span className="text-white font-mono">{user.email}</span>, but your account lacks administrative permissions for NOVORA.
              </p>
            </div>
            <div className="p-3 rounded bg-[#040404] border border-white/10 text-[11px] text-[#A8A8A8] text-left space-y-1">
              <div>Store Owner: <span className="text-[#D4AF37] font-mono">{ownerEmail}</span></div>
              <div className="text-[10px] text-[#666]">Firestore security rules enforce Zero-Trust RBAC.</div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigateTo({ page: 'admin-login' })}
                className="flex-1 py-2.5 rounded bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors cursor-pointer"
              >
                Switch Account
              </button>
              <button
                onClick={() => navigateTo({ page: 'home' })}
                className="flex-1 py-2.5 rounded bg-[#D4AF37] hover:brightness-110 text-xs font-semibold text-black transition-all cursor-pointer"
              >
                Return to Store
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Authenticated and Authorized Admin -> Render Full Admin Dashboard
    return (
      <AdminDashboard
        onBackToStore={() => navigateTo({ page: 'home' })}
        onNavigateToCategory={(cat) => navigateTo({ page: 'category', category: cat })}
        initialEditProduct={editingProductInAdmin}
        onProductUpdated={(updatedProd) => {
          setProducts((prev) => {
            const idx = prev.findIndex((p) => p.id === updatedProd.id);
            const next = idx >= 0
              ? prev.map((p) => (p.id === updatedProd.id ? updatedProd : p))
              : [updatedProd, ...prev];
            saveStoredProducts(next);
            return next;
          });
        }}
      />
    );
  }

  // -------------------------------------------------------------
  // PUBLIC STOREFRONT (UNCHANGED AESTHETIC & ARCHITECTURE)
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] selection:bg-[#D4AF37] selection:text-black">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#080808] border border-[#D4AF37]/50 text-white text-xs px-4 py-3 rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="p-1 rounded-full bg-[#D4AF37]/20 text-[#F5D76E]">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span className="font-medium tracking-wide">{toastMessage}</span>
        </div>
      )}

      {/* Main Luxury Navigation Bar */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        currency={currency}
        onCurrencyChange={setCurrency}
        onOpenSearch={() => setIsSearchOpen(true)}
        onNavigateHome={() => navigateTo({ page: 'home' })}
        onNavigateCategory={(cat) => navigateTo({ page: 'category', category: cat })}
        onNavigateAllProducts={() => navigateTo({ page: 'all-products' })}
        onNavigateAdmin={() => {
          setEditingProductInAdmin(null);
          // If logged in as admin, go straight to /admin; otherwise go to /admin/login
          if (user && isAdmin) {
            navigateTo({ page: 'admin' });
          } else {
            navigateTo({ page: 'admin-login' });
          }
        }}
        activeCategory={getActiveCategoryForNav()}
      />

      {/* Routed Store Views */}
      <main>
        {/* VIEW 1: HOME PAGE */}
        {currentView.page === 'home' && (
          <>
            <Hero
              onExploreClick={() => {
                const el = document.getElementById('explore-novora');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onSampleClick={() => {
                const el = document.getElementById('explore-novora');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            <ExploreCategories
              products={products}
              onSelectCategory={(cat) => navigateTo({ page: 'category', category: cat })}
            />

            <FeaturedProducts
              products={products}
              currency={currency}
              onSelectProduct={(p) => navigateTo({ page: 'product', productId: p.id })}
              onAddToCart={handleAddToCart}
              onViewAllClick={() => navigateTo({ page: 'all-products' })}
            />

            <BrandManifesto />
            <FaqSection />
            <Newsletter />
          </>
        )}

        {/* VIEW 2: CATEGORY PAGE (/category/ai, /category/finance, /category/communication) */}
        {currentView.page === 'category' && (
          <CategoryPage
            category={currentView.category}
            products={products}
            currency={currency}
            onSelectProduct={(p) => navigateTo({ page: 'product', productId: p.id })}
            onAddToCart={handleAddToCart}
            onBackToHome={() => navigateTo({ page: 'home' })}
            onSelectOtherCategory={(cat) => navigateTo({ page: 'category', category: cat })}
          />
        )}

        {/* VIEW 3: ALL PRODUCTS PAGE */}
        {currentView.page === 'all-products' && (
          <AllProductsPage
            products={products}
            currency={currency}
            onSelectProduct={(p) => navigateTo({ page: 'product', productId: p.id })}
            onAddToCart={handleAddToCart}
            onBackToHome={() => navigateTo({ page: 'home' })}
          />
        )}

        {/* VIEW 4: DEDICATED PRODUCT DETAIL PAGE */}
        {currentView.page === 'product' && (() => {
          const currentProd = products.find((p) => p.id === currentView.productId) || products[0];
          return (
            <ProductDetailPage
              product={currentProd}
              currency={currency}
              onAddToCart={handleAddToCart}
              onBuyNow={handleInstantBuy}
              onBack={() => navigateTo({ page: 'home' })}
              onSelectCategory={(cat) => navigateTo({ page: 'category', category: cat })}
              allProducts={products}
              onSelectProduct={(p) => navigateTo({ page: 'product', productId: p.id })}
              onOpenAdminEdit={(prod) => {
                setEditingProductInAdmin(prod);
                if (user && isAdmin) {
                  navigateTo({ page: 'admin' });
                } else {
                  navigateTo({ page: 'admin-login' });
                }
              }}
            />
          );
        })()}
      </main>

      {/* Comprehensive Luxury Footer */}
      <Footer
        onNavigateCategory={(cat) => navigateTo({ page: 'category', category: cat })}
        onNavigateAllProducts={() => navigateTo({ page: 'all-products' })}
        onNavigateAdmin={() => {
          setEditingProductInAdmin(null);
          if (user && isAdmin) {
            navigateTo({ page: 'admin' });
          } else {
            navigateTo({ page: 'admin-login' });
          }
        }}
        onNavigateHome={() => navigateTo({ page: 'home' })}
      />

      {/* Slide-over Shopping Bag */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        currency={currency}
        onProceedToCheckout={(discount) => {
          setAppliedDiscount(discount);
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Instant Checkout & Access Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        currency={currency}
        appliedDiscount={appliedDiscount}
        onCompleteOrder={() => {
          // Re-fetch products and orders if needed
        }}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        currency={currency}
        onSelectProduct={(p) => {
          navigateTo({ page: 'product', productId: p.id });
        }}
        onAddToCart={handleAddToCart}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NovoraStoreApp />
    </AuthProvider>
  );
}
