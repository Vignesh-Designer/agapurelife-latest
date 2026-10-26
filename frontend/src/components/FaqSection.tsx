'use client';

import React, { useState } from 'react';
import { FaqItem } from '@/lib/types';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqSectionProps {
  faqs: FaqItem[];
}

export const FaqSection: React.FC<FaqSectionProps> = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First open by default

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 sm:py-28 bg-[#F7F3EB] text-[#1A1A1A] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[#99752D] text-xs font-bold uppercase tracking-widest block mb-2">
            FREQUENTLY ASKED QUESTIONS
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F281E]">
            Frequently Asked Questions
          </h2>
          <p className="mt-3.5 text-sm sm:text-base text-[#6B6357] leading-relaxed">
            Everything you need to know about our cold-pressed extraction, packaging, and hassle-free WhatsApp ordering.
          </p>
        </div>

        {/* 10 Accordion Cards */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.id || idx}
                className="bg-white rounded-2xl border border-[#E5DFC9] shadow-xs overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-[#0F281E] hover:text-[#99752D] transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-[#C5A059] font-mono text-xs">{idx + 1}.</span>
                    <span>{faq.question}</span>
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full bg-[#FAF7F2] border border-[#E5DFC9] flex items-center justify-center text-[#143828] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-[#143828] text-white' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-[13px] text-[#544F46] leading-relaxed border-t border-[#F4EFE6] bg-[#FAF7F2]/50 animate-in fade-in duration-200">
                    <p>{faq.answer}</p>
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
