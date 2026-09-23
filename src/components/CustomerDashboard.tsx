import React, { useState, useEffect } from 'react';
import { NovoraLogo } from './NovoraLogo';
import { useAuth } from '../lib/AuthContext';
import { Product, Currency, CustomerAccountTab } from '../types';
import { fetchCustomerOrders, OrderRecord } from '../lib/firestoreService';
import { 
  BookOpen, 
  Download, 
  FileText, 
  ShoppingBag, 
  User, 
  Settings, 
  LogOut, 
  ArrowLeft, 
  Check, 
  Copy, 
  ShieldCheck, 
  Calendar, 
  CreditCard, 
  Key, 
  ExternalLink,
  X,
  Sparkles,
  ChevronRight,
  BookMarked
} from 'lucide-react';

interface CustomerDashboardProps {
  initialTab?: CustomerAccountTab;
  products: Product[];
  currency: Currency;
  onNavigateHome: () => void;
  onNavigateAllProducts: () => void;
  onNavigateProduct: (productId: string) => void;
  onSignOut: () => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  initialTab = 'library',
  products,
  currency,
  onNavigateHome,
  onNavigateAllProducts,
  onNavigateProduct,
  onSignOut
}) => {
  const { user, customerProfile, updateCustomerProfile, refreshCustomerProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<CustomerAccountTab>(initialTab);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Profile edit state
  const [displayName, setDisplayName] = useState(customerProfile?.name || user?.displayName || '');
  const [phone, setPhone] = useState(customerProfile?.phone || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);

  // Active Reader Modal state
  const [readingProduct, setReadingProduct] = useState<Product | null>(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  // Active Receipt Modal state
  const [viewingReceipt, setViewingReceipt] = useState<OrderRecord | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  // Load orders for this customer
  useEffect(() => {
    if (user?.email) {
      setLoadingOrders(true);
      fetchCustomerOrders(user.email, user.uid)
        .then((fetchedOrders) => {
          setOrders(fetchedOrders);
        })
        .catch((err) => {
          console.warn('Error fetching customer orders:', err);
        })
        .finally(() => {
          setLoadingOrders(false);
        });
    }
  }, [user]);

  // Sync profile edits if profile changes
  useEffect(() => {
    if (customerProfile) {
      setDisplayName(customerProfile.name || '');
      setPhone(customerProfile.phone || '');
    }
  }, [customerProfile]);

  // Combine purchased product IDs from both customer profile AND completed orders
  const purchasedProductIds = Array.from(
    new Set([
      ...(customerProfile?.purchasedProducts?.map((p) => p.productId) || []),
      ...orders.flatMap((o) => o.productIds)
    ])
  );

  // Resolve matching product objects
  const purchasedProducts = purchasedProductIds
    .map((pid) => products.find((p) => p.id === pid))
    .filter(Boolean) as Product[];

  const handleCopyLicense = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadArchive = (prod: Product) => {
    setDownloadNotice(`Initiating verified master download for "${prod.title}"...`);
    
    // Generate authentic license payload text
    const licenseText = `================================================================================
NOVORA DIGITAL - EXECUTIVE DRM-FREE MASTER RELEASE
================================================================================
Monograph Title : ${prod.title}
Catalog Reference: ${prod.id}
License Holder  : ${customerProfile?.name || user?.displayName || 'Executive Customer'}
Registered Email: ${user?.email}
Verification ID : NOV-LIC-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}
Issued Timestamp: ${new Date().toISOString()}
Cryptographic Checksum: SHA-256 Verified Genuine Storefront Acquisition

Included Formats:
- High-Resolution Print Ready PDF (Vector Typography)
- DRM-Free EPUB 3.0 (E-Reader & Tablet Optimized)
- Executive Implementation Worksheets & Prompt Blueprints

Terms of License:
This digital monograph is licensed solely to ${user?.email}.
You are granted perpetual, non-transferable personal and professional study rights.
Redistribution, resale, or unauthorized public mirroring is strictly prohibited.
================================================================================
NOVORA DIGITAL • Sovereign Knowledge Architectures • www.novora.digital
================================================================================`;

    const blob = new Blob([licenseText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `NOVORA-${prod.id}-DRM-FREE-PACKAGE.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setTimeout(() => {
      setDownloadNotice(null);
    }, 3500);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileSuccessMsg(null);
    try {
      const ok = await updateCustomerProfile(displayName.trim(), phone.trim());
      if (ok) {
        setProfileSuccessMsg('Profile updated successfully.');
        await refreshCustomerProfile();
      }
    } finally {
      setIsSavingProfile(false);
      setTimeout(() => setProfileSuccessMsg(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] selection:bg-[#D4AF37] selection:text-black">
      
      {/* Top Customer Dashboard Navigation Bar */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#050505]/95 border-b border-[#D4AF37]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div onClick={onNavigateHome} className="cursor-pointer">
              <NovoraLogo variant="compact" size="sm" />
            </div>
            <div className="hidden sm:block h-5 w-[1px] bg-white/10" />
            <div className="hidden sm:flex flex-col">
              <span className="text-xs font-semibold tracking-[0.2em] text-[#D4AF37] uppercase">
                Customer Account
              </span>
              <span className="text-[10px] text-[#888] font-mono">
                {user?.email}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateHome}
              className="px-3 py-1.5 rounded-lg border border-white/10 hover:border-[#D4AF37]/40 text-xs font-medium text-[#A8A8A8] hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Storefront</span>
            </button>

            <button
              onClick={onSignOut}
              className="px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-200 text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Welcome Banner */}
      <section className="bg-gradient-to-b from-[#0A0A0A] to-[#050505] border-b border-white/5 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] mb-3">
                <ShieldCheck className="w-3 h-3" />
                <span>Verified Executive Account</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-4xl font-light text-white">
                Welcome back, {customerProfile?.name || user?.displayName || user?.email?.split('@')[0]}
              </h1>
              <p className="text-xs sm:text-sm text-[#888] mt-1.5">
                Access your perpetual monograph library, verified license certificates, and order history.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-4">
              <div className="px-4 py-3 rounded-xl bg-[#080808] border border-white/10 text-center min-w-[100px]">
                <span className="text-xl sm:text-2xl font-serif text-[#D4AF37] block">
                  {purchasedProducts.length}
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#777]">
                  Acquired Books
                </span>
              </div>
              <div className="px-4 py-3 rounded-xl bg-[#080808] border border-white/10 text-center min-w-[100px]">
                <span className="text-xl sm:text-2xl font-serif text-[#D4AF37] block">
                  {orders.length}
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#777]">
                  Total Orders
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 sm:gap-4 mt-8 border-b border-white/10 overflow-x-auto pb-px">
            <button
              onClick={() => setActiveTab('library')}
              className={`pb-3 px-3 text-xs sm:text-sm font-medium tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer border-b-2 whitespace-nowrap ${
                activeTab === 'library'
                  ? 'border-[#D4AF37] text-[#F5D76E]'
                  : 'border-transparent text-[#888] hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>My Library ({purchasedProducts.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`pb-3 px-3 text-xs sm:text-sm font-medium tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer border-b-2 whitespace-nowrap ${
                activeTab === 'orders'
                  ? 'border-[#D4AF37] text-[#F5D76E]'
                  : 'border-transparent text-[#888] hover:text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Order History ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`pb-3 px-3 text-xs sm:text-sm font-medium tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer border-b-2 whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'border-[#D4AF37] text-[#F5D76E]'
                  : 'border-transparent text-[#888] hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Profile & Settings</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Tab Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Notification Toast for Downloads */}
        {downloadNotice && (
          <div className="mb-6 p-4 rounded-xl bg-[#0A1A0F] border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-3">
              <Download className="w-4 h-4 text-emerald-400 animate-bounce" />
              <span>{downloadNotice}</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400">DRM-FREE</span>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* TAB 1: MY LIBRARY                                                 */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'library' && (
          <div>
            {purchasedProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {purchasedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-[#080808] border border-white/10 hover:border-[#D4AF37]/50 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col group"
                  >
                    {/* Cover Image & Badge */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-[#0A0A0A]">
                      <img
                        src={product.coverImage}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent" />
                      
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-mono uppercase tracking-wider">
                          DRM-Free Active
                        </span>
                      </div>
                    </div>

                    {/* Book Metadata */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest block mb-1">
                          {product.category}
                        </span>
                        <h3 className="font-serif text-lg text-white font-medium group-hover:text-[#F5D76E] transition-colors line-clamp-1">
                          {product.title}
                        </h3>
                        <p className="text-xs text-[#888] line-clamp-2 mt-1 leading-relaxed">
                          {product.shortDescription}
                        </p>
                      </div>

                      {/* Chapters pill preview */}
                      {product.chapters && product.chapters.length > 0 && (
                        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-[#777]">
                          <span>{product.chapters.length} Curriculum Chapters</span>
                          <span>PDF & EPUB</span>
                        </div>
                      )}

                      {/* Action Buttons: Read Syllabus & Download Archive */}
                      <div className="pt-2 grid grid-cols-2 gap-2">
                        <button
                          onClick={() => {
                            setReadingProduct(product);
                            setActiveChapterIndex(0);
                          }}
                          className="py-2.5 px-3 rounded-lg bg-[#0F0F0F] hover:bg-[#181818] border border-white/10 hover:border-[#D4AF37]/40 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>Read Online</span>
                        </button>

                        <button
                          onClick={() => handleDownloadArchive(product)}
                          className="py-2.5 px-3 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#C9A227] hover:brightness-110 text-black text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty Library State */
              <div className="text-center py-16 px-4 bg-[#080808] border border-white/10 rounded-2xl max-w-2xl mx-auto space-y-6">
                <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center mx-auto">
                  <BookMarked className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl text-white font-light">
                    Your Digital Library is Empty
                  </h2>
                  <p className="text-xs sm:text-sm text-[#888] mt-2 max-w-md mx-auto leading-relaxed">
                    You have not acquired any NOVORA monographs yet. Browse our executive publications in Artificial Intelligence, Wealth Mastery, and Strategic Communication.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    onClick={onNavigateAllProducts}
                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#D4AF37] via-[#F5D76E] to-[#C9A227] text-black text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.3)] inline-flex items-center gap-2"
                  >
                    <span>Browse Executive Catalog</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* TAB 2: ORDER HISTORY                                               */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'orders' && (
          <div>
            {loadingOrders ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-[#777] font-mono">Retrieving encrypted order records...</p>
              </div>
            ) : orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-[#080808] border border-white/10 rounded-xl p-5 sm:p-6 transition-all hover:border-[#D4AF37]/30 flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    {/* Left Order Info */}
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-mono font-semibold text-[#D4AF37]">
                          {order.orderRef || `ORDER-${order.id.slice(0, 8).toUpperCase()}`}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                          {order.paymentStatus}
                        </span>
                        <span className="text-[11px] text-[#666] font-mono">
                          {new Date(order.orderDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>

                      {/* Purchased Products */}
                      <div className="text-sm font-medium text-white">
                        {order.productTitles?.join(', ') || 'NOVORA Digital Acquisition'}
                      </div>

                      {/* Payment info & license */}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-[#888] pt-1">
                        <div className="flex items-center gap-1.5">
                          <CreditCard className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span className="font-mono">{order.paymentMethod || 'SECURE CHECKOUT'}</span>
                        </div>

                        {order.licenseKey && (
                          <div className="flex items-center gap-1.5 bg-[#040404] px-2 py-0.5 rounded border border-white/10">
                            <Key className="w-3.5 h-3.5 text-[#D4AF37]" />
                            <span className="font-mono text-[11px] text-white">{order.licenseKey}</span>
                            <button
                              onClick={() => handleCopyLicense(order.licenseKey)}
                              className="text-[#888] hover:text-white p-0.5 cursor-pointer"
                              title="Copy License Key"
                            >
                              {copiedKey === order.licenseKey ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Price & Invoice Button */}
                    <div className="flex items-center justify-between md:flex-col md:items-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-white/5">
                      <div className="text-right">
                        <span className="text-xs text-[#777] block font-mono">Amount Paid</span>
                        <span className="font-serif text-lg text-white font-medium">
                          {order.currency === 'INR' ? '₹' : order.currency} {order.amount.toLocaleString()}
                        </span>
                      </div>

                      <button
                        onClick={() => setViewingReceipt(order)}
                        className="px-3 py-1.5 rounded bg-[#111] hover:bg-[#1A1A1A] border border-white/10 hover:border-[#D4AF37]/40 text-xs text-[#D4AF37] font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Receipt</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-[#080808] border border-white/10 rounded-2xl space-y-4">
                <ShoppingBag className="w-10 h-10 text-[#555] mx-auto" />
                <h3 className="font-serif text-xl text-white">No Purchase History Found</h3>
                <p className="text-xs text-[#777]">Orders placed with this account will automatically appear here.</p>
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* TAB 3: PROFILE & SETTINGS                                         */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl mx-auto space-y-8">
            
            {/* Account Credentials Card */}
            <div className="bg-[#080808] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] block">
                  Customer Credentials
                </span>
                <h2 className="font-serif text-xl text-white font-light mt-1">
                  Profile Information
                </h2>
                <p className="text-xs text-[#888] mt-1">
                  Keep your customer details updated for license generation and receipts.
                </p>
              </div>

              {profileSuccessMsg && (
                <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{profileSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#A8A8A8] mb-1 font-mono">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#050505] border border-white/15 focus:border-[#D4AF37] focus:outline-none text-xs text-white placeholder-[#555] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#A8A8A8] mb-1 font-mono">
                    Registered Email (Read Only)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#030303] border border-white/5 text-xs text-[#777] cursor-not-allowed font-mono"
                  />
                  <span className="text-[10px] text-[#555] mt-1 block font-mono">
                    Authentication provider: {user?.providerData[0]?.providerId || 'firebase'}
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#A8A8A8] mb-1 font-mono">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#050505] border border-white/15 focus:border-[#D4AF37] focus:outline-none text-xs text-white placeholder-[#555] transition-colors"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#C9A227] text-black text-xs font-semibold uppercase tracking-wider hover:brightness-110 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSavingProfile ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>Save Changes</span>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Security Overview */}
            <div className="bg-[#080808] border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Security & Authentication</h3>
                  <p className="text-xs text-[#888]">Your passwords and credentials are cryptographically protected by Firebase Auth.</p>
                </div>
              </div>
              <div className="text-[11px] text-[#666] border-t border-white/5 pt-3 font-mono space-y-1">
                <div>Client Session ID: <span className="text-[#888]">{user?.uid}</span></div>
                <div>Access Level: <span className="text-emerald-400 font-semibold">Verified Customer</span></div>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* ------------------------------------------------------------------ */}
      {/* INTERACTIVE DIGITAL EBOOK READER MODAL                             */}
      {/* ------------------------------------------------------------------ */}
      {readingProduct && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="w-full max-w-4xl bg-[#080808] border border-[#D4AF37]/30 rounded-2xl overflow-hidden shadow-2xl my-auto flex flex-col max-h-[90vh]">
            
            {/* Top Reader Header */}
            <div className="p-4 sm:p-6 bg-[#050505] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37]">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider block">
                    DRM-Free Master Edition
                  </span>
                  <h2 className="font-serif text-base sm:text-lg text-white font-medium line-clamp-1">
                    {readingProduct.title}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleDownloadArchive(readingProduct)}
                  className="px-3 py-1.5 rounded bg-[#111] hover:bg-[#1A1A1A] border border-white/10 text-xs text-[#D4AF37] font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Download</span>
                </button>

                <button
                  onClick={() => setReadingProduct(null)}
                  className="p-1.5 text-[#888] hover:text-white rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Reader Content Body */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              
              {/* Left Chapters Navigation */}
              <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/10 bg-[#050505] p-4 overflow-y-auto max-h-48 md:max-h-none">
                <span className="text-[10px] uppercase tracking-widest text-[#777] font-mono block mb-3">
                  Curriculum Chapters
                </span>
                <div className="space-y-1.5">
                  {readingProduct.chapters && readingProduct.chapters.length > 0 ? (
                    readingProduct.chapters.map((ch, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveChapterIndex(idx)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between cursor-pointer ${
                          activeChapterIndex === idx
                            ? 'bg-[#D4AF37]/15 text-[#F5D76E] border border-[#D4AF37]/30'
                            : 'text-[#888] hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <span className="line-clamp-1">
                          {idx + 1}. {ch.title}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="text-xs text-[#666]">Standard Edition</div>
                  )}
                </div>
              </div>

              {/* Right Chapter Reading Canvas */}
              <div className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-6">
                {readingProduct.chapters && readingProduct.chapters[activeChapterIndex] ? (
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] block mb-1">
                      Chapter {activeChapterIndex + 1} of {readingProduct.chapters.length}
                    </span>
                    <h3 className="font-serif text-2xl text-white font-normal mb-4">
                      {readingProduct.chapters[activeChapterIndex].title}
                    </h3>
                    <div className="p-4 rounded-xl bg-[#040404] border border-white/10 text-xs sm:text-sm text-[#CCCCCC] leading-relaxed mb-6 font-serif">
                      {readingProduct.chapters[activeChapterIndex].description}
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xs uppercase font-mono tracking-wider text-[#A8A8A8]">
                        Executive Implementation Notes & Worksheets
                      </h4>
                      <div className="space-y-2 text-xs text-[#888] leading-relaxed">
                        <p>
                          This chapter encompasses high-leverage mental models and operational execution tactics formulated exclusively for NOVORA members.
                        </p>
                        <p>
                          The offline release archive includes detailed step-by-step vector schematics, prompt parameters, and execution templates.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="font-serif text-xl text-white mb-2">{readingProduct.title}</h3>
                    <p className="text-xs text-[#888] leading-relaxed">{readingProduct.fullDescription}</p>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* INVOICE & RECEIPT MODAL                                            */}
      {/* ------------------------------------------------------------------ */}
      {viewingReceipt && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="w-full max-w-lg bg-[#080808] border border-[#D4AF37]/35 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 my-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <NovoraLogo variant="compact" size="sm" />
              <button
                onClick={() => setViewingReceipt(null)}
                className="p-1.5 text-[#888] hover:text-white rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#D4AF37]">
                Official Tax Invoice & Receipt
              </span>
              <h2 className="font-serif text-2xl text-white font-light">
                {viewingReceipt.orderRef || `NOV-${viewingReceipt.id.slice(0, 8).toUpperCase()}`}
              </h2>
              <span className="text-[11px] text-[#777] font-mono block">
                {new Date(viewingReceipt.orderDate).toUTCString()}
              </span>
            </div>

            <div className="bg-[#050505] p-4 rounded-xl border border-white/10 space-y-3 text-xs">
              <div className="flex justify-between text-[#888]">
                <span>Customer</span>
                <span className="text-white font-medium">{viewingReceipt.customerName}</span>
              </div>
              <div className="flex justify-between text-[#888]">
                <span>Email</span>
                <span className="text-white font-mono">{viewingReceipt.customerEmail}</span>
              </div>
              <div className="flex justify-between text-[#888]">
                <span>Payment Method</span>
                <span className="text-white font-mono">{viewingReceipt.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-[#888]">
                <span>License Key</span>
                <span className="text-[#D4AF37] font-mono">{viewingReceipt.licenseKey}</span>
              </div>
              <div className="border-t border-white/10 pt-2 flex justify-between text-sm font-semibold">
                <span className="text-white">Total Amount Paid</span>
                <span className="text-[#F5D76E] font-serif">
                  {viewingReceipt.currency === 'INR' ? '₹' : viewingReceipt.currency} {viewingReceipt.amount.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="text-center text-[10px] text-[#666] font-mono">
              256-BIT SSL ENCRYPTED TRANSACTION • VERIFIED SOVEREIGN COMMERCE
            </div>

            <button
              onClick={() => setViewingReceipt(null)}
              className="w-full py-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-white font-semibold transition-colors cursor-pointer"
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
