import React, { useState } from 'react';
import { Mail, CheckCircle2, DownloadCloud, Sparkles, ArrowRight } from 'lucide-react';
import { NovoraLogo } from './NovoraLogo';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
    }
  };

  return (
    <section id="newsletter-section" className="py-20 lg:py-24 bg-[#050505] border-b border-[#D4AF37]/15 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="rounded-2xl border border-[#D4AF37]/35 bg-[#080808] p-8 sm:p-14 text-center relative overflow-hidden shadow-[0_15px_50px_rgba(0,0,0,0.8)]">
          
          {/* Subtle gold emblem watermark */}
          <div className="flex justify-center mb-6">
            <NovoraLogo variant="emblem-only" size="md" />
          </div>

          <div className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.25em] text-[#D4AF37] uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#F5D76E]" />
            <span>THE SUNDAY DISPATCH</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl text-white font-light tracking-tight">
            The Sovereign Weekly Dispatch
          </h2>

          <p className="mt-3 text-sm text-[#A8A8A8] font-light max-w-xl mx-auto leading-relaxed">
            Join 32,000+ thinkers receiving our concise Sunday memo on frontier AI architectures,
            cognitive leverage, and persuasive rhetoric. No promotions, zero noise.
          </p>

          {!isSubscribed ? (
            <form onSubmit={handleSubmit} className="mt-8 max-w-md mx-auto flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Mail className="w-4 h-4 text-[#A8A8A8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your confidential email..."
                  className="w-full bg-[#050505] border border-[#D4AF37]/30 rounded px-10 py-3.5 text-xs text-white placeholder-[#666] focus:outline-none focus:border-[#F5D76E] transition-colors"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3.5 rounded bg-gradient-to-r from-[#F5D76E] to-[#D4AF37] text-[#050505] font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-[0_0_20px_rgba(212,175,55,0.25)] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Subscribe</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="mt-8 p-6 rounded-lg bg-[#050505] border border-[#D4AF37]/40 max-w-md mx-auto animate-in fade-in zoom-in-95 duration-300">
              <CheckCircle2 className="w-8 h-8 text-[#F5D76E] mx-auto mb-2" />
              <div className="text-sm font-semibold text-white">
                Welcome to The Dispatch
              </div>
              <p className="text-xs text-[#A8A8A8] mt-1 mb-4 font-light">
                Your complimentary blueprint has been unlocked for instant download:
              </p>
              <a
                href="#download-free-compendium"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Thank you for subscribing to NOVORA. Your gift "The 2026 AI Architecture Cheat Sheet" (PDF) download has initiated.');
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded border border-[#D4AF37]/50 text-[#F5D76E] text-xs font-semibold hover:bg-[#D4AF37]/10 transition-colors"
              >
                <DownloadCloud className="w-4 h-4" />
                <span>Download Bonus Guide (PDF)</span>
              </a>
            </div>
          )}

          <div className="mt-6 flex items-center justify-center gap-4 text-[11px] text-[#A8A8A8] font-light">
            <span>• One-click unsubscribe anytime</span>
            <span>• Never rented or shared</span>
            <span>• Delivered every Sunday at 08:00 EST</span>
          </div>

        </div>

      </div>
    </section>
  );
};
