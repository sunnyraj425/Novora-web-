import React, { useState } from 'react';
import { NovoraLogo } from './NovoraLogo';
import { Currency, PrimaryCategory, CustomerAccountTab } from '../types';
import { useAuth } from '../lib/AuthContext';
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  Settings, 
  ArrowRight, 
  User as UserIcon, 
  BookOpen, 
  LogOut 
} from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  currency: Currency;
  onCurrencyChange: (c: Currency) => void;
  onOpenSearch: () => void;
  onNavigateHome: () => void;
  onNavigateCategory: (cat: PrimaryCategory) => void;
  onNavigateAllProducts: () => void;
  onNavigateLogin: () => void;
  onNavigateAccount: (tab?: CustomerAccountTab) => void;
  onNavigateAdmin: () => void;
  onSignOut: () => void;
  activeCategory?: PrimaryCategory | 'all' | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  currency,
  onCurrencyChange,
  onOpenSearch,
  onNavigateHome,
  onNavigateCategory,
  onNavigateAllProducts,
  onNavigateLogin,
  onNavigateAccount,
  onNavigateAdmin,
  onSignOut,
  activeCategory,
}) => {
  const { user, isAdmin, customerProfile } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleCategoryClick = (cat: PrimaryCategory) => {
    setMobileMenuOpen(false);
    onNavigateCategory(cat);
  };

  const handleAllProductsClick = () => {
    setMobileMenuOpen(false);
    onNavigateAllProducts();
  };

  const handleHomeClick = () => {
    setMobileMenuOpen(false);
    onNavigateHome();
  };

  const handleLoginClick = () => {
    setMobileMenuOpen(false);
    onNavigateLogin();
  };

  const handleAccountClick = (tab: CustomerAccountTab = 'overview') => {
    setMobileMenuOpen(false);
    onNavigateAccount(tab);
  };

  const handleAdminClick = () => {
    setMobileMenuOpen(false);
    onNavigateAdmin();
  };

  const handleSignOutClick = () => {
    setMobileMenuOpen(false);
    onSignOut();
  };

  return (
    <header
      id="novora-main-navbar"
      className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#050505]/95 border-b border-[#D4AF37]/20 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Identity Logo */}
        <div onClick={handleHomeClick} className="cursor-pointer">
          <NovoraLogo variant="horizontal" size="md" />
        </div>

        {/* Desktop Navigation Links: AI, FINANCE, COMMUNICATION, and ALL PRODUCTS */}
        <nav className="hidden md:flex items-center space-x-8 text-xs font-medium tracking-[0.2em] uppercase">
          <button
            onClick={() => handleCategoryClick('ai')}
            className={`transition-colors duration-200 cursor-pointer ${
              activeCategory === 'ai'
                ? 'text-[#F5D76E] border-b-2 border-[#D4AF37] pb-1'
                : 'text-[#A8A8A8] hover:text-[#F5D76E]'
            }`}
          >
            AI
          </button>

          <button
            onClick={() => handleCategoryClick('finance')}
            className={`transition-colors duration-200 cursor-pointer ${
              activeCategory === 'finance'
                ? 'text-[#F5D76E] border-b-2 border-[#D4AF37] pb-1'
                : 'text-[#A8A8A8] hover:text-[#F5D76E]'
            }`}
          >
            FINANCE
          </button>

          <button
            onClick={() => handleCategoryClick('communication')}
            className={`transition-colors duration-200 cursor-pointer ${
              activeCategory === 'communication'
                ? 'text-[#F5D76E] border-b-2 border-[#D4AF37] pb-1'
                : 'text-[#A8A8A8] hover:text-[#F5D76E]'
            }`}
          >
            COMMUNICATION
          </button>

          <button
            onClick={handleAllProductsClick}
            className={`transition-colors duration-200 cursor-pointer ${
              activeCategory === 'all'
                ? 'text-[#F5D76E] border-b-2 border-[#D4AF37] pb-1'
                : 'text-[#A8A8A8] hover:text-white'
            }`}
          >
            ALL PRODUCTS
          </button>
        </nav>

        {/* Right Actions: Search, Currency, Customer/Admin, Cart */}
        <div className="flex items-center space-x-2.5 sm:space-x-3.5">
          
          {/* Quick Search */}
          <button
            id="btn-nav-search"
            onClick={onOpenSearch}
            className="p-2 text-[#A8A8A8] hover:text-[#D4AF37] transition-colors rounded-full hover:bg-white/5 cursor-pointer"
            title="Search catalog"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Currency Switcher */}
          <div className="hidden sm:flex items-center text-[11px] border border-[#D4AF37]/30 rounded px-1 py-0.5 bg-[#080808]">
            {(['INR', 'USD', 'EUR', 'GBP'] as Currency[]).map((curr) => (
              <button
                key={curr}
                onClick={() => onCurrencyChange(curr)}
                className={`px-2 py-0.5 rounded transition-all font-semibold cursor-pointer ${
                  currency === curr
                    ? 'text-[#050505] bg-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.4)]'
                    : 'text-[#A8A8A8] hover:text-white'
                }`}
                title={curr === 'INR' ? 'Indian Rupee (₹)' : curr}
              >
                {curr === 'INR' ? '₹ INR' : curr}
              </button>
            ))}
          </div>

          {/* ============================================================== */}
          {/* AUTHENTICATION STATE ACTIONS                                    */}
          {/* ============================================================== */}

          {/* State 1: GUEST / VISITOR -> Show Login / Sign Up button */}
          {!user && (
            <button
              onClick={handleLoginClick}
              className="px-3 py-1.5 rounded-lg border border-[#D4AF37]/35 bg-[#0A0A0A] hover:border-[#D4AF37] hover:bg-[#121212] text-[#E0E0E0] hover:text-white text-xs font-semibold tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <UserIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}

          {/* State 2: AUTHENTICATED CUSTOMER -> Show Library & Account */}
          {user && !isAdmin && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleAccountClick('library')}
                className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs text-[#A8A8A8] hover:text-[#F5D76E] transition-colors cursor-pointer"
                title="Purchased Ebooks"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="font-mono text-[11px] uppercase">Library</span>
              </button>

              <button
                onClick={() => handleAccountClick('overview')}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#D4AF37]/30 bg-[#0C0C0C] hover:border-[#D4AF37] text-xs font-medium text-white transition-all cursor-pointer"
                title="Customer Account Dashboard"
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8C6D1F] text-black text-[10px] font-bold flex items-center justify-center">
                  {(customerProfile?.name || user.email || 'C')[0].toUpperCase()}
                </div>
                <span className="hidden md:inline text-xs tracking-wider uppercase font-mono">
                  {customerProfile?.name?.split(' ')[0] || 'Account'}
                </span>
              </button>
            </div>
          )}

          {/* State 3: AUTHENTICATED ADMIN ONLY -> Show Admin Dashboard button */}
          {user && isAdmin && (
            <button
              onClick={handleAdminClick}
              className="px-2.5 py-1.5 text-[#D4AF37] hover:text-[#F5D76E] bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/40 transition-colors rounded-lg cursor-pointer flex items-center gap-1.5 text-[11px] font-mono uppercase"
              title="Admin Dashboard"
            >
              <Settings className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Admin</span>
            </button>
          )}

          {/* Cart Bag Trigger */}
          <button
            id="btn-nav-cart"
            onClick={onOpenCart}
            className="relative flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded border border-[#D4AF37]/40 bg-gradient-to-r from-[#0D0D0D] to-[#080808] hover:border-[#F5D76E] transition-all group cursor-pointer"
            aria-label="Shopping Bag"
          >
            <ShoppingBag className="w-4 h-4 text-[#D4AF37] group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline text-xs font-semibold tracking-wider text-[#F5F5F5] uppercase">
              Bag
            </span>
            {cartCount > 0 && (
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-br from-[#F5D76E] to-[#C9A227] text-[#050505] text-[11px] font-bold shadow-[0_0_10px_rgba(212,175,55,0.4)]">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Hamburger Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#A8A8A8] hover:text-white rounded hover:bg-white/10"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>

      </div>

      {/* Mobile Fullscreen Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#080808] border-b border-[#D4AF37]/25 px-6 py-6 space-y-5 animate-in slide-in-from-top-2 duration-200">
          <div className="pb-3 border-b border-white/10 flex items-center justify-between">
            <NovoraLogo variant="compact" size="sm" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37]">
              Menu
            </span>
          </div>

          {/* User Status Bar in Mobile Menu */}
          {user ? (
            <div className="p-3 rounded-lg bg-[#050505] border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#F5D76E] text-xs font-bold flex items-center justify-center">
                  {(customerProfile?.name || user.email || 'U')[0].toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-white truncate max-w-[170px]">
                    {customerProfile?.name || user.email}
                  </span>
                  <span className="text-[10px] text-[#888] font-mono">
                    {isAdmin ? 'Store Administrator' : 'Customer Account'}
                  </span>
                </div>
              </div>

              <button
                onClick={handleSignOutClick}
                className="text-red-400 p-1 hover:text-red-300"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleLoginClick}
              className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#C9A227] text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <UserIcon className="w-4 h-4" />
              <span>Customer Sign In / Register</span>
            </button>
          )}

          {/* Navigation Category Links */}
          <div className="space-y-3 text-sm font-serif font-light">
            <button
              onClick={() => handleCategoryClick('ai')}
              className="w-full text-left py-2 text-white hover:text-[#F5D76E] border-b border-white/5 flex items-center justify-between"
            >
              <span className="tracking-widest uppercase font-sans text-xs">AI</span>
              <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
            </button>

            <button
              onClick={() => handleCategoryClick('finance')}
              className="w-full text-left py-2 text-white hover:text-[#F5D76E] border-b border-white/5 flex items-center justify-between"
            >
              <span className="tracking-widest uppercase font-sans text-xs">FINANCE</span>
              <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
            </button>

            <button
              onClick={() => handleCategoryClick('communication')}
              className="w-full text-left py-2 text-white hover:text-[#F5D76E] border-b border-white/5 flex items-center justify-between"
            >
              <span className="tracking-widest uppercase font-sans text-xs">COMMUNICATION</span>
              <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
            </button>

            <button
              onClick={handleAllProductsClick}
              className="w-full text-left py-2 text-white hover:text-[#F5D76E] border-b border-white/5 flex items-center justify-between"
            >
              <span className="tracking-widest uppercase font-sans text-xs text-[#D4AF37]">ALL PRODUCTS</span>
              <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
            </button>

            {/* Mobile links for Logged in Customers */}
            {user && !isAdmin && (
              <>
                <button
                  onClick={() => handleAccountClick('library')}
                  className="w-full text-left py-2 text-[#F5D76E] border-b border-white/5 flex items-center justify-between"
                >
                  <span className="tracking-widest uppercase font-sans text-xs flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
                    My Digital Library
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
                </button>

                <button
                  onClick={() => handleAccountClick('orders')}
                  className="w-full text-left py-2 text-white border-b border-white/5 flex items-center justify-between"
                >
                  <span className="tracking-widest uppercase font-sans text-xs flex items-center gap-2">
                    <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Order History
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#666]" />
                </button>

                <button
                  onClick={() => handleAccountClick('settings')}
                  className="w-full text-left py-2 text-white border-b border-white/5 flex items-center justify-between"
                >
                  <span className="tracking-widest uppercase font-sans text-xs flex items-center gap-2">
                    <UserIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Account Settings
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#666]" />
                </button>
              </>
            )}

            {/* Admin only entry in mobile */}
            {user && isAdmin && (
              <button
                onClick={handleAdminClick}
                className="w-full text-left py-2 text-[#D4AF37] hover:text-[#F5D76E] flex items-center justify-between border-b border-white/5"
              >
                <span className="tracking-widest uppercase font-sans text-xs flex items-center gap-2 font-mono">
                  <Settings className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Admin Dashboard
                </span>
                <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
              </button>
            )}
          </div>

          {/* Mobile Currency Switcher */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs uppercase text-[#A8A8A8]">Currency:</span>
            <div className="flex items-center text-[11px] border border-[#D4AF37]/30 rounded px-1.5 py-0.5 bg-[#050505]">
              {(['INR', 'USD', 'EUR', 'GBP'] as Currency[]).map((curr) => (
                <button
                  key={curr}
                  onClick={() => onCurrencyChange(curr)}
                  className={`px-2 py-0.5 rounded transition-all font-semibold ${
                    currency === curr ? 'text-[#050505] bg-[#D4AF37]' : 'text-[#A8A8A8]'
                  }`}
                >
                  {curr === 'INR' ? '₹ INR' : curr}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </header>
  );
};
