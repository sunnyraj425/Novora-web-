import React, { useState, useMemo } from 'react';
import { Product, Currency, CategoryFilter, PrimaryCategory } from '../types';
import { PRIMARY_CATEGORIES, formatPrice } from '../data/products';
import { Search, ShoppingBag, BookOpen, SlidersHorizontal, ArrowLeft } from 'lucide-react';

interface AllProductsPageProps {
  products: Product[];
  currency: Currency;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onBackToHome: () => void;
  initialCategoryFilter?: CategoryFilter;
}

export const AllProductsPage: React.FC<AllProductsPageProps> = ({
  products,
  currency,
  onSelectProduct,
  onAddToCart,
  onBackToHome,
  initialCategoryFilter = 'all',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>(initialCategoryFilter);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'title'>('featured');

  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => p.isPublished !== false);

    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    const q = searchQuery.toLowerCase().trim();
    if (q) {
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.fullDescription.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'title') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return result;
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-[#050505] text-[#A8A8A8] pb-24">
      
      {/* Header Banner */}
      <div className="border-b border-[#D4AF37]/20 bg-[#080808] py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#A8A8A8] hover:text-[#F5D76E] transition-colors mb-6 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </button>

          <span className="text-xs font-mono tracking-widest text-[#D4AF37] uppercase block mb-2">
            THE COMPLETE COLLECTION
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-light text-white tracking-tight">
            All Publications & Resources
          </h1>
          <p className="mt-3 text-sm text-[#A8A8A8] font-light max-w-2xl leading-relaxed">
            Browse our complete catalog across the three primary disciplines: Artificial Intelligence, Personal Finance, and High-Stakes Communication.
          </p>
        </div>
      </div>

      {/* Main Filter & Listing Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        
        {/* Filter Bar */}
        <div className="p-4 rounded-xl bg-[#080808] border border-[#D4AF37]/20 mb-10 flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* Category Tabs (ONLY AI, FINANCE, COMMUNICATION, and ALL) */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded text-xs font-medium uppercase tracking-wider transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#D4AF37] text-black font-bold'
                  : 'border border-white/10 hover:border-[#D4AF37]/40 text-[#A8A8A8] hover:text-white'
              }`}
            >
              All Products ({products.filter((p) => p.isPublished !== false).length})
            </button>

            {PRIMARY_CATEGORIES.map((cat) => {
              const count = products.filter((p) => p.category === cat.id && p.isPublished !== false).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded text-xs font-medium uppercase tracking-wider transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-[#D4AF37] text-black font-bold'
                      : 'border border-white/10 hover:border-[#D4AF37]/40 text-[#A8A8A8] hover:text-white'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>

          {/* Search and Sort */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-[#A8A8A8] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search all publications..."
                className="w-full bg-[#050505] border border-[#D4AF37]/25 rounded pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#666] focus:outline-none focus:border-[#F5D76E]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#050505] border border-[#D4AF37]/25 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#F5D76E] w-full sm:w-auto"
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
            <p className="text-xs text-[#A8A8A8] mt-1">Try broadening your search terms or clearing filters.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-4 px-4 py-2 rounded bg-[#D4AF37]/15 border border-[#D4AF37]/35 text-xs text-[#F5D76E] hover:bg-[#D4AF37]/25 transition-colors cursor-pointer"
            >
              Reset Filters
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

      </div>
    </div>
  );
};
