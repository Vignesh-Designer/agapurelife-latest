'use client';

import React from 'react';
import { Product, SiteSettings, FaqItem } from '@/lib/types';

interface StructuredDataProps {
  products: Product[];
  settings: SiteSettings;
  faqs: FaqItem[];
}

export const StructuredData: React.FC<StructuredDataProps> = ({ products, settings, faqs }) => {
  const siteUrl = 'https://agapurelife.com';

  // 1. WebSite Schema with Google Sitelinks SearchBox
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: settings.siteName || 'Agápure Life',
    alternateName: 'AgaPureLife Wood Pressed Oils',
    url: siteUrl,
    description: settings.metaDescription,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/#products?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };

  // 2. Organization & LocalBusiness Schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness', 'Store'],
    '@id': `${siteUrl}/#organization`,
    name: settings.siteName || 'Agápure Life',
    alternateName: 'AgaPureLife Traditional Wood-Pressed Oils',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    image: `${siteUrl}/images/hero-oil-banner.jpg`,
    description: settings.metaDescription,
    telephone: settings.callNumberRaw || '+918136840790',
    email: settings.email || 'care@agapurelife.com',
    taxID: settings.gstNumber || '33ACLFA5417E1ZP',
    priceRange: '₹₹',
    currenciesAccepted: 'INR',
    paymentAccepted: 'Cash on Delivery, UPI, Cards',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Calicut Road',
      addressLocality: 'Calicut',
      addressRegion: 'Kerala',
      postalCode: '673001',
      addressCountry: 'IN'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '11.2588',
      longitude: '75.7804'
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday'
        ],
        opens: '08:00',
        closes: '21:00'
      }
    ],
    sameAs: [
      settings.socialLinks?.instagram || 'https://instagram.com/agapurelife',
      settings.socialLinks?.facebook || 'https://facebook.com/agapurelife',
      settings.socialLinks?.youtube || 'https://youtube.com/@agapurelife'
    ]
  };

  // 3. BreadcrumbList Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Cold Pressed Cooking Oils',
        item: `${siteUrl}/#products`
      }
    ]
  };

  // 4. ItemList Schema for Product Catalog Carousel
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Our Signature Edible Oils',
    description: 'Farm-fresh 100% traditional wood-pressed and cold-pressed edible cooking oils',
    itemListElement: products.map((prod, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      url: `${siteUrl}/#products`,
      name: prod.name
    }))
  };

  // 5. Product Schemas with Google Merchant & Star Ratings
  const productSchemas = products.map((prod) => {
    const offerPrice = prod.price || (prod.volumes && prod.volumes[0]?.price) || (prod.options && prod.options[0]?.price) || 200;
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: prod.name,
      image: prod.image.startsWith('http') ? prod.image : `${siteUrl}${prod.image}`,
      description: prod.description || 'Traditional wood-pressed edible oil with zero chemicals and intact natural nutrients.',
      brand: {
        '@type': 'Brand',
        name: 'Agápure'
      },
      category: prod.category,
      sku: prod.id,
      offers: {
        '@type': 'Offer',
        priceCurrency: 'INR',
        price: offerPrice,
        priceValidUntil: '2028-12-31',
        itemCondition: 'https://schema.org/NewCondition',
        availability: prod.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        url: `${siteUrl}/#products`,
        seller: {
          '@type': 'Organization',
          name: 'Agápure Life'
        },
        hasMerchantReturnPolicy: {
          '@type': 'MerchantReturnPolicy',
          applicableCountry: 'IN',
          returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
          merchantReturnDays: 7,
          returnMethod: 'https://schema.org/ReturnByMail',
          returnFees: 'https://schema.org/FreeReturn'
        },
        shippingDetails: {
          '@type': 'OfferShippingDetails',
          shippingRate: {
            '@type': 'MonetaryAmount',
            value: 0,
            currency: 'INR'
          },
          shippingDestination: {
            '@type': 'DefinedRegion',
            addressCountry: 'IN'
          },
          deliveryTime: {
            '@type': 'ShippingDeliveryTime',
            handlingTime: {
              '@type': 'QuantitativeValue',
              minValue: 0,
              maxValue: 1,
              unitCode: 'd'
            },
            transitTime: {
              '@type': 'QuantitativeValue',
              minValue: 2,
              maxValue: 5,
              unitCode: 'd'
            }
          }
        }
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: prod.rating || '4.9',
        reviewCount: prod.reviewsCount || 148,
        bestRating: '5',
        worstRating: '1'
      }
    };
  });

  // 6. FAQPage Schema for SERP Accordion Rich Snippets
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      {productSchemas.map((schema, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
};
