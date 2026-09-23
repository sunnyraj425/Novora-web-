import React, { useState } from 'react';
import { Product, Currency, PrimaryCategory } from '../types';
import { formatPrice } from '../data/products';
import { 
  ArrowLeft, 
  ShoppingBag, 
  Check, 
  BookOpen, 
  FileText, 
  Layers, 
  UserCheck, 
  Lock, 
  Share2, 
  DownloadCloud,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Edit3
} from 'lucide-react';

interface ProductDetailPageProps {
  product: Product;
  currency: Currency;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  onBack: () => void;
  onSelectCategory: (cat: PrimaryCategory) => void;
  allProducts: Product[];
  onSelectProduct: (p: Product) => void;
  onOpenAdminEdit?: (p: Product) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  currency,
  onAddToCart,
  onBuyNow,
  onBack,
  onSelectCategory,
  allProducts,
  onSelectProduct,
  onOpenAdminEdit,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [expandedChapter, setExpandedChapter] = useState<number | null>(0);

  const formattedPrice = formatPrice(product.price, currency);
  const formattedOriginal = product.originalPrice
    ? formatPrice(product.originalPrice, currency)
    : null;

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id && p.isPublished !== false)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#050505] text-[#A8A8A8] pb-24">
      
      {/* Top Breadcrumb Bar */}
      <div className="border-b border-[#D4AF37]/20 bg-[#080808]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          
          <div className="flex items-center gap-2 text-[#A8A8A8]">
            <button
              onClick={onBack}
              className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <span>/</span>
            <button
              onClick={() => onSelectCategory(product.category)}
              className="text-[#D4AF37] hover:underline font-mono uppercase cursor-pointer"
            >
              {product.category}
            </button>
            <span>/</span>
            <span className="text-white truncate max-w-xs">{product.title}</span>
          </div>

          <div className="flex items-center gap-3">
            {onOpenAdminEdit && (
              <button
                onClick={() => onOpenAdminEdit(product)}
                className="px-2.5 py-1 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[11px] text-[#F5D76E] hover:bg-[#D4AF37]/20 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit in Admin</span>
              </button>
            )}

            <button
              onClick={handleShare}
              className="p-1.5 rounded border border-white/10 hover:border-[#D4AF37]/50 text-[#A8A8A8] hover:text-white transition-colors cursor-pointer"
              title="Copy share link"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Main Hero Showcase */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          
          {/* Left Column: Cover Image Display */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative rounded-2xl overflow-hidden border border-[#D4AF37]/35 bg-[#080808] shadow-[0_20px_60px_rgba(0,0,0,0.9)] aspect-[4/5] flex items-center justify-center">
              <img
                src={product.coverImage}
                alt={product.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              {product.discount && (
                <div className="absolute top-4 right-4 bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-wider px-3 py-1 rounded">
                  {product.discount}% OFF
                </div>
              )}

              {product.badge && (
                <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md border border-[#D4AF37]/50 text-[#F5D76E] font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 rounded">
                  {product.badge}
                </div>
              )}
            </div>

            {/* Format & Specification Card */}
            <div className="p-4 rounded-xl bg-[#080808] border border-[#D4AF37]/20 space-y-2 text-xs">
              <div className="flex items-center justify-between text-[#A8A8A8]">
                <span>Format:</span>
                <span className="text-white font-medium">{product.productFormat}</span>
              </div>
              <div className="flex items-center justify-between text-[#A8A8A8]">
                <span>Category:</span>
                <span className="text-[#F5D76E] font-mono uppercase">{product.category}</span>
              </div>
              <div className="flex items-center justify-between text-[#A8A8A8]">
                <span>Access Protocol:</span>
                <span className="text-white">Instant DRM-Free Download</span>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Pricing & Primary Buy Box */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              {/* Category Subtitle Kicker */}
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="w-4 h-[1px] bg-[#D4AF37]" />
                <span className="text-xs font-mono tracking-widest uppercase text-[#D4AF37]">
                  DISCIPLINE · {product.category.toUpperCase()}
                </span>
              </div>

              {/* Title */}
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-white tracking-tight leading-[1.15]">
                {product.title}
              </h1>

              {/* Short Description */}
              <p className="mt-4 text-base text-[#D4D4D4] font-light leading-relaxed">
                {product.shortDescription}
              </p>

              {/* Pricing Box */}
              <div className="mt-8 p-6 rounded-xl bg-[#080808] border border-[#D4AF37]/30 space-y-6">
                <div className="flex items-baseline justify-between border-b border-white/5 pb-4">
                  <div>
                    <span className="text-[11px] text-[#A8A8A8] uppercase tracking-wider block mb-1">
                      One-Time Acquisition Price
                    </span>
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl sm:text-4xl font-light text-white tracking-tight">
                        {formattedPrice}
                      </span>
                      {formattedOriginal && (
                        <span className="text-sm text-[#777] line-through">
                          {formattedOriginal}
                        </span>
                      )}
                    </div>
                  </div>

                  {product.discount && (
                    <span className="text-xs font-bold text-[#F5D76E] bg-[#D4AF37]/15 border border-[#D4AF37]/35 px-2.5 py-1 rounded uppercase tracking-wider">
                      Save {product.discount}%
                    </span>
                  )}
                </div>

                {/* Conversion Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <button
                    onClick={() => onBuyNow(product)}
                    className="py-4 px-6 rounded bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#C9A227] text-black font-bold text-xs uppercase tracking-[0.2em] hover:brightness-110 shadow-[0_0_25px_rgba(212,175,55,0.3)] transition-all flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Buy Now</span>
                  </button>

                  <button
                    onClick={() => onAddToCart(product)}
                    className="py-4 px-6 rounded border border-[#D4AF37]/35 bg-[#0D0D0D] hover:bg-[#D4AF37]/15 hover:border-[#D4AF37] text-white text-xs font-semibold uppercase tracking-[0.18em] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                    <span>Add To Bag</span>
                  </button>
                </div>

                <div className="flex items-center justify-center gap-4 text-[11px] text-[#888] pt-1">
                  <span>Direct Encrypted Download</span>
                  <span>•</span>
                  <span>Universal Compatibility</span>
                  <span>•</span>
                  <span>UPI / Cards / NetBanking</span>
                </div>
              </div>

              {/* Full Description Section */}
              <div className="mt-8 space-y-4">
                <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
                  Publication Overview
                </h2>
                <p className="text-sm text-[#A8A8A8] font-light leading-relaxed whitespace-pre-line">
                  {product.fullDescription}
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* Detailed Sections: What's Included, What You'll Learn, Who It's For */}
        <div className="mt-16 pt-12 border-t border-[#D4AF37]/15 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* What's Included */}
          <div className="p-6 rounded-xl bg-[#080808] border border-[#D4AF37]/20 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#F5D76E]">
              <FileText className="w-4 h-4 text-[#D4AF37]" />
              <span>What's Included</span>
            </div>
            <ul className="space-y-2.5 text-xs text-[#A8A8A8] font-light">
              {product.whatsIncluded && product.whatsIncluded.length > 0 ? (
                product.whatsIncluded.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <Check className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))
              ) : (
                <li className="text-[#666]">Standard digital deliverables included.</li>
              )}
            </ul>
          </div>

          {/* What You'll Learn */}
          <div className="p-6 rounded-xl bg-[#080808] border border-[#D4AF37]/20 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#F5D76E]">
              <Layers className="w-4 h-4 text-[#D4AF37]" />
              <span>What You'll Learn</span>
            </div>
            <ul className="space-y-2.5 text-xs text-[#A8A8A8] font-light">
              {product.whatYoullLearn && product.whatYoullLearn.length > 0 ? (
                product.whatYoullLearn.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <Check className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))
              ) : (
                <li className="text-[#666]">Practical implementation methods and frameworks.</li>
              )}
            </ul>
          </div>

          {/* Who It's For */}
          <div className="p-6 rounded-xl bg-[#080808] border border-[#D4AF37]/20 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#F5D76E]">
              <UserCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>Who It's For</span>
            </div>
            <ul className="space-y-2.5 text-xs text-[#A8A8A8] font-light">
              {product.whoItsFor && product.whoItsFor.length > 0 ? (
                product.whoItsFor.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shrink-0 mt-1.5" />
                    <span>{item}</span>
                  </li>
                ))
              ) : (
                <li className="text-[#666]">Designed for motivated digital professionals.</li>
              )}
            </ul>
          </div>

        </div>

        {/* Chapters Curriculum Breakdown */}
        {product.chapters && product.chapters.length > 0 && (
          <div className="mt-16 pt-12 border-t border-[#D4AF37]/15">
            <div className="max-w-3xl">
              <span className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] block mb-2">
                Structured Syllabus
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-light text-white">
                Chapters & Core Modules
              </h2>
              <p className="mt-2 text-xs text-[#A8A8A8]">
                A logical, step-by-step reading and implementation path.
              </p>
            </div>

            <div className="mt-8 space-y-3 max-w-4xl">
              {product.chapters.map((chapter, idx) => {
                const isOpen = expandedChapter === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-lg bg-[#080808] border border-[#D4AF37]/20 overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedChapter(isOpen ? null : idx)}
                      className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-[#D4AF37]">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <span className="text-sm font-serif text-white">{chapter.title}</span>
                      </div>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-[#A8A8A8]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#A8A8A8]" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 text-xs text-[#A8A8A8] border-t border-white/5">
                        {chapter.description}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Related Products from the Same Category */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-16 border-t border-[#D4AF37]/15">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] block mb-1">
                  Complementary Reading
                </span>
                <h3 className="font-serif text-2xl font-light text-white">
                  More in {product.category.toUpperCase()}
                </h3>
              </div>

              <button
                onClick={() => onSelectCategory(product.category)}
                className="text-xs uppercase tracking-wider text-[#D4AF37] hover:underline cursor-pointer"
              >
                View Full Category
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onSelectProduct(rel)}
                  className="p-5 rounded-xl bg-[#080808] border border-[#D4AF37]/20 hover:border-[#D4AF37] transition-all cursor-pointer group"
                >
                  <img
                    src={rel.coverImage}
                    alt={rel.title}
                    referrerPolicy="no-referrer"
                    className="w-full aspect-[16/9] object-cover rounded mb-4"
                  />
                  <div className="text-[10px] font-mono uppercase text-[#A8A8A8] mb-1">
                    {rel.productFormat}
                  </div>
                  <h4 className="font-serif text-base text-white group-hover:text-[#F5D76E] transition-colors leading-snug">
                    {rel.title}
                  </h4>
                  <div className="mt-3 text-sm font-light text-[#F5D76E]">
                    {formatPrice(rel.price, currency)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
