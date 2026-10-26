import React from 'react';
import type { Metadata } from 'next';
import {
  fetchProducts,
  fetchBanner,
  fetchSettings,
  fetchFaqs,
  fetchBlogs
} from '@/lib/api';
import { Header } from '@/components/Header';
import { HeroBanner } from '@/components/HeroBanner';
import { ProductGrid } from '@/components/ProductGrid';
import { CartDrawer } from '@/components/CartDrawer';
import { TrustSection } from '@/components/TrustSection';
import { ComparisonTable } from '@/components/ComparisonTable';
import { BotanicalBlog } from '@/components/BotanicalBlog';
import { FaqSection } from '@/components/FaqSection';
import { FounderWhatsAppBar } from '@/components/FounderWhatsAppBar';
import { Footer } from '@/components/Footer';
import { StructuredData } from '@/components/StructuredData';
import { MobileBottomNav } from '@/components/MobileBottomNav';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchSettings();
  const siteUrl = 'https://agapurelife.com';

  const title = settings.metaTitle || 'Agápure | 100% Traditional Cold-Pressed & Wood-Pressed Edible Oils';
  const description = settings.metaDescription || 'Buy 100% pure cold-pressed groundnut oil, virgin coconut oil, black sesame gingelly oil, sunflower oil, and pure cow ghee directly from farm. Zero hexane, traditional Vaagai wood extraction.';
  const keywords = settings.metaKeywords
    ? settings.metaKeywords.split(',').map((k: string) => k.trim())
    : [
        'cold pressed oil',
        'wood pressed oil',
        'cold pressed groundnut oil',
        'cold pressed coconut oil',
        'cold pressed sesame oil',
        'wood pressed gingelly oil',
        'cold pressed sunflower oil',
        'pure cow ghee',
        'refined palm oil',
        'cooking oil online india',
        'agapure',
        'agapure life',
        'traditional vaagai wood churned oil',
        'buy edible cooking oil online'
      ];

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords,
    alternates: {
      canonical: siteUrl,
    },
    openGraph: {
      title,
      description,
      url: siteUrl,
      siteName: settings.siteName || 'Agápure Life',
      images: [
        {
          url: settings.logo || '/logo.png',
          width: 1200,
          height: 630,
          alt: 'Agápure - Pure Cold Pressed & Wood Churned Edible Cooking Oils',
        },
      ],
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [settings.logo || '/logo.png'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function HomePage() {
  const [products, banner, settings, faqs, blogs] = await Promise.all([
    fetchProducts(),
    fetchBanner(),
    fetchSettings(),
    fetchFaqs(),
    fetchBlogs()
  ]);

  return (
    <>
      {/* Search Engine Optimization (JSON-LD Schemas) */}
      <StructuredData products={products} settings={settings} faqs={faqs} />

      {/* Main Page Layout */}
      <div className="min-h-screen flex flex-col bg-[#FAF7F2] pb-14 md:pb-0">
        {/* Navigation Header */}
        <Header settings={settings} />

        {/* 1. Full-Width Hero Banner */}
        <HeroBanner banner={banner} settings={settings} />

        {/* Main Content Area */}
        <main className="flex-1">
          {/* 2. 5 Signature Oils Grid (3 on Top, 2 Bottom Center Aligned) */}
          <div id="products">
            <ProductGrid products={products} />
          </div>

          {/* 3. Why Trust AgaPureLife? Section */}
          <div id="trust">
            <TrustSection settings={settings} />
          </div>

          {/* 4. AgaPure vs Commercial Refined Oils Comparison Table */}
          <div id="comparison">
            <ComparisonTable />
          </div>

          {/* 5. Kitchen Heritage & Science (Botanical Blog) */}
          <div id="blog">
            <BotanicalBlog blogs={blogs} />
          </div>

          {/* 6. Frequently Asked Questions (FAQ) */}
          <div id="faq">
            <FaqSection faqs={faqs} />
          </div>

          {/* 7. Founder Direct WhatsApp Banner */}
          <FounderWhatsAppBar settings={settings} />
        </main>

        {/* 8. Luxury Footer Matching Logo */}
        <Footer settings={settings} />

        {/* 30% Right Slide-In Shopping Cart Drawer */}
        <CartDrawer settings={settings} />

        {/* Fixed Mobile Bottom Contact Bar (#143828 80% with #D6B054 outer stroke) */}
        <MobileBottomNav settings={settings} />
      </div>
    </>
  );
}
