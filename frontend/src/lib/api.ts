import { Product, HeroBanner, SiteSettings, FaqItem, BlogPost, OrderRecord } from './types';

const API_BASE_URL = typeof window !== 'undefined' ? '/api' : (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api');

// Initial Products matching the 6 user categories
export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 'refined-palm-oil-pouch',
    name: 'Refined Palm Oil',
    slug: 'refined-palm-oil-pouch',
    category: 'Refined Palm Oil',
    description: 'High stability at high temperatures, perfect for crisp deep frying and daily kitchen cooking with zero cholesterol.',
    price: 75,
    volume: '500ml',
    weight: 'Litre',
    package: 'Pouch',
    image: '/images/refined-oil.jpg',
    inStock: true
  },
  {
    id: 'refined-palm-oil-bottle',
    name: 'Refined Palm Oil',
    slug: 'refined-palm-oil-bottle',
    category: 'Refined Palm Oil',
    description: 'High stability at high temperatures, perfect for crisp deep frying and daily kitchen cooking with zero cholesterol.',
    price: 140,
    volume: '1',
    weight: 'Litre',
    package: 'Bottle',
    image: '/images/refined-oil.jpg',
    inStock: true
  },
  {
    id: 'cold-pressed-groundnut-oil',
    name: 'AgaPureLife Cold pressed Groundnut Oil',
    slug: 'cold-pressed-groundnut-oil',
    category: 'Cold pressed Groundnut Oil',
    description: 'Extracted from high-quality Saurashtra peanuts in traditional wooden churners with rich nutty aroma and intact MUFA.',
    price: 240,
    volume: '910',
    weight: 'gm',
    package: 'Bottle',
    image: '/images/groundnut-oil.jpg',
    inStock: true
  },
  {
    id: 'cold-pressed-sunflower-oil',
    name: 'AgaPureLife Cold pressed Sunflower Oil',
    slug: 'cold-pressed-sunflower-oil',
    category: 'Cold pressed Sunflower Oil',
    description: 'Low cholesterol and rich in natural Vitamin E for healthy cooking, light curries, and cardiovascular balance.',
    price: 210,
    volume: '850',
    weight: 'gm',
    package: 'Pouch',
    image: '/images/sunflower-oil.jpg',
    inStock: true
  },
  {
    id: 'cold-pressed-coconut-oil',
    name: 'AgaPureLife Extra Virgin Wood-Pressed Coconut Oil',
    slug: 'cold-pressed-coconut-oil',
    category: 'Cold pressed Coconut Oil',
    description: 'Cold extracted from fresh wet coconut milk within 48 hours of harvest. Unheated, raw, and high in Lauric acid.',
    price: 449,
    volume: '910',
    weight: 'gm',
    package: 'Bottle',
    image: '/images/coconut-oil.jpg',
    inStock: true
  },
  {
    id: 'cold-pressed-sesame-oil',
    name: 'AgaPureLife Wood-Pressed Black Sesame Gingelly Oil',
    slug: 'cold-pressed-sesame-oil',
    category: 'Cold pressed Sesame Oil',
    description: 'Aged black sesame seeds stone-crushed with traditional palm jaggery. Rich in calcium, sesamin, and therapeutic warmth.',
    price: 310,
    volume: '910',
    weight: 'gm',
    package: 'Bottle',
    image: '/images/sesame-oil.jpg',
    inStock: true
  },
  {
    id: 'pure-desi-ghee',
    name: 'AgaPureLife Pure Cow Desi Ghee',
    slug: 'pure-desi-ghee',
    category: 'Ghee',
    description: 'Traditional bilona churned pure cow ghee with golden granulated texture, rich aroma, and natural digestive nutrition.',
    price: 650,
    volume: '15',
    weight: 'kg',
    package: 'Tin',
    image: '/images/refined-oil.jpg',
    inStock: true
  }
];

export const FALLBACK_BANNER: HeroBanner = {
  slides: [
    {
      id: 'slide-1',
      title: 'Always Be Full In Health',
      subtitle: 'Pure and authentic edible cooking oils crafted with care.',
      image: '/images/banner-1.png',
      mobileImage: '/images/banner-1.png',
      buttonText: 'Explore Products',
      buttonLink: '#products'
    },
    {
      id: 'slide-2',
      title: 'Cold Pressed & Wood Churned Oils',
      subtitle: 'Traditional extraction under 42°C preserving all natural enzymes.',
      image: '/images/hero-oil-banner.jpg',
      mobileImage: '/images/hero-oil-banner.jpg',
      buttonText: 'Explore Products',
      buttonLink: '#products'
    },
    {
      id: 'slide-3',
      title: 'Love in Every Drop',
      subtitle: '100% single botanical origin without chemical solvents.',
      image: '/images/banner-1.png',
      mobileImage: '/images/banner-1.png',
      buttonText: 'Explore Products',
      buttonLink: '#products'
    }
  ],
  height: 591,
  autoPlay: true,
  interval: 5000,
  announcementActive: true,
  announcementText: '🌿 Fresh Batch Churned This Morning! Free Shipping on orders above ₹799 across India. Flat 10% OFF on 5L Family Packs'
};

export const FALLBACK_SETTINGS: SiteSettings = {
  siteName: 'Agápure',
  tagline: 'Love in Every Drop',
  logo: '/logo.png',
  whatsappNumber: '+918136840790',
  whatsappDisplay: '+91 81368 40790',
  callNumber: '+91 81368 40790',
  callNumberRaw: '+918136840790',
  email: 'care@agapurelife.com',
  address: 'Heritage Farms & Wood Mill, Calicut Road, Kerala - 673001, India',
  fssaiNumber: '12425003002364',
  gstNumber: '33ACLFA5417E1ZP',
  currency: '₹',
  freeShippingThreshold: 799,
  shippingFee: 50,
  founderWhatsAppMessage: 'Have Questions or Want Custom Bulk Litre Packs? Chat With Our Founders on WhatsApp (+91 8136840790)',
  adminPin: 'agapure2026@',
  socialLinks: {
    instagram: 'https://instagram.com/agapurelife',
    facebook: 'https://facebook.com/agapurelife',
    youtube: 'https://youtube.com/@agapurelife'
  },
  metaTitle: 'Agápure | 100% Traditional Wood-Pressed & Cold-Pressed Edible Cooking Oils',
  metaDescription: 'Shop authentic Vaagai wood-pressed groundnut, coconut, sesame, sunflower, and refined cooking oils directly from farm. No chemicals, 100% pure & unrefined.',
  metaKeywords: 'wood pressed oil, cold pressed edible oil, groundnut oil, virgin coconut oil, black sesame oil, gingelly oil, pure sunflower oil, agapure, cooking oil online india'
};

export const FALLBACK_FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Are AgaPure oils 100% pure without any preservatives or additives?',
    answer: 'Yes, absolutely. AgaPure oils are 100% unadulterated, unrefined, and single-botanical origin. We never blend cheap palm oil, liquid paraffin, synthetic antioxidants (TBHQ), or artificial coloring agents. Every single batch is strictly tested with Gas Chromatography-Mass Spectrometry (GC-MS) for zero chemical residues.'
  },
  {
    id: 'faq-2',
    question: 'How are your oils extracted (Wood-pressed / Cold-pressed)?',
    answer: 'We use centuries-old traditional Vaagai (Albizia Lebbeck) wood churners (Marachekku). The wooden pestle and mortar absorb frictional heat and keep extraction temperatures consistently below 42°C. This ensures delicate enzymes, natural Vitamin E, and original aromatics remain biologically intact unlike industrial expellers that reach over 200°C.'
  },
  {
    id: 'faq-3',
    question: 'What is the shelf life of your unrefined oils and how should I store them?',
    answer: 'Because our oils contain natural biological antioxidants like Sesamol and Tocopherols with zero water content, their natural shelf life is 9 to 12 months. Store them in a cool, dark pantry away from direct sunlight. We recommend our Dark Amber Glass packaging to prevent photo-oxidation.'
  },
  {
    id: 'faq-4',
    question: 'Can I order directly via WhatsApp or Phone call instead of paying online?',
    answer: 'Yes! When you add your favorite oils to the cart, simply tap "Order on WhatsApp" or "Call Us". Your selected quantities, sizes, and order summary will be pre-formatted into a message, and our founder team will confirm your order and delivery address instantly.'
  },
  {
    id: 'faq-5',
    question: 'How does the WhatsApp order system work with my cart selection?',
    answer: 'Our cart synchronizes your selections in real time. When you click "Order on WhatsApp", it opens WhatsApp with an itemized bill showing product names, pack sizes (500ml/1L/5L), totals, and any active discounts. You can also send special instructions or custom delivery notes in the chat.'
  },
  {
    id: 'faq-6',
    question: 'What size or volume options are available (e.g., 500ml, 750ml, 1 Litre, 5L)?',
    answer: 'We offer flexible sizes for every kitchen: 500ml sample trials, 750ml bottles, 1 Litre daily pantry bottles, and 5 Litre bulk family tins/cans. You can switch between volumes right on each product card and see dynamic savings up to 16%.'
  },
  {
    id: 'faq-7',
    question: 'Do you provide lab test certificates for purity and fatty acid profile?',
    answer: 'Yes. Every single production batch undergoes NABL-accredited laboratory testing for FFA (Free Fatty Acids), Peroxide Value, Fatty Acid Profiling, and Hexane/Mineral Oil absence. You can request or download the latest batch test report directly through our website or WhatsApp support.'
  },
  {
    id: 'faq-8',
    question: 'What are the delivery charges and delivery timelines across India?',
    answer: 'Orders above ₹799 qualify for 100% FREE express shipping all across India. For orders below ₹799, a nominal flat shipping fee of ₹50 applies. Metro cities receive delivery within 2 to 4 working days, while tier-2/3 cities arrive within 4 to 6 business days with live tracking.'
  },
  {
    id: 'faq-9',
    question: 'Can I choose Cash on Delivery (COD) or UPI payment?',
    answer: 'Yes! We support all preferred Indian payment options: Cash on Delivery (COD), Direct UPI (Google Pay, PhonePe, Paytm), Net Banking, and Debit/Credit Cards. You can choose your preferred mode upon WhatsApp order confirmation.'
  },
  {
    id: 'faq-10',
    question: 'How can I contact customer support if I have queries about my order?',
    answer: 'You can reach our dedicated founders directly via WhatsApp at +91 81368 40790 or call us during business hours (9 AM - 8 PM IST). You can also write to us at care@agapurelife.com for corporate gifting or bulk B2B requirements.'
  }
];

export const FALLBACK_BLOGS: BlogPost[] = [
  {
    id: 'blog-1',
    slug: 'why-wood-pressed-oils-are-essential-for-heart-health',
    title: 'Why Wood-Pressed Oils Are Essential for Heart Health vs Refined Vegetable Oils',
    category: 'Holistic Nutrition',
    categoryColor: 'emerald',
    readTime: '4 min read',
    date: 'October 18, 2026',
    image: '/images/blog-cooking.jpg',
    excerpt: 'Discover the cellular degradation that happens during industrial solvent refining, and why unrefined fats preserve heart-vital polyphenols and natural plant sterols.',
    content: 'Most commercial cooking oils on supermarket shelves are extracted using high-heat expellers exceeding 240°C and chemical petroleum solvents like Hexane. In contrast, cold wood pressing retains natural Tocopherols (Vitamin E), Phytosterols, and natural mono-unsaturated fatty acids that actively balance LDL to HDL cholesterol ratios.'
  },
  {
    id: 'blog-2',
    slug: 'ancient-art-of-vaagai-wood-churning',
    title: 'The Ancient Art of Vaagai Wood Churning: How We Preserve 100% Nutrients',
    category: 'Traditional Science',
    categoryColor: 'gold',
    readTime: '5 min read',
    date: 'October 14, 2026',
    image: '/images/blog-press.jpg',
    excerpt: 'Why the black siris (Vaagai) wood pestle regulates friction and seed curding, preventing temperatures from destroying sensitive bioactives.',
    content: 'Traditional Marachekku relies on Vaagai wood (Albizia lebbeck). Unlike heavy iron or steel screw expellers that generate scorching friction, Vaagai wood naturally absorbs friction heat and imparts medicinal cooling benefits, keeping the freshly squeezed oil golden and chemically unaltered.'
  },
  {
    id: 'blog-3',
    slug: 'ayurvedic-benefits-of-cold-pressed-sesame-coconut-oils',
    title: 'Top 7 Ayurvedic Benefits of Pure Cold-Pressed Sesame & Coconut Oils',
    category: 'Ayurvedic Kitchen',
    categoryColor: 'emerald',
    readTime: '6 min read',
    date: 'October 09, 2026',
    image: '/images/blog-ayurveda.jpg',
    excerpt: 'From morning Gandusha (oil pulling) to daily dinner seasoning, explore how classical Ayurveda treats pure oils as life-giving Ojas nourishers.',
    content: 'In classical Charaka Samhita, sesame oil (Tila Taila) is considered the supreme base among vegetable oils due to its deep cellular penetrating power (Sukshma). Paired with virgin coconut oil rich in Lauric acid, it fuels digestion (Agni) without creating toxic Ama residues.'
  }
];

export async function fetchProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/products`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch');
    return await res.json();
  } catch (e) {
    return FALLBACK_PRODUCTS;
  }
}

export async function fetchBanner(): Promise<HeroBanner> {
  try {
    const res = await fetch(`${API_BASE_URL}/banner`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch');
    return await res.json();
  } catch (e) {
    return FALLBACK_BANNER;
  }
}

export async function fetchSettings(): Promise<SiteSettings> {
  try {
    const res = await fetch(`${API_BASE_URL}/settings`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch');
    return await res.json();
  } catch (e) {
    return FALLBACK_SETTINGS;
  }
}

export async function fetchFaqs(): Promise<FaqItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/faqs`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch');
    return await res.json();
  } catch (e) {
    return FALLBACK_FAQS;
  }
}

export async function fetchBlogs(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/blogs`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch');
    return await res.json();
  } catch (e) {
    return FALLBACK_BLOGS;
  }
}

export async function logOrder(orderData: Partial<OrderRecord>): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    return res.ok;
  } catch (e) {
    console.warn('Backend order logging skipped (running in offline/static mode)');
    return true;
  }
}
