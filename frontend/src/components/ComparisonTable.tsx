'use client';

import React from 'react';
import { Check, X, Flame, FlaskConical, Droplets, Heart, ShieldAlert, Sparkles } from 'lucide-react';

export const ComparisonTable: React.FC = () => {
  const comparisonData = [
    {
      factor: 'Extraction Temperature',
      icon: Flame,
      agapure: 'Sub-42°C (Mohua & Wood Mortar)',
      commercial: '200°C – 240°C High-heat destructive expellers',
      agapurePositive: true
    },
    {
      factor: 'Chemical Solvent Refining',
      icon: FlaskConical,
      agapure: '100% Zero Hexane & Solvents',
      commercial: 'Extracted with neurotoxic hexane solvents',
      agapurePositive: true
    },
    {
      factor: 'Palm Oil Blending',
      icon: Droplets,
      agapure: 'Never Blended • Single Botanical',
      commercial: 'Often blended up to 40% with cheap RBD Palm Oil',
      agapurePositive: true
    },
    {
      factor: 'Natural Vitamin E & Antioxidants',
      icon: Sparkles,
      agapure: 'Fully Intact & Bioavailable',
      commercial: 'Stripped during bleaching, synthetic vitamins re-added',
      agapurePositive: true
    },
    {
      factor: 'Trans Fats & Free Radicals',
      icon: Heart,
      agapure: '0.01% Trans-Fat • Zero Oxidation',
      commercial: 'High trans-fat is produced via high-heat deodorization',
      agapurePositive: true
    },
    {
      factor: 'Natural Aroma & Taste',
      icon: Sparkles,
      agapure: 'Authentic, Olfactory & Rich',
      commercial: 'Artificially deodorized and bleached tasteless',
      agapurePositive: true
    }
  ];

  return (
    <section className="py-20 sm:py-28 bg-[#F4EFE6] text-[#1A1A1A] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <span className="text-[#99752D] text-xs font-bold uppercase tracking-widest block mb-2">
            PURITY COMPARISON
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F281E] leading-tight">
            AgaPureLife vs Commercial Refined Oils
          </h2>
          <p className="mt-3.5 text-sm sm:text-base text-[#6B6357] leading-relaxed">
            See why switching to unrefined cold-pressed oils is the single highest-impact health decision you can make for your kitchen.
          </p>
        </div>

        {/* Table Container with elevated card framing */}
        <div className="bg-white rounded-3xl border border-[#E5DFC9] shadow-xl overflow-hidden max-w-5xl mx-auto">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E5DFC9]">
                  <th className="p-4 sm:p-6 text-xs sm:text-sm font-bold text-[#544015] bg-[#FAF7F2] w-1/3">
                    Feature / Quality Factor
                  </th>
                  <th className="p-4 sm:p-6 text-xs sm:text-sm font-bold text-[#F3E5AB] bg-[#143828] w-1/3 border-x border-[#143828]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />
                      <span>AgaPureLife Cold-Pressed</span>
                    </div>
                  </th>
                  <th className="p-4 sm:p-6 text-xs sm:text-sm font-bold text-[#716B61] bg-[#F4EFE6] w-1/3">
                    Commercial Refined Oils
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2ECE1] text-xs sm:text-sm">
                {comparisonData.map((row, idx) => {
                  const Icon = row.icon;
                  return (
                    <tr key={idx} className="hover:bg-[#FAF7F2]/60 transition-colors">
                      {/* Factor */}
                      <td className="p-4 sm:p-6 font-semibold text-[#143828] bg-white">
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4 text-[#C5A059] shrink-0" />
                          <span>{row.factor}</span>
                        </div>
                      </td>

                      {/* AgaPure Highlighted Column */}
                      <td className="p-4 sm:p-6 font-bold text-[#143828] bg-[#F7FBF8] border-x border-[#E5DFC9]/80">
                        <div className="flex items-start gap-2">
                          <span className="w-4 h-4 rounded-full bg-[#143828] text-[#D4AF37] flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3 h-3 stroke-[2.5]" />
                          </span>
                          <span>{row.agapure}</span>
                        </div>
                      </td>

                      {/* Commercial Column */}
                      <td className="p-4 sm:p-6 text-[#991B1B] bg-white font-medium">
                        <div className="flex items-start gap-2">
                          <span className="w-4 h-4 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 mt-0.5">
                            <X className="w-3 h-3 stroke-[2.5]" />
                          </span>
                          <span>{row.commercial}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
