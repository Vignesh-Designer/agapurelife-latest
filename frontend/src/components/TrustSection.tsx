'use client';

import React from 'react';
import { SiteSettings } from '@/lib/types';
import { ShieldCheck, Sparkles, Award, Trees, GlassWater, Download, FileText, CheckCircle2 } from 'lucide-react';

interface TrustSectionProps {
  settings: SiteSettings;
}

export const TrustSection: React.FC<TrustSectionProps> = ({ settings }) => {
  const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');

  const trustPillars = [
    {
      icon: Trees,
      title: '100% Traditional Wood Pressing',
      description: 'Pressed in authentic natural Vaagai wood chambers under 42°C. Fatty acids, enzymes, and delicate micronutrients remain 100% intact.',
      footerTag: 'Sub-42°C Cold Extraction'
    },
    {
      icon: ShieldCheck,
      title: 'Zero Adulteration Guarantee',
      description: 'Every production batch undergoes third-party GC-MS testing to confirm zero presence of cheap palm oil, mineral oils, or synthetic fragrances.',
      footerTag: 'Batch Purity Report & Lab Certified'
    },
    {
      icon: Award,
      title: 'Direct Indian Farmer Sourcing',
      description: 'Non-GMO native seeds procured directly from organic farmer cooperatives in Kerala, Gujarat, and Tamil Nadu. Fair remunerations paid.',
      footerTag: 'Fair Trade & Fair Remuneration'
    },
    {
      icon: GlassWater,
      title: 'Dark Amber Glass Packing',
      description: 'Maximum protection against single-use plastics & UV photo-oxidation. Heavy amber glass preserves original freshness and aroma up to 12 months.',
      footerTag: 'Non-Leaching UV Protection Glass'
    }
  ];

  return (
    <section className="py-20 sm:py-28 bg-[#0D1F17] text-white relative overflow-hidden">
      {/* Background radial gradient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#1B4D3E]/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest block mb-2">
            WHY CHOOSE WOOD-PRESSED OILS?
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
            Why Trust AgaPureLife?
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#D5CEBF] leading-relaxed font-light">
            Commercial oils are stripped bare with chemical petroleum solvent at 230°C. AgaPureLife uses centuries-old wood mortars that never expose gentle seeds to heat.
          </p>
        </div>

        {/* 4 Trust Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustPillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="bg-white/95 text-[#1A1A1A] rounded-2xl p-6 sm:p-7 shadow-xl border border-[#C5A059]/40 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#E5DFC9] text-[#143828] flex items-center justify-center mb-5 shadow-xs">
                    <Icon className="w-6 h-6 stroke-[1.75]" />
                  </div>
                  <h3 className="font-serif-luxury font-bold text-lg text-[#0F281E] leading-snug">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-[#6B6357] mt-3 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#F2ECE1] text-[11px] font-bold text-[#99752D] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#143828]" />
                  <span>{pillar.footerTag}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Batch Test Certificate Callout Banner */}
        <div className="mt-12 bg-white/10 backdrop-blur-md border border-[#C5A059]/40 rounded-2xl p-5 sm:p-7 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-xl bg-[#D4AF37] text-black flex items-center justify-center shrink-0 font-bold">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif-luxury font-bold text-base sm:text-lg text-white">
                Want to inspect our latest batch test certificates?
              </h4>
              <p className="text-xs sm:text-sm text-[#D5CEBF] mt-0.5">
                Download our NABL-accredited GC-MS purity certifications with fatty acid breakdowns.
              </p>
            </div>
          </div>

          <a
            href={`https://wa.me/${cleanNumber}?text=${encodeURIComponent('Hello! Please share the latest NABL GC-MS lab test certificate for AgaPure oils.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-xl bg-[#D4AF37] hover:bg-[#E6CA65] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shrink-0 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Request Purity Certificate</span>
          </a>
        </div>
      </div>
    </section>
  );
};
