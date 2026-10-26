export interface ProductOption {
  size: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  price: number;
  volume: string;
  weight?: string;
  package?: string;
  image: string;
  inStock: boolean;
  options?: ProductOption[];
  // Fallback compatibility fields
  fullName?: string;
  tagline?: string;
  badge?: string;
  badgeColor?: 'gold' | 'emerald' | 'amber';
  rating?: number;
  reviewsCount?: number;
  defaultVolume?: string;
  volumes?: Array<{ size: string; price: number; mrp?: number; savePercent?: number }>;
  features?: string[];
}

export interface BannerSlide {
  id: string;
  title?: string;
  subtitle?: string;
  image: string;
  mobileImage?: string;
  buttonText?: string;
  buttonLink?: string;
  alt?: string;
  link?: string;
}

export interface HeroBanner {
  slides: BannerSlide[];
  height: number; // default 591
  autoPlay: boolean;
  interval: number;
  announcementActive: boolean;
  announcementText: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  logo?: string;
  whatsappNumber: string;
  whatsappDisplay: string;
  callNumber: string;
  callNumberRaw: string;
  email: string;
  address: string;
  fssaiNumber: string;
  gstNumber?: string;
  currency: string;
  freeShippingThreshold: number;
  shippingFee: number;
  founderWhatsAppMessage: string;
  adminPin?: string;
  socialLinks: {
    instagram: string;
    facebook: string;
    youtube: string;
  };
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
}

export interface CartItem {
  cartId: string;
  productId: string;
  name: string;
  image: string;
  size: string;
  price: number;
  mrp?: number;
  quantity: number;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: string;
  categoryColor: string;
  readTime: string;
  date: string;
  image: string;
  excerpt: string;
  content: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
}

export interface OrderRecord {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  status: string;
  createdAt: string;
  source: string;
}
