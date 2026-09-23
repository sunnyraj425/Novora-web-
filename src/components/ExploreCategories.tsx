import React from 'react';
import { PrimaryCategory, Product } from '../types';
import { ArrowUpRight, Cpu, TrendingUp, Mic } from 'lucide-react';

interface ExploreCategoriesProps {
  onSelectCategory: (category: PrimaryCategory) => void;
  products: Product[];
}

export const ExploreCategories: React.FC<ExploreCategoriesProps> = ({
  onSelectCategory,
  products,
}) => {
  const getProductCount = (category: PrimaryCategory) => {
    return products.filter((p) => p.category === category && p.isPublished !== false).length;
  };

  return (
    <section id="explore-novora" className="py-20 lg:py-28 border-b border-[#D4AF37]/15 bg-[#050505]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-6 h-[1px] bg-[#D4AF37]/50" />
            <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#D4AF37]">
              Core Disciplines
            </span>
            <span className="w-6 h-[1px] bg-[#D4AF37]/50" />
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-white">
            Explore NOVORA
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#A8A8A8] font-light">
            Practical knowledge for the digital age.
          </p>
        </div>

        {/* The 3 Primary Category Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* CATEGORY 1: AI */}
          <div
            onClick={() => onSelectCategory('ai')}
            className="group relative rounded-xl bg-[#080808] border border-[#D4AF37]/25 hover:border-[#D4AF37] p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_15px_40px_rgba(212,175,55,0.12)] cursor-pointer overflow-hidden"
          >
            {/* Subtle Futuristic Background Hairlines */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-[radial-gradient(ellipse_at_top_right,rgba(212,175,55,0.12),transparent_70%)] pointer-events-none" />
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />

            <div>
              {/* Category Micro-kicker */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase">
                  <Cpu className="w-3.5 h-3.5 text-[#F5D76E]" />
                  <span>DISCIPLINE 01 · AI</span>
                </div>
                <span className="text-xs text-[#777] font-mono">
                  {getProductCount('ai')} Publications
                </span>
              </div>

              {/* Title & Tagline */}
              <h3 className="font-serif text-3xl text-white font-light group-hover:text-[#F5D76E] transition-colors">
                AI
              </h3>

              <p className="mt-3 text-sm text-[#F5D76E] font-medium tracking-wide">
                “Build with AI. Create more. Earn smarter.”
              </p>

              <p className="mt-4 text-xs text-[#A8A8A8] font-light leading-relaxed">
                Systematic blueprints and prompting architectures for leveraging generative intelligence into viable digital products, automated services, and freelance operations.
              </p>

              {/* Futuristic Accent Matrix */}
              <div className="mt-6 pt-6 border-t border-white/5 space-y-2 text-[11px] text-[#A8A8A8]">
                <div className="flex items-center justify-between">
                  <span>Generative Workflows</span>
                  <span className="text-white/70">Prompt Engineering</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Autonomous Tools</span>
                  <span className="text-white/70">Freelance Systems</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 flex items-center justify-between text-xs font-semibold tracking-wider text-[#D4AF37] uppercase group-hover:text-white transition-colors">
              <span>Enter AI Catalog</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
          </div>

          {/* CATEGORY 2: FINANCE */}
          <div
            onClick={() => onSelectCategory('finance')}
            className="group relative rounded-xl bg-[#080808] border border-[#D4AF37]/25 hover:border-[#D4AF37] p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_15px_40px_rgba(212,175,55,0.12)] cursor-pointer overflow-hidden"
          >
            {/* Sophisticated Ledger Background Accent */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-[radial-gradient(ellipse_at_top_right,rgba(245,215,110,0.1),transparent_70%)] pointer-events-none" />
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#E5C07B]/40 to-transparent" />

            <div>
              {/* Category Micro-kicker */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-[#E5C07B] uppercase">
                  <TrendingUp className="w-3.5 h-3.5 text-[#E5C07B]" />
                  <span>DISCIPLINE 02 · FINANCE</span>
                </div>
                <span className="text-xs text-[#777] font-mono">
                  {getProductCount('finance')} Publications
                </span>
              </div>

              {/* Title & Tagline */}
              <h3 className="font-serif text-3xl text-white font-light group-hover:text-[#F5D76E] transition-colors">
                FINANCE
              </h3>

              <p className="mt-3 text-sm text-[#F5D76E] font-medium tracking-wide">
                “Understand money. Build better financial habits.”
              </p>

              <p className="mt-4 text-xs text-[#A8A8A8] font-light leading-relaxed">
                Empirical personal finance methods, paycheck allocation frameworks, disciplined investing principles, and sustainable secondary revenue streams without speculation.
              </p>

              {/* Financial Ledger Accents */}
              <div className="mt-6 pt-6 border-t border-white/5 space-y-2 text-[11px] text-[#A8A8A8]">
                <div className="flex items-center justify-between">
                  <span>Salary Allocation</span>
                  <span className="text-white/70">Index Investing</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Reserve Funds</span>
                  <span className="text-white/70">Multiple Incomes</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 flex items-center justify-between text-xs font-semibold tracking-wider text-[#D4AF37] uppercase group-hover:text-white transition-colors">
              <span>Enter Finance Catalog</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
          </div>

          {/* CATEGORY 3: COMMUNICATION */}
          <div
            onClick={() => onSelectCategory('communication')}
            className="group relative rounded-xl bg-[#080808] border border-[#D4AF37]/25 hover:border-[#D4AF37] p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_15px_40px_rgba(212,175,55,0.12)] cursor-pointer overflow-hidden"
          >
            {/* Elegant Serif Background Accent */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-[radial-gradient(ellipse_at_top_right,rgba(201,162,39,0.1),transparent_70%)] pointer-events-none" />
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#C9A227]/40 to-transparent" />

            <div>
              {/* Category Micro-kicker */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-[#C9A227] uppercase">
                  <Mic className="w-3.5 h-3.5 text-[#C9A227]" />
                  <span>DISCIPLINE 03 · SPEECH</span>
                </div>
                <span className="text-xs text-[#777] font-mono">
                  {getProductCount('communication')} Publications
                </span>
              </div>

              {/* Title & Tagline */}
              <h3 className="font-serif text-3xl text-white font-light group-hover:text-[#F5D76E] transition-colors">
                COMMUNICATION
              </h3>

              <p className="mt-3 text-sm text-[#F5D76E] font-medium tracking-wide">
                “Speak clearly. Communicate confidently.”
              </p>

              <p className="mt-4 text-xs text-[#A8A8A8] font-light leading-relaxed">
                Practical speech confidence guides, interpersonal conflict de-escalation, written clarity, and executive persuasion frameworks for high-consequence moments.
              </p>

              {/* Communication Cadence Accents */}
              <div className="mt-6 pt-6 border-t border-white/5 space-y-2 text-[11px] text-[#A8A8A8]">
                <div className="flex items-center justify-between">
                  <span>Speaking Anxiety Relief</span>
                  <span className="text-white/70">Vocal Resonance</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Conflict Resolution</span>
                  <span className="text-white/70">Executive Presence</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 flex items-center justify-between text-xs font-semibold tracking-wider text-[#D4AF37] uppercase group-hover:text-white transition-colors">
              <span>Enter Communication Catalog</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
