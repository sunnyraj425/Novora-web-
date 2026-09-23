import React from 'react';
import { NovoraLogo } from './NovoraLogo';
import { PrimaryCategory } from '../types';
import { Smartphone, Laptop, Tablet, Settings } from 'lucide-react';

interface FooterProps {
  onNavigateCategory: (cat: PrimaryCategory) => void;
  onNavigateAllProducts: () => void;
  onNavigateAdmin: () => void;
  onNavigateHome: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateCategory,
  onNavigateAllProducts,
  onNavigateAdmin,
  onNavigateHome,
}) => {
  return (
    <footer className="bg-[#050505] text-[#A8A8A8] border-t border-[#D4AF37]/20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#D4AF37]/15">
          
          {/* Brand Info & Tagline */}
          <div className="lg:col-span-5 space-y-4">
            <div onClick={onNavigateHome} className="cursor-pointer">
              <NovoraLogo variant="horizontal" size="md" />
            </div>
            
            <p className="text-xs text-[#A8A8A8] font-light max-w-sm leading-relaxed mt-3">
              NOVORA is an independent executive publishing house and digital laboratory. We engineer
              authoritative guides, practical workflows, and strategic blueprints for modern learners and operators.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-[#D4AF37] tracking-[0.2em] uppercase font-medium">
              <span>“Become Better Than Yesterday.”</span>
            </div>
          </div>

          {/* Links Column 1: Curated Disciplines (EXACTLY 3) */}
          <div className="lg:col-span-3 space-y-3 text-xs">
            <span className="text-[11px] font-semibold tracking-[0.2em] text-white uppercase block">
              Primary Disciplines
            </span>
            <ul className="space-y-2 font-light">
              <li>
                <button
                  onClick={() => onNavigateCategory('ai')}
                  className="hover:text-[#F5D76E] transition-colors cursor-pointer text-left uppercase tracking-wider"
                >
                  AI Publications
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateCategory('finance')}
                  className="hover:text-[#F5D76E] transition-colors cursor-pointer text-left uppercase tracking-wider"
                >
                  Finance Publications
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateCategory('communication')}
                  className="hover:text-[#F5D76E] transition-colors cursor-pointer text-left uppercase tracking-wider"
                >
                  Communication Publications
                </button>
              </li>
              <li>
                <button
                  onClick={onNavigateAllProducts}
                  className="text-[#D4AF37] hover:text-[#F5D76E] transition-colors cursor-pointer text-left uppercase tracking-wider font-semibold"
                >
                  All Products
                </button>
              </li>
            </ul>
          </div>

          {/* Links Column 2: Administration & Standards */}
          <div className="lg:col-span-2 space-y-3 text-xs">
            <span className="text-[11px] font-semibold tracking-[0.2em] text-white uppercase block">
              Management
            </span>
            <ul className="space-y-2 font-light">
              <li>
                <button
                  onClick={onNavigateAdmin}
                  className="hover:text-[#F5D76E] transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <Settings className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Admin Dashboard</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onNavigateHome}
                  className="hover:text-[#F5D76E] transition-colors cursor-pointer text-left"
                >
                  Explore NOVORA
                </button>
              </li>
              <li>
                <a
                  href="mailto:concierge@novora.digital?subject=Catalog%20Inquiry"
                  className="hover:text-[#F5D76E] transition-colors"
                >
                  Support Desk
                </a>
              </li>
            </ul>
          </div>

          {/* Universal Format Support */}
          <div className="lg:col-span-2 space-y-3 text-xs">
            <span className="text-[11px] font-semibold tracking-[0.2em] text-white uppercase block">
              Format Support
            </span>
            <p className="text-[11px] font-light leading-relaxed">
              Every digital publication is delivered in DRM-free standard formats:
            </p>
            <div className="flex items-center gap-3 text-white pt-1">
              <span className="flex items-center gap-1 text-[11px] text-[#A8A8A8]">
                <Tablet className="w-3.5 h-3.5 text-[#D4AF37]" /> iPad / Kindle
              </span>
              <span className="flex items-center gap-1 text-[11px] text-[#A8A8A8]">
                <Laptop className="w-3.5 h-3.5 text-[#D4AF37]" /> Desktop
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Indian Payments & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-light">
          
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} NOVORA. All rights reserved.</span>
          </div>

          {/* Payment Trust Badges */}
          <div className="flex items-center gap-2 text-[10px] text-[#888] font-mono">
            <span className="px-2 py-0.5 rounded bg-[#0A0A0A] border border-white/10">UPI / QR</span>
            <span className="px-2 py-0.5 rounded bg-[#0A0A0A] border border-white/10">RuPay</span>
            <span className="px-2 py-0.5 rounded bg-[#0A0A0A] border border-white/10">NetBanking</span>
            <span className="px-2 py-0.5 rounded bg-[#0A0A0A] border border-white/10">Cards</span>
          </div>

        </div>

      </div>
    </footer>
  );
};
