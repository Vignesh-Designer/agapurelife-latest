'use client';

import React from 'react';
import { SiteSettings } from '@/lib/types';
import { Phone } from 'lucide-react';

interface MobileBottomNavProps {
  settings: SiteSettings;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ settings }) => {
  const cleanCallNumber = (settings.callNumberRaw || settings.callNumber || '+918136840790').replace(/[^0-9+]/g, '');
  const cleanWhatsAppNumber = (settings.whatsappNumber || '+918136840790').replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent(
    'Hello Agápure! I want to inquire about your pure edible oils.'
  )}`;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#143828]/80 backdrop-blur-md border-t-2 border-[#D6B054] shadow-[0_-4px_16px_rgba(0,0,0,0.3)] pb-[env(safe-area-inset-bottom)]"
      aria-label="Mobile quick contact bar"
    >
      <div className="flex items-center h-12 w-full">
        {/* Call Us Link */}
        <a
          href={`tel:${cleanCallNumber}`}
          className="flex-1 flex flex-col items-center justify-center h-full text-white hover:text-[#D6B054] active:bg-white/10 transition-colors select-none"
          aria-label="Call us"
        >
          <Phone className="w-4 h-4 fill-white stroke-white" />
          <span className="text-[11px] font-medium tracking-wide mt-1 leading-none text-white">
            call us
          </span>
        </a>

        {/* Center Divider Line */}
        <div className="w-[1px] h-6 bg-white/20 shrink-0" aria-hidden="true" />

        {/* WhatsApp Link */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex flex-col items-center justify-center h-full text-white hover:text-[#D6B054] active:bg-white/10 transition-colors select-none"
          aria-label="Contact on WhatsApp"
        >
          <svg
            className="w-4 h-4 fill-white shrink-0"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.41a8.17 8.17 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24h-.18zm-3.56 3.63c-.2 0-.44.07-.67.33-.23.26-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.12.18 1.74 2.76 4.28 3.79 2.11.85 2.54.68 3 .64.46-.05 1.48-.6 1.69-1.19.21-.58.21-1.08.15-1.19-.06-.11-.23-.18-.49-.31-.26-.13-1.48-.73-1.71-.81-.23-.09-.39-.13-.56.13-.17.26-.64.81-.79.97-.15.16-.29.18-.55.05-.26-.13-1.1-.4-2.09-1.29-.77-.69-1.29-1.54-1.44-1.8-.15-.26-.02-.4.11-.53.12-.12.26-.31.39-.46.13-.16.17-.26.26-.44.09-.18.04-.33-.02-.46-.07-.13-.56-1.39-.79-1.92-.22-.52-.45-.45-.62-.46l-.53-.01z" />
          </svg>
          <span className="text-[11px] font-medium tracking-wide mt-1 leading-none text-white">
            Whatsapp
          </span>
        </a>
      </div>
    </nav>
  );
};
