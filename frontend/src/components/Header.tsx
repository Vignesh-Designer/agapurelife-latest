'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SiteSettings } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Phone, MessageCircle, Menu, X } from 'lucide-react';

interface HeaderProps {
  settings: SiteSettings;
}

export const Header: React.FC<HeaderProps> = ({ settings }) => {
  const { totalItems, setIsOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(
    'Hello Agápure! I want to inquire about your pure edible oils.'
  )}`;

  const logoSrc = settings.logo || '/logo.png';

  return (
    <header className="sticky top-0 z-40 bg-white/98 backdrop-blur-md border-b border-gray-200 text-gray-900 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Brand: White/Transparent Logo Image with Admin control */}
          <Link href="/" className="flex items-center group py-2" aria-label="Agápure Home">
            <div className="relative h-12 w-44 sm:h-14 sm:w-52 transition-transform group-hover:scale-102">
              <Image
                src={logoSrc}
                alt="Agápure - Pure Cold-Pressed & Wood-Churned Edible Cooking Oils Logo"
                fill
                priority
                sizes="(max-width: 640px) 176px, 208px"
                className="object-contain object-left"
              />
            </div>
          </Link>

          {/* Desktop Navigation: "Our Product", "Why Trust Us", "Purity Comparison", "Our Blog", "FAQ" - Admin Removed */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-bold uppercase tracking-wider text-gray-700">
            <a href="#products" className="hover:text-[#99752D] transition-colors">
              Our Product
            </a>
            <a href="#trust" className="hover:text-[#99752D] transition-colors">
              Why Trust Us
            </a>
            <a href="#comparison" className="hover:text-[#99752D] transition-colors">
              Purity Comparison
            </a>
            <a href="#blog" className="hover:text-[#99752D] transition-colors">
              Our Blog
            </a>
            <a href="#faq" className="hover:text-[#99752D] transition-colors">
              FAQ
            </a>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            {/* Call Us Link */}
            <a
              href={`tel:${settings.callNumberRaw}`}
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 hover:border-[#C5A059] text-xs font-bold text-gray-800 transition-colors shadow-2xs"
              title="Call Our Mill"
            >
              <Phone className="w-3.5 h-3.5 text-[#99752D]" />
              <span>{settings.callNumber}</span>
            </a>

            {/* Direct WhatsApp Quick Chat */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#143828] border border-[#143828] hover:bg-[#1B4D3E] text-xs font-bold text-[#F3E5AB] transition-colors shadow-xs"
            >
              <div className="w-4 h-4 rounded-full bg-[#25D366] text-white flex items-center justify-center">
                <MessageCircle className="w-2.5 h-2.5 fill-current" />
              </div>
              <span>WhatsApp</span>
            </a>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsOpen(true)}
              className="relative p-2.5 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#D4AF37] text-[#0A0A0A] font-bold text-xs flex items-center gap-2 shadow-md hover:brightness-105 active:scale-95 transition-all"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
              <span className="hidden sm:inline">Cart</span>
              {mounted && totalItems > 0 && (
                <span className="bg-[#0F281E] text-[#F3E5AB] text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-[18px] text-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-black"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top duration-200 shadow-lg">
          <nav className="flex flex-col space-y-2.5 text-sm font-semibold tracking-wide text-gray-800">
            <a
              href="#products"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-lg hover:bg-gray-100"
            >
              Our Product
            </a>
            <a
              href="#trust"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-lg hover:bg-gray-100"
            >
              Why Trust AgaPure
            </a>
            <a
              href="#comparison"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-lg hover:bg-gray-100"
            >
              Purity Comparison Table
            </a>
            <a
              href="#blog"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-lg hover:bg-gray-100"
            >
              Our Blog
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-lg hover:bg-gray-100"
            >
              Frequently Asked Questions
            </a>
          </nav>

          <div className="pt-3 border-t border-gray-200 flex flex-col gap-2.5">
            <a
              href={`tel:${settings.callNumberRaw}`}
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-100 border border-gray-200 text-xs font-bold text-gray-900"
            >
              <Phone className="w-4 h-4 text-[#99752D]" />
              <span>Call: {settings.callNumber}</span>
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#143828] text-xs font-bold text-[#F3E5AB]"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>Order on WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
