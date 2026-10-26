'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { SiteSettings } from '@/lib/types';
import { Phone, MapPin, MessageCircle, CheckCircle2, ArrowRight } from 'lucide-react';

interface FooterProps {
  settings: SiteSettings;
}

export const Footer: React.FC<FooterProps> = ({ settings }) => {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  // 6 official categories requested by user
  const categoriesList = [
    { name: 'Refined Palm Oil', id: 'refined-palm-oil' },
    { name: 'Cold pressed Groundnut Oil', id: 'cold-pressed-groundnut-oil' },
    { name: 'Cold pressed Sunflower Oil', id: 'cold-pressed-sunflower-oil' },
    { name: 'Cold pressed Coconut Oil', id: 'cold-pressed-coconut-oil' },
    { name: 'Cold pressed Sesame Oil', id: 'cold-pressed-sesame-oil' },
    { name: 'Ghee', id: 'pure-desi-ghee' }
  ];

  return (
    <footer className="bg-[#0B0B0B] text-[#D5CEBF] border-t border-[#C5A059]/30 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="inline-block bg-white/10 rounded-xl p-2.5 border border-white/15">
              <Image
                src={settings.logo || '/logo.png'}
                alt="Agápure Life - Traditional Cold-Pressed Edible Cooking Oils Official Logo"
                width={200}
                height={68}
                style={{ height: 'auto', width: 'auto' }}
                className="h-auto w-auto max-h-14 max-w-[200px] object-contain object-left"
              />
            </div>

            <p className="text-xs text-[#A89E8D] leading-relaxed pr-4 font-light">
              Botanical cold-pressed and wood-churned oils crafted for purity, clinical cleanliness, and traditional kitchen heritage. Pure unrefined nutrition delivered straight from stone & wood.
            </p>

            <div className="space-y-2 text-xs text-[#BDB5A4] pt-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C5A059] shrink-0" />
                <a href={`tel:${settings.callNumberRaw}`} className="hover:text-white transition-colors">
                  {settings.callNumber}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0" />
                <a
                  href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  WhatsApp: {settings.whatsappDisplay}
                </a>
              </div>
            </div>
          </div>

          {/* Pure Oils Quick Links: 6 Categories */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider">
              Our Products
            </h4>
            <ul className="space-y-2.5 text-xs">
              {categoriesList.map((item) => (
                <li key={item.id}>
                  <a
                    href="#products"
                    className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                    <span className="font-medium text-[#E5DFC9] hover:text-white">{item.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Certifications (Col span 3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider">
              Certifications
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-2 rounded-lg bg-white/5 border border-white/10 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span className="text-[11px] font-mono">FSSAI : {settings.fssaiNumber || '12425003002364'}</span>
              </div>
              <div className="p-2 rounded-lg bg-white/5 border border-white/10 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span className="text-[11px] font-mono">GST : {settings.gstNumber || '33ACLFA5417E1ZP'}</span>
              </div>
              <div className="p-2 rounded-lg bg-white/5 border border-white/10 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span className="text-[11px]">100% Organic</span>
              </div>
              <div className="p-2 rounded-lg bg-white/5 border border-white/10 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span className="text-[11px]">Wood Churned</span>
              </div>
              <div className="p-2 rounded-lg bg-white/5 border border-white/10 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span className="text-[11px]">All-India Delivery</span>
              </div>
            </div>
          </div>

          {/* Newsletter (Col span 3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider">
              Pure Wellness Club
            </h4>
            <p className="text-xs text-[#A89E8D] leading-relaxed">
              Receive batch test certificates, harvest notifications, and healthy ayurvedic recipes.
            </p>

            {subscribed ? (
              <div className="p-3 bg-[#143828] border border-[#C5A059] rounded-xl text-xs text-[#F3E5AB] font-bold text-center">
                ✨ Thank you for joining the Agápure family!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-xs text-white placeholder-[#8C8275] focus:outline-none focus:border-[#C5A059]"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#143828] hover:bg-[#1B4D3E] text-[#F3E5AB] border border-[#C5A059]/40 font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Copyright & Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#8C8275]">
          <p>© 2026 Agápure Life. All natural botanicals strictly reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#faq" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#faq" className="hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="/admin" className="text-[#C5A059] hover:underline font-bold">
              Admin Portal
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
