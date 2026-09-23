import React from 'react';
import { NovoraLogo } from './NovoraLogo';
import { ArrowRight, BookOpen, ShieldCheck, Sparkles, Star, DownloadCloud } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
  onSampleClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onSampleClick }) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-[#D4AF37]/15">
      {/* Subtle ambient radial gold glow behind hero */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[500px] bg-gradient-to-b from-[#D4AF37]/10 via-[#D4AF37]/3 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Very faint background geometric lines */}
      <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.04] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          
          {/* Centered Large Luxury Brand Emblem */}
          <div className="mb-6 flex flex-col items-center">
            <NovoraLogo variant="emblem-only" size="xl" />
            <div className="mt-3 flex items-center gap-2">
              <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#D4AF37]/60" />
              <span className="text-[11px] font-semibold tracking-[0.3em] uppercase text-[#D4AF37]">
                NOVORA DIGITAL
              </span>
              <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[#D4AF37]/60" />
            </div>
          </div>

          {/* Luxury Executive Edition Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#D4AF37]/35 bg-[#0D0D0D]/80 backdrop-blur-md mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F5D76E] animate-pulse" />
            <span className="text-[11px] font-medium tracking-[0.2em] text-[#D4AF37] uppercase">
              The 2026 Executive Digital Compendium
            </span>
          </div>

          {/* Main Headline in Majestic Serif */}
          <h1 className="max-w-4xl font-serif text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-white leading-[1.12]">
            Knowledge Engineered For Those Who{' '}
            <span className="font-normal italic text-gold-gradient">
              Refuse Mediocrity.
            </span>
          </h1>

          {/* Refined Brand Subtitle & Tagline Anchor */}
          <p className="max-w-2xl mt-6 text-base sm:text-lg text-[#A8A8A8] font-light leading-relaxed">
            Curated blueprints, artificial intelligence masteries, and elite communication frameworks
            designed to compound your sovereign leverage.
          </p>

          <div className="mt-3 flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#D4AF37]/90 font-medium">
            <span>Become Better Than Yesterday.</span>
          </div>

          {/* High-Converting Action Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button
              id="btn-hero-explore"
              onClick={onExploreClick}
              className="w-full sm:w-auto px-8 py-4 rounded bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#C9A227] text-[#050505] font-semibold text-xs uppercase tracking-[0.2em] hover:brightness-110 transition-all duration-300 shadow-[0_0_30px_rgba(212,175,55,0.3)] flex items-center justify-center gap-3 group cursor-pointer"
            >
              <span>Explore The Collection</span>
              <ArrowRight className="w-4 h-4 text-[#050505] group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              id="btn-hero-sample"
              onClick={onSampleClick}
              className="w-full sm:w-auto px-7 py-4 rounded border border-[#D4AF37]/35 bg-[#080808] hover:bg-[#0D0D0D] hover:border-[#F5D76E] text-[#F5F5F5] font-medium text-xs uppercase tracking-[0.18em] transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-[#D4AF37]" />
              <span>Browse Categories</span>
            </button>
          </div>

          {/* Genuine Core Disciplines Bar */}
          <div className="mt-16 w-full max-w-4xl pt-8 border-t border-[#D4AF37]/15 grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded bg-[#0D0D0D] border border-[#D4AF37]/20 text-[#D4AF37]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="text-base font-semibold text-white tracking-tight">3 Disciplines</div>
                <div className="text-xs text-[#A8A8A8] tracking-wider uppercase font-medium">
                  AI · Finance · Speech
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded bg-[#0D0D0D] border border-[#D4AF37]/20 text-[#D4AF37]">
                <DownloadCloud className="w-4 h-4" />
              </div>
              <div>
                <div className="text-base font-semibold text-white tracking-tight">Direct Access</div>
                <div className="text-xs text-[#A8A8A8] tracking-wider uppercase font-medium">
                  Instant DRM-Free Files
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded bg-[#0D0D0D] border border-[#D4AF37]/20 text-[#D4AF37]">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <div className="text-base font-semibold text-white tracking-tight">Practical Depth</div>
                <div className="text-xs text-[#A8A8A8] tracking-wider uppercase font-medium">
                  Real Implementation
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded bg-[#0D0D0D] border border-[#D4AF37]/20 text-[#D4AF37]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-base font-semibold text-white tracking-tight">Open Formats</div>
                <div className="text-xs text-[#A8A8A8] tracking-wider uppercase font-medium">
                  PDF, EPUB & Templates
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
