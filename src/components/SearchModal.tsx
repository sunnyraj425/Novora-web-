import React, { useState } from 'react';
import { Product, Currency } from '../types';
import { formatPrice } from '../data/products';
import { X, Search, BookOpen, ShoppingBag, ArrowRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  currency: Currency;
  onSelectProduct: (p: Product) => void;
  onAddToCart: (p: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  currency,
  onSelectProduct,
  onAddToCart,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const results = products.filter((p) => {
    if (p.isPublished === false) return false;
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      p.title.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q) ||
      p.fullDescription.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

  return (
    <div
      id="search-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-start justify-center p-4 pt-16 sm:pt-24"
    >
      <div
        id="search-modal-container"
        className="w-full max-w-xl bg-[#080808] border border-[#D4AF37]/35 rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.95)] overflow-hidden"
      >
        {/* Search Input Bar */}
        <div className="p-4 bg-[#050505] border-b border-[#D4AF37]/20 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#D4AF37]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search publications in AI, Finance, Communication..."
            className="flex-1 bg-transparent border-none text-sm text-white placeholder-[#666] focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 text-[#A8A8A8] hover:text-white rounded-full hover:bg-white/10 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Suggestions / Topics: ONLY 3 PRIMARY DISCIPLINES */}
        <div className="px-4 py-2 bg-[#0D0D0D] border-b border-white/5 flex items-center gap-2 overflow-x-auto text-[11px]">
          <span className="text-[#A8A8A8] whitespace-nowrap font-mono">Filter:</span>
          {['AI', 'Finance', 'Communication', 'Bundle', 'Blueprint'].map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="px-2.5 py-0.5 rounded border border-[#D4AF37]/25 text-[#D4AF37] hover:bg-[#D4AF37]/10 whitespace-nowrap cursor-pointer uppercase font-mono text-[10px]"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-3">
          {results.length === 0 ? (
            <div className="text-center py-10 text-xs text-[#A8A8A8]">
              No publications match “{query}”.
            </div>
          ) : (
            results.map((product) => {
              const currentPrice = formatPrice(product.price, currency);
              return (
                <div
                  key={product.id}
                  className="p-3 rounded-lg bg-[#050505] border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 flex items-center justify-between gap-3 group transition-colors"
                >
                  <div
                    onClick={() => {
                      onSelectProduct(product);
                      onClose();
                    }}
                    className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                  >
                    <img
                      src={product.coverImage}
                      alt={product.title}
                      referrerPolicy="no-referrer"
                      className="w-12 h-14 object-cover rounded border border-[#D4AF37]/30 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-mono text-[#D4AF37]">
                          {product.category}
                        </span>
                        {product.discount && (
                          <span className="text-[9px] text-[#F5D76E] bg-[#D4AF37]/15 px-1 rounded">
                            {product.discount}% off
                          </span>
                        )}
                      </div>
                      <div className="font-serif text-sm text-white truncate group-hover:text-[#F5D76E] transition-colors">
                        {product.title}
                      </div>
                      <div className="text-xs text-white/90 font-light mt-0.5">
                        {currentPrice}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        onAddToCart(product);
                        onClose();
                      }}
                      className="p-2 rounded bg-[#D4AF37]/15 text-[#F5D76E] hover:bg-[#D4AF37]/25 transition-colors cursor-pointer"
                      title="Add to bag"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        onSelectProduct(product);
                        onClose();
                      }}
                      className="p-2 rounded border border-white/10 hover:border-white/30 text-white transition-colors cursor-pointer"
                      title="View details"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};
