'use client';

import React from 'react';
import { SiteSettings } from '@/lib/types';
import { MessageCircle, Sparkles } from 'lucide-react';

interface FounderWhatsAppBarProps {
  settings: SiteSettings;
}

export const FounderWhatsAppBar: React.FC<FounderWhatsAppBarProps> = ({ settings }) => {
  const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(
    'Hello Agápure Founders! I have a question about cold-pressed oils / bulk packing.'
  )}`;

  return (
    <section className="bg-gradient-to-r from-[#D4AF37] via-[#E5C378] to-[#C5A059] text-[#1A1A1A] py-8 sm:py-10 border-y border-[#B8860B]/30 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/80 text-[#0F281E] text-[11px] font-extrabold uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Online Support Active</span>
            </div>
            <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#0F281E]">
              {settings.founderWhatsAppMessage || 'Have Questions or Want Custom Bulk Litre Packs? Chat With Our Founders on WhatsApp'} ({settings.whatsappDisplay})
            </h3>
            <p className="text-xs sm:text-sm text-[#383127]">
              Get personalized cold-pressed recommendations for your family, baby massage advice, or wholesale 15L tins.
            </p>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-7 py-3.5 rounded-xl bg-[#0F281E] hover:bg-[#143828] text-[#F3E5AB] font-bold text-xs sm:text-sm tracking-wide flex items-center gap-2.5 shadow-xl shrink-0 transition-transform active:scale-98"
          >
            <div className="w-5 h-5 rounded-full bg-[#25D366] text-white flex items-center justify-center">
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
            </div>
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
};
