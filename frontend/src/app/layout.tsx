import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';

export const metadata: Metadata = {
  metadataBase: new URL('https://agapurelife.com'),
  title: 'Agápure | 100% Traditional Wood-Pressed & Cold-Pressed Edible Cooking Oils',
  description:
    'Experience divine wellness with authentic Vaagai wood-pressed groundnut, coconut, sesame, sunflower, and refined cooking oils directly from farm. 100% zero chemical hexane, unrefined single botanical origin.',
  keywords: [
    'wood pressed oil',
    'cold pressed groundnut oil',
    'virgin coconut oil glass bottle',
    'pure black sesame gingelly oil',
    'sunflower oil unrefined',
    'refined cooking oil',
    'agapure',
    'agapure life',
    'organic cooking oil india',
    'edible oil online'
  ],
  authors: [{ name: 'Agápure Life' }],
  creator: 'Agápure Farms & Mills',
  publisher: 'Agápure Life',
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.ico',
    apple: '/favicon.png',
  },
  alternates: {
    canonical: 'https://agapurelife.com',
  },
  openGraph: {
    title: 'Agápure | 100% Traditional Wood-Pressed & Cold-Pressed Edible Oils',
    description:
      'Centuries-old stone & vaagai wood-pressed unrefined edible oils. Churned cold under 42°C to lock authentic aroma, natural Vitamin E, and heart-healthy bioactives.',
    url: 'https://agapurelife.com',
    siteName: 'Agápure Life',
    images: [
      {
        url: '/logo.jpg',
        width: 1200,
        height: 630,
        alt: 'Agápure - Love in Every Drop',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agápure | 100% Traditional Wood-Pressed & Cold-Pressed Edible Oils',
    description:
      'Shop authentic Vaagai wood-pressed unrefined groundnut, virgin coconut, and black sesame oils directly from farm.',
    images: ['/logo.jpg'],
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full scroll-smooth" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-[#FAF7F2] text-[#1A1A1A] antialiased selection:bg-[#C5A059] selection:text-black" suppressHydrationWarning>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
