import React from 'react';
import { Product, Currency } from '../types';
import { formatPrice } from '../data/products';
import { ArrowRight, ShoppingBag, BookOpen } from 'lucide-react';

interface FeaturedProductsProps {
  products: Product[];
  currency: Currency;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onViewAllClick: () => void;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  products,
  currency,
  onSelectProduct,
  onAddToCart,
  onViewAllClick,
}) => {
  const featured = products.filter((p) => p.isFeatured && p.isPublished !== false);

  if (featured.length === 0) return null;

  return (
    <section id="featured-section" className="py-20 lg:py-28 border-b border-[#D4AF37]/15 bg-[#080808]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="w-5 h-[1px] bg-[#D4AF37]" />
              <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#D4AF37]">
                Curated Highlights
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-white">
              Featured Publications
            </h2>
            <p className="mt-2 text-sm text-[#A8A8A8] font-light max-w-xl">
              Hand-selected titles spanning AI workflows, financial discipline, and high-consequence speech.
            </p>
          </div>

          <button
            onClick={onViewAllClick}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37] hover:text-[#F5D76E] transition-colors self-start md:self-auto cursor-pointer"
          >
            <span>View All Products ({products.filter(p => p.isPublished !== false).length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Featured Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((product) => {
            const formattedPrice = formatPrice(product.price, currency);
            const formattedOriginal = product.originalPrice
              ? formatPrice(product.originalPrice, currency)
              : null;

            return (
              <div
                key={product.id}
                className="group relative rounded-xl bg-[#050505] border border-[#D4AF37]/25 hover:border-[#D4AF37] flex flex-col justify-between overflow-hidden transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
              >
                {/* Product Cover Thumbnail */}
                <div
                  onClick={() => onSelectProduct(product)}
                  className="relative aspect-[16/10] overflow-hidden cursor-pointer bg-[#0A0A0A]"
                >
                  <img
                    src={product.coverImage}
                    alt={product.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/30" />

                  {/* Top Category Badge */}
                  <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                    <span className="text-[10px] uppercase font-mono tracking-widest px-2.5 py-1 rounded bg-black/85 backdrop-blur-md border border-[#D4AF37]/35 text-[#F5D76E]">
                      {product.category.toUpperCase()}
                    </span>
                    {product.badge && (
                      <span className="text-[9px] uppercase font-mono tracking-widest px-2 py-1 rounded bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#F5D76E]">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  {product.discount && (
                    <div className="absolute top-3.5 right-3.5 text-[10px] font-bold text-black bg-[#D4AF37] px-2 py-0.5 rounded tracking-wider uppercase">
                      {product.discount}% OFF
                    </div>
                  )}
                </div>

                {/* Content Details */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] text-[#888] uppercase tracking-wider mb-2 font-mono">
                      {product.productFormat}
                    </div>

                    <h3
                      onClick={() => onSelectProduct(product)}
                      className="font-serif text-xl sm:text-2xl text-white font-light group-hover:text-[#F5D76E] transition-colors cursor-pointer leading-snug"
                    >
                      {product.title}
                    </h3>

                    <p className="mt-2.5 text-xs text-[#A8A8A8] font-light leading-relaxed line-clamp-3">
                      {product.shortDescription}
                    </p>
                  </div>

                  {/* Pricing & Actions */}
                  <div className="mt-6 pt-5 border-t border-white/10">
                    <div className="flex items-baseline justify-between mb-4">
                      <div>
                        <div className="text-xl font-light text-white tracking-tight">
                          {formattedPrice}
                        </div>
                        {formattedOriginal && (
                          <div className="text-[11px] text-[#777] line-through">
                            {formattedOriginal}
                          </div>
                        )}
                      </div>

                      <span className="text-[10px] text-[#999] uppercase tracking-wider">
                        Direct Download
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        onClick={() => onSelectProduct(product)}
                        className="py-2.5 px-3 rounded border border-[#D4AF37]/30 hover:border-[#D4AF37] text-white hover:text-[#F5D76E] text-xs font-medium uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Details</span>
                      </button>

                      <button
                        onClick={() => onAddToCart(product)}
                        className="py-2.5 px-3 rounded bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#C9A227] text-black text-xs font-bold uppercase tracking-wider hover:brightness-110 shadow-[0_0_15px_rgba(212,175,55,0.25)] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add To Bag</span>
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
