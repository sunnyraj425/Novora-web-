import React, { useState, useEffect } from 'react';
import { 
  Product, 
  CartItem, 
  Currency, 
  PrimaryCategory, 
  CurrentView,
  CustomerAccountTab 
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
import { AdminDashboard, AdminSection } from './components/AdminDashboard';
import { AdminLogin } from './components/AdminLogin';
import { CustomerAuth } from './components/CustomerAuth';
import { CustomerDashboard } from './components/CustomerDashboard';
import { BrandManifesto } from './components/BrandManifesto';
import { FaqSection } from './components/FaqSection';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { SearchModal } from './components/SearchModal';
import { NovoraLogo } from './components/NovoraLogo';
import { Check, ShieldAlert, ArrowLeft, ArrowRight, User as UserIcon } from 'lucide-react';

function NovoraStoreApp() {
  const { user, isAdmin, loading: authLoading, signOut, ownerEmail } = useAuth();

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

    // Customer Authentication routes
    if (clean === 'login' || clean === 'signin') return { view: { page: 'login' } };
    if (clean === 'signup' || clean === 'register') return { view: { page: 'signup' } };

    // Customer Account & Dashboard routes
    if (clean === 'account' || clean === 'account/overview') return { view: { page: 'account', tab: 'overview' } };
    if (clean === 'account/library' || clean === 'library') return { view: { page: 'account', tab: 'library' } };
    if (clean === 'account/orders' || clean === 'orders') return { view: { page: 'account', tab: 'orders' } };
    if (clean === 'account/settings' || clean === 'settings') return { view: { page: 'account', tab: 'settings' } };

    // Admin routes
    if (clean === 'admin/login' || clean === 'admin-login') return { view: { page: 'admin-login' } };
    if (clean === 'admin') return { view: { page: 'admin' } };
    if (clean === 'admin/products') return { view: { page: 'admin', section: 'products' } };
    if (clean === 'admin/orders') return { view: { page: 'admin', section: 'orders' } };
    if (clean === 'admin/customers') return { view: { page: 'admin', section: 'customers' } };
    if (clean === 'admin/coupons') return { view: { page: 'admin', section: 'coupons' } };
    if (clean === 'admin/settings') return { view: { page: 'admin', section: 'settings' } };

    // Catalog & Products routes
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
    } else if (view.page === 'login') {
      targetPath = '/login';
    } else if (view.page === 'signup') {
      targetPath = '/signup';
    } else if (view.page === 'account') {
      if (view.tab === 'library') targetPath = '/account/library';
      else if (view.tab === 'orders') targetPath = '/account/orders';
      else if (view.tab === 'settings') targetPath = '/account/settings';
      else targetPath = '/account';
    } else if (view.page === 'admin') {
      if (view.section && view.section !== 'overview') {
        targetPath = `/admin/${view.section}`;
      } else {
        targetPath = '/admin';
      }
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

  const handleUpdateQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity: qty } : item))
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const getActiveCategoryForNav = (): PrimaryCategory | 'all' | null => {
    if (currentView.page === 'category') return currentView.category;
    if (currentView.page === 'all-products') return 'all';
    return null;
  };

  // -------------------------------------------------------------
  // CUSTOMER AUTHENTICATION VIEWS (/login, /signup)
  // -------------------------------------------------------------
  if (currentView.page === 'login' || currentView.page === 'signup') {
    // If user is already authenticated:
    // If admin, send to /admin; if customer, send to /account
    if (user) {
      if (isAdmin) {
        navigateTo({ page: 'admin' });
      } else {
        navigateTo({ page: 'account', tab: 'overview' });
      }
      return null;
    }

    return (
      <CustomerAuth
        initialMode={currentView.page === 'signup' ? 'signup' : 'login'}
        onSuccess={() => {
          showToast('Welcome to your customer account.');
          navigateTo({ page: 'account', tab: 'overview' });
        }}
        onBackToStore={() => navigateTo({ page: 'home' })}
        onNavigateToAdminLogin={() => navigateTo({ page: 'admin-login' })}
      />
    );
  }

  // -------------------------------------------------------------
  // CUSTOMER DASHBOARD VIEW (/account, /account/orders, /account/library)
  // -------------------------------------------------------------
  if (currentView.page === 'account') {
    if (authLoading) {
      return (
        <div className="min-h-screen bg-[#040404] flex items-center justify-center text-white">
          <div className="text-center space-y-4">
            <NovoraLogo variant="vertical" size="sm" />
            <div className="w-6 h-6 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mt-2" />
            <div className="text-[11px] font-mono uppercase tracking-widest text-[#D4AF37]">
              Loading Customer Library...
            </div>
          </div>
        </div>
      );
    }

    // If not authenticated, redirect to /login
    if (!user) {
      return (
        <CustomerAuth
          initialMode="login"
          onSuccess={() => {
            showToast('Authenticated successfully.');
            navigateTo({ page: 'account', tab: currentView.tab || 'library' });
          }}
          onBackToStore={() => navigateTo({ page: 'home' })}
          onNavigateToAdminLogin={() => navigateTo({ page: 'admin-login' })}
        />
      );
    }

    return (
      <CustomerDashboard
        initialTab={currentView.tab || 'library'}
        products={products}
        currency={currency}
        onNavigateHome={() => navigateTo({ page: 'home' })}
        onNavigateAllProducts={() => navigateTo({ page: 'all-products' })}
        onNavigateProduct={(pid) => navigateTo({ page: 'product', productId: pid })}
        onSignOut={async () => {
          await signOut();
          showToast('Signed out of customer account.');
          navigateTo({ page: 'home' });
        }}
      />
    );
  }

  // -------------------------------------------------------------
  // ADMIN AUTHENTICATION VIEW (/admin/login)
  // -------------------------------------------------------------
  if (currentView.page === 'admin-login') {
    return (
      <AdminLogin
        onLoginSuccess={() => navigateTo({ page: 'admin' })}
        onBackToStore={() => navigateTo({ page: 'home' })}
        onNavigateToCustomerLogin={() => navigateTo({ page: 'login' })}
      />
    );
  }

  // -------------------------------------------------------------
  // ADMIN DASHBOARD GATE (/admin, /admin/products, /admin/orders, etc.)
  // -------------------------------------------------------------
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
          onNavigateToCustomerLogin={() => navigateTo({ page: 'login' })}
        />
      );
    }

    // STRICT RBAC: If user is authenticated as a customer but NOT authorized as admin
    if (!isAdmin) {
      return (
        <div className="min-h-screen bg-[#030303] flex flex-col items-center justify-center p-6 text-center text-white selection:bg-[#D4AF37] selection:text-black">
          <div className="max-w-md w-full p-8 rounded-2xl bg-[#080808] border border-red-500/40 shadow-[0_20px_50px_rgba(0,0,0,0.95)] space-y-5">
            <div className="flex justify-center mb-1">
              <NovoraLogo variant="vertical" size="sm" />
            </div>
            <div className="w-14 h-14 rounded-full bg-red-950/60 border border-red-500/50 text-red-400 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(239,68,68,0.2)]">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-red-400 block mb-1">
                Zero-Trust RBAC Violation
              </span>
              <h2 className="font-serif text-2xl font-light text-white">
                Access Denied: Administrator Required
              </h2>
              <p className="text-xs text-[#888] mt-2 leading-relaxed">
                You are currently signed in as customer <span className="text-white font-mono">{user.email}</span>. Administrative controls, catalog management, and store records are restricted to authorized store operators.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#040404] border border-white/10 text-[11px] text-[#A8A8A8] text-left space-y-1 font-mono">
              <div>Account Role: <span className="text-emerald-400">Verified Customer</span></div>
              <div>Required Role: <span className="text-red-400">Store Administrator</span></div>
              <div>Owner Signature: <span className="text-[#D4AF37]">{ownerEmail}</span></div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                onClick={() => navigateTo({ page: 'account', tab: 'overview' })}
                className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#C9A227] hover:brightness-110 text-xs font-semibold text-black transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Go to My Account</span>
              </button>
              <button
                onClick={() => navigateTo({ page: 'admin-login' })}
                className="flex-1 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-semibold text-white transition-colors cursor-pointer"
              >
                Switch Account
              </button>
            </div>
            <div>
              <button
                onClick={() => navigateTo({ page: 'home' })}
                className="text-xs text-[#777] hover:text-[#D4AF37] transition-colors"
              >
                ← Return to Storefront
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Authenticated and Authorized Admin -> Render Full Admin Dashboard
    return (
      <AdminDashboard
        initialSection={currentView.section as AdminSection}
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
  // PUBLIC STOREFRONT (CUSTOMER STOREFRONT BY DEFAULT)
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
        onNavigateLogin={() => navigateTo({ page: 'login' })}
        onNavigateAccount={(tab: CustomerAccountTab = 'overview') => navigateTo({ page: 'account', tab })}
        onNavigateAdmin={() => {
          setEditingProductInAdmin(null);
          if (user && isAdmin) {
            navigateTo({ page: 'admin' });
          } else {
            navigateTo({ page: 'admin-login' });
          }
        }}
        onSignOut={async () => {
          await signOut();
          showToast('Signed out successfully.');
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

        {/* VIEW 3: ALL PRODUCTS PAGE (/products) */}
        {currentView.page === 'all-products' && (
          <AllProductsPage
            products={products}
            currency={currency}
            onSelectProduct={(p) => navigateTo({ page: 'product', productId: p.id })}
            onAddToCart={handleAddToCart}
            onBackToHome={() => navigateTo({ page: 'home' })}
          />
        )}

        {/* VIEW 4: DEDICATED PRODUCT DETAIL PAGE (/product/:id) */}
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
        onNavigateLogin={() => navigateTo({ page: 'login' })}
        onNavigateAccount={(tab: CustomerAccountTab = 'overview') => navigateTo({ page: 'account', tab })}
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
        onCompleteOrder={handleClearCart}
        onNavigateToLibrary={() => navigateTo({ page: 'account', tab: 'library' })}
      />

      {/* Search Catalog Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        currency={currency}
        onSelectProduct={(p) => {
          navigateTo({ page: 'product', productId: p.id });
          setIsSearchOpen(false);
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
