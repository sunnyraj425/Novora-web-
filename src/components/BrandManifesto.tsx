import React from 'react';
import { NovoraLogo } from './NovoraLogo';
import { BrainCircuit, Shield, TrendingUp } from 'lucide-react';

export const BrandManifesto: React.FC = () => {
  const pillars = [
    {
      icon: BrainCircuit,
      num: '01',
      title: 'Asymmetric Intellect',
      desc: 'In an era of cognitive automation, passive knowledge is obsolete. We engineer sovereign workflows and mental models that leverage machine intelligence to amplify human discernment by orders of magnitude.',
    },
    {
      icon: Shield,
      num: '02',
      title: 'Unshakable Gravitas',
      desc: 'True power in closed-door rooms is never loud or hurried. Our communication blueprints deconstruct the vocal mechanics, strategic pauses, and structural clarity required to lead high-stakes negotiations.',
    },
    {
      icon: TrendingUp,
      num: '03',
      title: 'Compounding Mastery',
      desc: 'The defining metric of an extraordinary mind is continuous, compounding refinement. We reject ephemeral hacks in favor of rigorous, repeatable systems. Become better than yesterday.',
    },
  ];

  return (
    <section id="manifesto-section" className="py-20 lg:py-28 bg-[#080808] border-b border-[#D4AF37]/15 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Brand Emblem & Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex justify-center mb-6">
            <NovoraLogo variant="emblem-only" size="lg" />
          </div>

          <span className="text-[11px] font-semibold tracking-[0.3em] uppercase text-[#D4AF37] block mb-3">
            THE NOVORA DOCTRINE
          </span>

          <h2 className="font-serif text-3xl sm:text-5xl font-light text-white leading-tight tracking-tight">
            “Become Better Than Yesterday.”
          </h2>

          <p className="mt-4 text-sm sm:text-base text-[#A8A8A8] font-light leading-relaxed">
            NOVORA was founded on an uncompromising premise: that intellectual autonomy and sovereign leverage
            belong to those who systematically audit and elevate their cognitive tools.
          </p>
        </div>

        {/* The Three Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.num}
                className="p-8 rounded-xl bg-[#050505] border border-[#D4AF37]/25 hover:border-[#D4AF37]/50 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3 rounded-lg bg-[#0D0D0D] border border-[#D4AF37]/30 text-[#D4AF37] group-hover:text-[#F5D76E] transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-xs text-[#D4AF37]/60 tracking-widest">
                      {pillar.num}
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl font-light text-white mb-3 group-hover:text-[#F5D76E] transition-colors">
                    {pillar.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#A8A8A8] font-light leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#D4AF37]/15">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-[#D4AF37]/80 font-medium">
                    Engineered Standard
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Editorial Pullquote */}
        <div className="mt-16 p-8 sm:p-12 rounded-2xl border border-[#D4AF37]/30 bg-gradient-to-b from-[#0D0D0D] to-[#050505] text-center max-w-4xl mx-auto">
          <blockquote className="font-serif text-xl sm:text-2xl text-[#E0E0E0] italic font-light leading-relaxed">
            “The illiterate of the twenty-first century will not be those who cannot read and write,
            but those who cannot orchestrate intelligence, communicate with precision, and outpace their past selves.”
          </blockquote>
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="h-[1px] w-6 bg-[#D4AF37]/50" />
            <span className="text-[11px] font-semibold tracking-[0.25em] text-[#D4AF37] uppercase">
              The Editorial Desk of NOVORA
            </span>
            <span className="h-[1px] w-6 bg-[#D4AF37]/50" />
          </div>
        </div>

      </div>
    </section>
  );
};
