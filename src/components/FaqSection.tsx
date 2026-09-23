import React, { useState } from 'react';
import { FAQS } from '../data/products';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq-section" className="py-20 lg:py-28 bg-[#080808] border-b border-[#D4AF37]/15">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D4AF37]/30 bg-[#050505] mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-[#F5D76E]" />
            <span className="text-[10px] font-semibold tracking-[0.25em] text-[#D4AF37] uppercase">
              Clarity & Protocols
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-light text-white tracking-tight">
            Frequently Inquired
          </h2>
          <p className="mt-3 text-sm text-[#A8A8A8] font-light">
            Standards regarding delivery, lifetime revisions, DRM-free formats, and guarantees.
          </p>
        </div>

        {/* FAQs Accordion */}
        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-lg border border-[#D4AF37]/20 bg-[#050505] overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleIndex(idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 hover:text-[#F5D76E] transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-lg text-white font-normal">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#D4AF37] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-[#A8A8A8] font-light leading-relaxed border-t border-white/5">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
