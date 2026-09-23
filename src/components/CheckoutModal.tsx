import React, { useState } from 'react';
import { CartItem, Currency } from '../types';
import { formatPrice } from '../data/products';
import { 
  X, 
  Lock, 
  CheckCircle, 
  Download, 
  FileText, 
  ShieldCheck, 
  CreditCard, 
  Sparkles, 
  Copy, 
  Check, 
  QrCode, 
  Building2, 
  Smartphone, 
  ReceiptText 
} from 'lucide-react';
import { NovoraLogo } from './NovoraLogo';
import { recordOrderInFirestore } from '../lib/firestoreService';
import { useAuth } from '../lib/AuthContext';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  currency: Currency;
  appliedDiscount: number;
  onCompleteOrder: () => void;
  onNavigateToLibrary?: () => void;
}

type PaymentTab = 'upi' | 'cards' | 'netbanking';

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  currency,
  appliedDiscount,
  onCompleteOrder,
  onNavigateToLibrary,
}) => {
  const { user, customerProfile, refreshCustomerProfile } = useAuth();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  // Auto-fill logged-in customer info if fields are empty
  React.useEffect(() => {
    if (user && !email) {
      setEmail(user.email || '');
    }
    if ((customerProfile?.name || user?.displayName) && !name) {
      setName(customerProfile?.name || user?.displayName || '');
    }
    if (customerProfile?.phone && !phone) {
      setPhone(customerProfile.phone);
    }
  }, [user, customerProfile]);
  const [paymentTab, setPaymentTab] = useState<PaymentTab>('upi');
  const [upiId, setUpiId] = useState('');
  const [showQr, setShowQr] = useState(false);
  const [selectedBank, setSelectedBank] = useState('hdfc');
  const [claimGst, setClaimGst] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [gstin, setGstin] = useState('');

  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState('11/29');
  const [cardCvv, setCardCvv] = useState('•••');

  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const rawSubtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const discountAmount = Math.round((rawSubtotal * appliedDiscount) / 100);
  const total = Math.max(0, rawSubtotal - discountAmount);

  const formattedSubtotal = formatPrice(rawSubtotal, currency);
  const formattedDiscount = formatPrice(discountAmount, currency);
  const formattedTotal = formatPrice(total, currency);

  const licenseKey = `NOVORA-IN-2026-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  const orderRef = `NOV-${Math.floor(100000 + Math.random() * 900000)}`;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    recordOrderInFirestore({
      orderRef,
      userId: user?.uid,
      customerEmail: email.trim() || user?.email || 'concierge-order@novora.digital',
      customerName: name.trim() || customerProfile?.name || user?.displayName || 'Verified Executive',
      customerPhone: phone.trim() || undefined,
      productIds: cartItems.map((i) => i.product.id),
      productTitles: cartItems.map((i) => i.product.title),
      amount: total,
      currency: currency,
      paymentStatus: 'completed',
      paymentMethod: paymentTab.toUpperCase(),
      licenseKey,
      orderDate: new Date().toISOString()
    }).then(() => {
      refreshCustomerProfile();
    }).catch((err) => {
      console.warn('Order sync note:', err);
    });

    setTimeout(() => {
      setIsProcessing(false);
      setIsCompleted(true);
      onCompleteOrder();
    }, 1200);
  };

  const handleCopyLicense = () => {
    navigator.clipboard.writeText(licenseKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleTriggerDownload = (title: string) => {
    setDownloadNotice(`Downloading master archive for ${title}...`);
    setTimeout(() => {
      setDownloadNotice(null);
    }, 3000);
  };

  return (
    <div
      id="checkout-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
    >
      <div
        id="checkout-modal-container"
        className="w-full max-w-2xl bg-[#080808] border border-[#D4AF37]/35 rounded-2xl shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden my-auto"
      >
        {/* Top Header */}
        <div className="p-5 sm:p-6 bg-[#050505] border-b border-[#D4AF37]/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <NovoraLogo variant="compact" size="sm" showTagline={false} />
            <div className="h-4 w-[1px] bg-[#D4AF37]/30" />
            <div className="flex flex-col">
              <span className="text-xs font-semibold tracking-[0.2em] text-[#D4AF37] uppercase">
                {isCompleted ? 'Executive Delivery Terminal' : 'Secure Acquisition Desk'}
              </span>
              <span className="text-[10px] text-[#A8A8A8] tracking-wider uppercase">
                256-Bit SSL Encrypted • India & Global Sovereign Gateway
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#A8A8A8] hover:text-white rounded-full hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Checkout Form OR Download Terminal */}
        {!isCompleted ? (
          <form onSubmit={handlePay} className="p-5 sm:p-8 space-y-6">
            
            {/* Order Summary Card */}
            <div className="p-4 rounded-lg bg-[#050505] border border-[#D4AF37]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[11px] text-[#A8A8A8] uppercase tracking-wider block">
                  Acquisition Package:
                </span>
                <span className="text-sm font-serif text-white truncate block">
                  {cartItems.map((i) => i.product.title).join(', ')}
                </span>
              </div>
              <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-white/10 shrink-0">
                <span className="text-[11px] text-[#A8A8A8] uppercase tracking-wider block">
                  Total Payable:
                </span>
                <span className="text-xl font-bold text-[#F5D76E]">{formattedTotal}</span>
              </div>
            </div>

            {/* Buyer Contact Details */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#A8A8A8] mb-1.5 font-medium">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Aditya Sharma"
                    className="w-full bg-[#050505] border border-[#D4AF37]/30 rounded px-3.5 py-2 text-xs text-white placeholder-[#666] focus:outline-none focus:border-[#F5D76E]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#A8A8A8] mb-1.5 font-medium">
                    Digital Delivery Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="aditya@venture.in"
                    className="w-full bg-[#050505] border border-[#D4AF37]/30 rounded px-3.5 py-2 text-xs text-white placeholder-[#666] focus:outline-none focus:border-[#F5D76E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#A8A8A8] mb-1.5 font-medium flex items-center justify-between">
                  <span>Mobile Number (For Instant WhatsApp Access)</span>
                  <span className="text-[10px] text-[#D4AF37] font-normal">Optional</span>
                </label>
                <div className="flex gap-2">
                  <span className="px-3 py-2 bg-[#050505] border border-[#D4AF37]/30 rounded text-xs text-[#A8A8A8] flex items-center">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="98765 43210"
                    className="flex-1 bg-[#050505] border border-[#D4AF37]/30 rounded px-3.5 py-2 text-xs text-white placeholder-[#666] focus:outline-none focus:border-[#F5D76E]"
                  />
                </div>
              </div>

              {/* Indian Payment Method Tabs */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#A8A8A8] mb-2 font-medium">
                  Select Payment Method
                </label>
                
                {/* Method Switcher Tabs */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setPaymentTab('upi')}
                    className={`py-2 px-2.5 rounded text-xs font-semibold tracking-wider flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                      paymentTab === 'upi'
                        ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-[#F5D76E]'
                        : 'border-[#D4AF37]/20 bg-[#050505] text-[#A8A8A8] hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>UPI / QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentTab('cards')}
                    className={`py-2 px-2.5 rounded text-xs font-semibold tracking-wider flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                      paymentTab === 'cards'
                        ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-[#F5D76E]'
                        : 'border-[#D4AF37]/20 bg-[#050505] text-[#A8A8A8] hover:text-white'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>RuPay & Cards</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentTab('netbanking')}
                    className={`py-2 px-2.5 rounded text-xs font-semibold tracking-wider flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                      paymentTab === 'netbanking'
                        ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-[#F5D76E]'
                        : 'border-[#D4AF37]/20 bg-[#050505] text-[#A8A8A8] hover:text-white'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>NetBanking</span>
                  </button>
                </div>

                {/* Tab 1: UPI / QR */}
                {paymentTab === 'upi' && (
                  <div className="p-4 rounded-lg bg-[#050505] border border-[#D4AF37]/25 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-[#F5F5F5]">
                        <span className="text-[11px] font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/20">
                          BHIM UPI
                        </span>
                        <span>Google Pay • PhonePe • Paytm • CRED</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowQr(!showQr)}
                        className="text-[11px] text-[#F5D76E] hover:underline flex items-center gap-1"
                      >
                        <QrCode className="w-3 h-3" />
                        <span>{showQr ? 'Enter VPA ID' : 'Scan QR'}</span>
                      </button>
                    </div>

                    {!showQr ? (
                      <div>
                        <label className="block text-[11px] text-[#A8A8A8] mb-1">
                          Enter UPI Virtual Payment Address (VPA)
                        </label>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="aditya@okhdfcbank or 9876543210@paytm"
                          className="w-full bg-[#080808] border border-[#D4AF37]/30 rounded px-3 py-2 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#F5D76E]"
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-3 bg-[#080808] rounded border border-[#D4AF37]/20 text-center">
                        <div className="w-32 h-32 bg-white p-2 rounded-lg flex items-center justify-center mb-2 shadow-inner">
                          {/* Stylized QR representation */}
                          <div className="w-full h-full border-2 border-black p-1 flex flex-col justify-between">
                            <div className="flex justify-between">
                              <div className="w-7 h-7 bg-black" />
                              <div className="w-7 h-7 bg-black" />
                            </div>
                            <div className="flex items-center justify-center">
                              <span className="text-[9px] font-bold text-black tracking-widest">NOVORA</span>
                            </div>
                            <div className="flex justify-between">
                              <div className="w-7 h-7 bg-black" />
                              <div className="w-4 h-4 bg-black" />
                            </div>
                          </div>
                        </div>
                        <span className="text-[11px] text-[#D4AF37] font-mono font-medium">
                          UPI ID: novora.digital@icici
                        </span>
                        <span className="text-[10px] text-[#A8A8A8] mt-0.5">
                          Scan using any UPI App to authorize {formattedTotal}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 2: RuPay / Credit / Debit Cards */}
                {paymentTab === 'cards' && (
                  <div className="p-4 rounded-lg bg-[#050505] border border-[#D4AF37]/25 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-[#A8A8A8] mb-1">
                      <span className="px-1.5 py-0.5 rounded bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] font-bold">RuPay</span>
                      <span className="px-1.5 py-0.5 rounded bg-white/5 text-white text-[10px]">Visa</span>
                      <span className="px-1.5 py-0.5 rounded bg-white/5 text-white text-[10px]">MasterCard</span>
                      <span className="px-1.5 py-0.5 rounded bg-white/5 text-white text-[10px]">Amex</span>
                    </div>

                    <div>
                      <label className="block text-[11px] text-[#A8A8A8] mb-1">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="•••• •••• •••• ••••"
                        className="w-full bg-[#080808] border border-[#D4AF37]/30 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F5D76E]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-[#A8A8A8] mb-1">Valid Thru</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full bg-[#080808] border border-[#D4AF37]/30 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F5D76E]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-[#A8A8A8] mb-1">CVV / Security</label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="•••"
                          className="w-full bg-[#080808] border border-[#D4AF37]/30 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F5D76E]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 3: NetBanking */}
                {paymentTab === 'netbanking' && (
                  <div className="p-4 rounded-lg bg-[#050505] border border-[#D4AF37]/25 space-y-3">
                    <label className="block text-[11px] text-[#A8A8A8] mb-1">
                      Select Your Bank (Direct RBI Gateway)
                    </label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full bg-[#080808] border border-[#D4AF37]/30 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F5D76E]"
                    >
                      <option value="hdfc">HDFC Bank</option>
                      <option value="icici">ICICI Bank</option>
                      <option value="sbi">State Bank of India (SBI)</option>
                      <option value="axis">Axis Bank</option>
                      <option value="kotak">Kotak Mahindra Bank</option>
                      <option value="other">Other Indian Scheduled Banks</option>
                    </select>
                    <span className="text-[10px] text-[#A8A8A8] block">
                      You will be securely routed to authenticate through your bank's portal.
                    </span>
                  </div>
                )}
              </div>

              {/* Indian GST Tax Invoice Option */}
              <div className="p-3.5 rounded-lg bg-[#050505] border border-[#D4AF37]/20">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs text-white">
                  <input
                    type="checkbox"
                    checked={claimGst}
                    onChange={(e) => setClaimGst(e.target.checked)}
                    className="accent-[#D4AF37] w-4 h-4 rounded cursor-pointer"
                  />
                  <span className="font-medium flex items-center gap-1.5">
                    <ReceiptText className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Claim GST Input Tax Credit (Corporate Tax Invoice)
                  </span>
                </label>

                {claimGst && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pt-3 border-t border-white/10 animate-in fade-in duration-200">
                    <div>
                      <label className="block text-[10px] uppercase text-[#A8A8A8] mb-1">
                        Registered Company / Entity Name
                      </label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Apex Technologies Pvt Ltd"
                        className="w-full bg-[#080808] border border-[#D4AF37]/30 rounded px-3 py-1.5 text-xs text-white placeholder-[#666] focus:outline-none focus:border-[#F5D76E]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase text-[#A8A8A8] mb-1">
                        15-Digit GSTIN
                      </label>
                      <input
                        type="text"
                        maxLength={15}
                        value={gstin}
                        onChange={(e) => setGstin(e.target.value.toUpperCase())}
                        placeholder="29AAAAA0000A1Z5"
                        className="w-full bg-[#080808] border border-[#D4AF37]/30 rounded px-3 py-1.5 text-xs text-white placeholder-[#666] uppercase focus:outline-none focus:border-[#F5D76E]"
                      />
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Submit Action */}
            <div className="pt-3 border-t border-white/10">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 px-6 rounded bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#C9A227] text-[#050505] font-bold text-xs uppercase tracking-[0.2em] hover:brightness-110 shadow-[0_0_25px_rgba(212,175,55,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Authorizing & Generating Encrypted Access...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Complete Acquisition ({formattedTotal})</span>
                  </>
                )}
              </button>

              <div className="mt-3 flex items-center justify-center gap-3 text-[10px] text-[#A8A8A8]">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>RBI Compliant & 256-Bit SSL</span>
                </span>
                <span>•</span>
                <span>30-Day Money Back Guarantee</span>
                <span>•</span>
                <span>Instant Digital Dispatch</span>
              </div>
            </div>

          </form>
        ) : (
          /* Instant Download & Delivery Terminal */
          <div className="p-6 sm:p-8 space-y-6 text-center animate-in fade-in zoom-in-95 duration-300">
            <div className="flex justify-center mb-1">
              <NovoraLogo variant="vertical" size="sm" />
            </div>

            <div className="w-14 h-14 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/50 flex items-center justify-center mx-auto text-[#F5D76E] shadow-[0_0_30px_rgba(212,175,55,0.3)]">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-serif text-2xl sm:text-3xl font-light text-white">
                Acquisition Confirmed & Dispatched
              </h3>
              <p className="mt-1 text-xs text-[#A8A8A8] font-light">
                Order Ref: <span className="text-[#D4AF37] font-mono">{orderRef}</span> • An encrypted receipt and download bundle have been generated.
              </p>
            </div>

            {/* License Key Box */}
            <div className="p-4 rounded-lg bg-[#050505] border border-[#D4AF37]/30 text-left flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#A8A8A8] block">
                  Sovereign Lifetime License Key
                </span>
                <span className="font-mono text-sm text-[#F5D76E] font-semibold">
                  {licenseKey}
                </span>
              </div>
              <button
                onClick={handleCopyLicense}
                className="p-2 text-xs rounded border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10 flex items-center gap-1"
                title="Copy license key"
              >
                {copiedKey ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* GST Tax Invoice Badge if claimed */}
            {claimGst && gstin && (
              <div className="p-3 rounded-lg bg-[#0D0D0D] border border-[#D4AF37]/25 text-left text-xs space-y-1">
                <div className="flex items-center justify-between text-[#F5D76E] font-medium">
                  <span className="flex items-center gap-1.5">
                    <ReceiptText className="w-3.5 h-3.5" />
                    GST Tax Invoice Registered
                  </span>
                  <span className="font-mono text-[11px] text-[#A8A8A8]">SAC 998431</span>
                </div>
                <div className="text-[#A8A8A8] text-[11px]">
                  Billed to: <span className="text-white font-medium">{companyName || name}</span> (GSTIN: <span className="font-mono text-white">{gstin}</span>)
                </div>
              </div>
            )}

            {/* Deliverables Download Links */}
            <div className="space-y-3 text-left">
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-white block">
                Instant Deliverables:
              </span>

              {cartItems.map(({ product }) => (
                <div
                  key={product.id}
                  className="p-3.5 rounded-lg bg-[#050505] border border-[#D4AF37]/20 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="w-5 h-5 text-[#D4AF37] shrink-0" />
                    <div className="min-w-0 truncate">
                      <div className="text-xs font-semibold text-white truncate">{product.title}</div>
                      <div className="text-[10px] text-[#A8A8A8]">{product.productFormat || 'Digital Edition'}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleTriggerDownload(product.title)}
                    className="px-3 py-1.5 rounded bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#F5D76E] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              ))}

              {downloadNotice && (
                <div className="p-2 text-center text-xs text-[#F5D76E] bg-[#D4AF37]/10 rounded border border-[#D4AF37]/20 animate-in fade-in">
                  {downloadNotice}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {onNavigateToLibrary && (
                <button
                  onClick={() => {
                    onClose();
                    onNavigateToLibrary();
                  }}
                  className="flex-1 py-3 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#C9A227] hover:brightness-110 text-black text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md"
                >
                  View in My Library →
                </button>
              )}
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-lg border border-[#D4AF37]/30 text-white text-xs uppercase tracking-wider hover:bg-white/5 transition-all cursor-pointer"
              >
                Return to Store
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
