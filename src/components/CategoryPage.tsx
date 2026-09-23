import React, { useState, useMemo } from 'react';
import { Product, PrimaryCategory, Currency } from '../types';
import { PRIMARY_CATEGORIES, formatPrice } from '../data/products';
import { Search, ArrowLeft, ShoppingBag, BookOpen, Cpu, TrendingUp, Mic, SlidersHorizontal } from 'lucide-react';

interface CategoryPageProps {
  category: PrimaryCategory;
  products: Product[];
  currency: Currency;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onBackToHome: () => void;
  onSelectOtherCategory: (cat: PrimaryCategory) => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({
  category,
  products,
  currency,
  onSelectProduct,
  onAddToCart,
  onBackToHome,
  onSelectOtherCategory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'title'>('featured');

  const categoryInfo = PRIMARY_CATEGORIES.find((c) => c.id === category) || PRIMARY_CATEGORIES[0];

  const categoryProducts = useMemo(() => {
    return products.filter((p) => p.category === category && p.isPublished !== false);
  }, [products, category]);

  const filteredProducts = useMemo(() => {
    let result = categoryProducts.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.fullDescription.toLowerCase().includes(q)
      );
    });

    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'title') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      // featured
      result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return result;
  }, [categoryProducts, searchQuery, sortBy]);

  // Distinct domain visual themes
  const renderThemeBanner = () => {
    if (category === 'ai') {
      return (
        <div className="relative overflow-hidden py-16 sm:py-24 border-b border-[#D4AF37]/20 bg-[#050505]">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08),transparent_70%)] pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#A8A8A8] hover:text-[#F5D76E] transition-colors mb-6 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Overview</span>
            </button>

            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#D4AF37] uppercase mb-3">
              <Cpu className="w-4 h-4 text-[#F5D76E]" />
              <span>CORE DISCIPLINE 01 · ARTIFICIAL INTELLIGENCE</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-white tracking-tight">
              AI Publications
            </h1>

            <p className="mt-4 text-base sm:text-lg text-[#F5D76E] font-medium tracking-wide">
              “Build with AI. Create more. Earn smarter.”
            </p>

            <p className="mt-3 text-sm text-[#A8A8A8] font-light max-w-2xl leading-relaxed">
              Systematic frameworks and actionable blueprints for integrating generative models, autonomous workflows, and modern software architectures into high-margin freelance and digital product operations.
            </p>
          </div>
        </div>
      );
    }

    if (category === 'finance') {
      return (
        <div className="relative overflow-hidden py-16 sm:py-24 border-b border-[#D4AF37]/20 bg-[#050505]">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[radial-gradient(circle_at_center,rgba(229,192,123,0.08),transparent_70%)] pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#A8A8A8] hover:text-[#F5D76E] transition-colors mb-6 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Overview</span>
            </button>

            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#E5C07B] uppercase mb-3">
              <TrendingUp className="w-4 h-4 text-[#E5C07B]" />
              <span>CORE DISCIPLINE 02 · PERSONAL CAPITAL & FINANCE</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-white tracking-tight">
              Finance Publications
            </h1>

            <p className="mt-4 text-base sm:text-lg text-[#F5D76E] font-medium tracking-wide">
              “Understand money. Build better financial habits.”
            </p>

            <p className="mt-3 text-sm text-[#A8A8A8] font-light max-w-2xl leading-relaxed">
              Structured methodologies for personal capital management, transparent budgeting, disciplined investing, and secondary income generation grounded in realistic financial principles.
            </p>
          </div>
        </div>
      );
    }

    // Communication
    return (
      <div className="relative overflow-hidden py-16 sm:py-24 border-b border-[#D4AF37]/20 bg-[#050505]">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[radial-gradient(circle_at_center,rgba(201,162,39,0.08),transparent_70%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#A8A8A8] hover:text-[#F5D76E] transition-colors mb-6 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Overview</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#C9A227] uppercase mb-3">
            <Mic className="w-4 h-4 text-[#C9A227]" />
            <span>CORE DISCIPLINE 03 · RHETORIC & SPEECH</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-white tracking-tight">
            Communication Publications
          </h1>

          <p className="mt-4 text-base sm:text-lg text-[#F5D76E] font-medium tracking-wide">
            “Speak clearly. Communicate confidently.”
          </p>

          <p className="mt-3 text-sm text-[#A8A8A8] font-light max-w-2xl leading-relaxed">
            Practical handbooks on overcoming speaking anxiety, finding authentic vocal authority, de-escalating interpersonal friction, and commanding presence in high-stakes moments.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Category Domain Banner */}
      {renderThemeBanner()}

      {/* Main Catalog Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        
        {/* Search & Sort Bar */}
        <div className="p-4 rounded-xl bg-[#080808] border border-[#D4AF37]/20 mb-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-[#A8A8A8] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${categoryInfo.name} publications...`}
              className="w-full bg-[#050505] border border-[#D4AF37]/25 rounded-lg pl-10 pr-4 py-2 text-xs text-white placeholder-[#666] focus:outline-none focus:border-[#F5D76E]"
            />
          </div>

          {/* Sort & Count */}
          <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto text-xs text-[#A8A8A8]">
            <span>
              Showing <strong className="text-white">{filteredProducts.length}</strong> of {categoryProducts.length}
            </span>

            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#D4AF37]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#050505] border border-[#D4AF37]/25 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#F5D76E]"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="title">Title: A to Z</option>
              </select>
            </div>
          </div>

        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="p-16 text-center bg-[#080808] border border-[#D4AF37]/20 rounded-xl">
            <p className="font-serif text-lg text-white">No publications matched your search.</p>
            <p className="text-xs text-[#A8A8A8] mt-1">Try clearing or changing your search terms.</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 px-4 py-2 rounded bg-[#D4AF37]/15 border border-[#D4AF37]/35 text-xs text-[#F5D76E] hover:bg-[#D4AF37]/25 transition-colors cursor-pointer"
            >
              Reset Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => {
              const formattedPrice = formatPrice(product.price, currency);
              const formattedOriginal = product.originalPrice
                ? formatPrice(product.originalPrice, currency)
                : null;

              return (
                <div
                  key={product.id}
                  className="group relative rounded-xl bg-[#080808] border border-[#D4AF37]/25 hover:border-[#D4AF37] flex flex-col justify-between overflow-hidden transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
                >
                  {/* Cover Header */}
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
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-black/30" />

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

                  {/* Body Content */}
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

                    {/* Price and Actions */}
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
                          Instant Access
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
        )}

        {/* Switch to Other Primary Categories */}
        <div className="mt-20 pt-12 border-t border-[#D4AF37]/15">
          <div className="text-center mb-8">
            <span className="text-xs uppercase tracking-[0.2em] text-[#A8A8A8] block">
              Explore Other Disciplines
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {PRIMARY_CATEGORIES.filter((c) => c.id !== category).map((other) => (
              <button
                key={other.id}
                onClick={() => onSelectOtherCategory(other.id)}
                className="p-5 rounded-xl bg-[#080808] border border-[#D4AF37]/25 hover:border-[#D4AF37] text-left transition-all hover:bg-[#0D0D0D] cursor-pointer group"
              >
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] block mb-1">
                  DISCIPLINE · {other.name}
                </span>
                <span className="font-serif text-lg text-white group-hover:text-[#F5D76E] transition-colors block">
                  {other.tagline}
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
