'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { HeroBanner as HeroBannerType, SiteSettings, BannerSlide } from '@/lib/types';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

interface HeroBannerProps {
  banner: HeroBannerType;
  settings: SiteSettings;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ banner }) => {
  const defaultSlides: BannerSlide[] = [
    {
      id: 'slide-1',
      image: '/images/banner-1.png',
      alt: 'Always Be Full In Health - Agápure Edible Cooking Oils',
      link: '#products'
    },
    {
      id: 'slide-2',
      image: '/images/banner-2.png',
      alt: 'Agápure Traditional Wood-Pressed Oils',
      link: '#products'
    },
    {
      id: 'slide-3',
      image: '/images/banner-3.png',
      alt: '100% Pure Botanical Edible Oils',
      link: '#products'
    }
  ];

  const slides = (banner.slides && banner.slides.length > 0) ? banner.slides : defaultSlides;
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-scroll every 5 seconds
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, banner.interval || 5000);
    return () => clearInterval(interval);
  }, [slides.length, banner.interval]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="w-full bg-[#FAF7F2] overflow-hidden">
      {/* Top Announcement Bar */}
      {banner.announcementActive && banner.announcementText && (
        <aside
          aria-label="Announcement"
          className="bg-gradient-to-r from-[#143828] via-[#1B4D3E] to-[#143828] text-[#F3E5AB] py-2 px-4 text-xs sm:text-[13px] font-semibold text-center border-b border-[#C5A059]/30 flex items-center justify-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
          <span>{banner.announcementText}</span>
        </aside>
      )}

      {/* Full-Width Banner with 591px Height (No Overlay Text - Client Uploaded Artwork) */}
      <div className="relative w-full h-[280px] sm:h-[400px] md:h-[480px] lg:h-[591px] max-h-[591px] overflow-hidden group select-none">
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id || index}
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <a
                href={slide.link || '#products'}
                className="block relative w-full h-full overflow-hidden"
              >
                <Image
                  src={slide.image}
                  alt={slide.alt || `Agápure 100% Pure Cold-Pressed & Wood-Churned Cooking Oil Banner ${index + 1}`}
                  fill
                  priority={index === 0}
                  className="object-cover object-center w-full h-full"
                  sizes="100vw"
                />
              </a>
            </div>
          );
        })}

        {/* Optional Action Button: Displayed Center Bottom, Above the Auto-scroll Nav */}
        {slides[currentSlide]?.buttonText && slides[currentSlide]?.buttonText?.trim() !== '' && (
          <div className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
            <a
              href={slides[currentSlide].buttonLink || '#products'}
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#C5A059] to-[#D4AF37] text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-xl border border-white/40"
            >
              <span>{slides[currentSlide].buttonText}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        )}

        {/* Carousel Navigation Arrows */}
        {slides.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              type="button"
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs flex items-center justify-center opacity-70 group-hover:opacity-100 transition-all shadow-md active:scale-95"
              aria-label="Previous Banner"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={handleNext}
              type="button"
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs flex items-center justify-center opacity-70 group-hover:opacity-100 transition-all shadow-md active:scale-95"
              aria-label="Next Banner"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Bottom Dots Indicator */}
            <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5 bg-black/30 backdrop-blur-xs px-3.5 py-1.5 rounded-full">
              {slides.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={() => setCurrentSlide(dotIdx)}
                  className={`transition-all rounded-full ${
                    dotIdx === currentSlide
                      ? 'w-7 h-2.5 bg-[#D4AF37]'
                      : 'w-2.5 h-2.5 bg-white/70 hover:bg-white'
                  }`}
                  aria-label={`Go to slide ${dotIdx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
