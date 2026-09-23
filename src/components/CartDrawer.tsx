import React, { useState } from 'react';
import { CartItem, Currency } from '../types';
import { formatPrice } from '../data/products';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { NovoraLogo } from './NovoraLogo';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  currency: Currency;
  onProceedToCheckout: (appliedDiscount: number) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  currency,
  onProceedToCheckout,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');

  if (!isOpen) return null;

  const rawSubtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const discountAmount = Math.round((rawSubtotal * discountPercent) / 100);
  const total = Math.max(0, rawSubtotal - discountAmount);

  const formattedSubtotal = formatPrice(rawSubtotal, currency);
  const formattedDiscount = formatPrice(discountAmount, currency);
  const formattedTotal = formatPrice(total, currency);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'NOVORA10') {
      setDiscountPercent(10);
      setPromoMessage('Code NOVORA10 applied: 10% executive privilege discount!');
    } else {
      setPromoMessage('Invalid promo code. Use code NOVORA10.');
    }
  };

  return (
    <div
      id="cart-drawer-backdrop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end transition-opacity"
    >
      <div
        id="cart-drawer-panel"
        className="w-full max-w-md bg-[#080808] border-l border-[#D4AF37]/25 h-full flex flex-col justify-between shadow-[0_0_50px_rgba(0,0,0,0.9)] animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="p-6 border-b border-[#D4AF37]/20 flex items-center justify-between bg-[#050505]">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
            <span className="font-serif text-xl font-light text-white tracking-wide">
              Your Acquisition Bag
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 font-mono">
              ({cartItems.length})
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-[#A8A8A8] hover:text-white rounded-full hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close Bag"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="mb-4">
                <NovoraLogo variant="emblem-only" size="md" />
              </div>
              <p className="font-serif text-lg text-white font-light">Your bag is currently empty.</p>
              <p className="text-xs text-[#A8A8A8] mt-1 max-w-xs">
                Explore our curated publications and blueprints to elevate your sovereign leverage.
              </p>
              <button
                onClick={onClose}
                className="mt-6 px-6 py-2.5 rounded bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-wider hover:brightness-110 transition-all cursor-pointer"
              >
                Browse Collection
              </button>
            </div>
          ) : (
            cartItems.map(({ product, quantity }) => {
              const itemPrice = formatPrice(product.price * quantity, currency);
              return (
                <div
                  key={product.id}
                  className="p-4 rounded-lg bg-[#050505] border border-[#D4AF37]/20 flex gap-3.5 items-center justify-between"
                >
                  <img
                    src={product.coverImage}
                    alt={product.title}
                    referrerPolicy="no-referrer"
                    className="w-14 h-16 object-cover rounded border border-[#D4AF37]/25"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-sm text-white font-normal truncate">
                      {product.title}
                    </h4>
                    <p className="text-[10px] text-[#A8A8A8] uppercase tracking-wider truncate font-mono">
                      DISCIPLINE · {product.category.toUpperCase()}
                    </p>
                    <div className="text-xs font-medium text-[#F5D76E] mt-1">
                      {itemPrice}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onRemoveItem(product.id)}
                      className="p-1 text-[#666] hover:text-red-400 transition-colors cursor-pointer"
                      title="Remove product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer with Subtotal, Promo, and Checkout */}
        {cartItems.length > 0 && (
          <div className="p-6 bg-[#050505] border-t border-[#D4AF37]/25 space-y-4">
            
            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-[#A8A8A8] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Promo (try NOVORA10)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="w-full bg-[#080808] border border-[#D4AF37]/25 rounded pl-9 pr-3 py-2 text-xs text-white placeholder-[#666] focus:outline-none focus:border-[#F5D76E]"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-2 rounded bg-[#0D0D0D] border border-[#D4AF37]/35 text-xs text-[#F5D76E] hover:bg-[#D4AF37]/10 transition-colors font-medium cursor-pointer"
              >
                Apply
              </button>
            </form>

            {promoMessage && (
              <div className="text-[11px] text-[#D4AF37] font-medium">{promoMessage}</div>
            )}

            {/* Calculations */}
            <div className="space-y-1.5 text-xs text-[#A8A8A8] pt-2 border-t border-white/5">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formattedSubtotal}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-[#F5D76E]">
                  <span>Executive Privilege (-{discountPercent}%)</span>
                  <span>-{formattedDiscount}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-light text-white pt-2 border-t border-white/5">
                <span className="font-serif">Total Due</span>
                <span className="font-bold text-[#F5D76E]">{formattedTotal}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              id="btn-drawer-checkout"
              onClick={() => onProceedToCheckout(discountPercent)}
              className="w-full py-3.5 px-4 rounded bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#C9A227] text-[#050505] font-bold text-xs uppercase tracking-[0.2em] hover:brightness-110 shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Instant Checkout</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-[#A8A8A8]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Encrypted 256-bit SSL • Instant DRM-Free Delivery</span>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};
