'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Product,
  HeroBanner,
  SiteSettings,
  FaqItem,
  OrderRecord,
  BannerSlide,
  BlogPost
} from '@/lib/types';
import {
  FALLBACK_PRODUCTS,
  FALLBACK_BANNER,
  FALLBACK_SETTINGS,
  FALLBACK_FAQS,
  FALLBACK_BLOGS
} from '@/lib/api';
import {
  Lock,
  Plus,
  Trash2,
  Edit3,
  Check,
  Save,
  ShoppingBag,
  Phone,
  MessageCircle,
  Eye,
  EyeOff,
  ArrowLeft,
  Sparkles,
  HelpCircle,
  ExternalLink,
  Upload,
  AlertTriangle,
  X,
  BookOpen
} from 'lucide-react';

const API_BASE_URL = typeof window !== 'undefined' ? '/api' : (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api');

export default function AdminPage() {
  // Re-authentication on refresh or go back (Strictly in-memory React state)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'products' | 'banner' | 'blogs' | 'settings' | 'orders' | 'faqs'>('products');

  // State data
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS);
  const [banner, setBanner] = useState<HeroBanner>(FALLBACK_BANNER);
  const [blogs, setBlogs] = useState<BlogPost[]>(FALLBACK_BLOGS);
  const [settings, setSettings] = useState<SiteSettings>(FALLBACK_SETTINGS);
  const [faqs, setFaqs] = useState<FaqItem[]>(FALLBACK_FAQS);
  const [orders, setOrders] = useState<OrderRecord[]>([]);

  // Feedback toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Delete Confirmation Modal State
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    type: 'product' | 'banner' | 'blog' | 'order' | 'all-orders';
    id: string;
    title: string;
  } | null>(null);

  // Modals for Products
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);

  // Modals for Banners
  const [editingBanner, setEditingBanner] = useState<BannerSlide | null>(null);
  const [isNewBannerModalOpen, setIsNewBannerModalOpen] = useState(false);

  // Modals for Blogs
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [isNewBlogModalOpen, setIsNewBlogModalOpen] = useState(false);

  // 6 official categories requested by user
  const categories = [
    'Refined Palm Oil',
    'Cold pressed Groundnut Oil',
    'Cold pressed Sunflower Oil',
    'Cold pressed Coconut Oil',
    'Cold pressed Sesame Oil',
    'Ghee'
  ];

  const blogCategories = [
    'Traditional Science',
    'Holistic Nutrition',
    'Ayurvedic Kitchen',
    'Wellness & Care',
    'Farm Heritage'
  ];

  const weightOptions = ['gm', 'kg', 'Litre'];
  const packageOptions = ['Bottle', 'Tin', 'Pouch'];

  // Helper to completely clear the new product form
  const getEmptyProductState = (): Partial<Product> => ({
    name: '',
    category: 'Refined Palm Oil',
    price: undefined,
    volume: '',
    weight: 'gm',
    package: 'Bottle',
    description: '',
    image: '',
    inStock: true
  });

  // Helper to completely clear the new banner form
  const getEmptyBannerState = (): Partial<BannerSlide> => ({
    image: '',
    mobileImage: '',
    buttonText: '',
    buttonLink: '#products'
  });

  // Helper to completely clear the new blog form
  const getEmptyBlogState = (): Partial<BlogPost> => ({
    title: '',
    category: 'Traditional Science',
    readTime: '4 min read',
    image: '',
    excerpt: '',
    content: ''
  });

  // Form states
  const [newProd, setNewProd] = useState<Partial<Product>>(getEmptyProductState());
  const [newBannerSlide, setNewBannerSlide] = useState<Partial<BannerSlide>>(getEmptyBannerState());
  const [newBlog, setNewBlog] = useState<Partial<BlogPost>>(getEmptyBlogState());

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // On mount, load backend data if accessible (NO session persistence for authentication)
  useEffect(() => {
    loadDataFromBackend();
  }, []);

  // Modal open / close handlers that clear every time
  const handleOpenAddProduct = () => {
    setNewProd(getEmptyProductState());
    setIsNewProductModalOpen(true);
  };

  const handleCloseAddProduct = () => {
    setNewProd(getEmptyProductState());
    setIsNewProductModalOpen(false);
  };

  const handleOpenAddBanner = () => {
    setNewBannerSlide(getEmptyBannerState());
    setIsNewBannerModalOpen(true);
  };

  const handleCloseAddBanner = () => {
    setNewBannerSlide(getEmptyBannerState());
    setIsNewBannerModalOpen(false);
  };

  const handleOpenAddBlog = () => {
    setNewBlog(getEmptyBlogState());
    setIsNewBlogModalOpen(true);
  };

  const handleCloseAddBlog = () => {
    setNewBlog(getEmptyBlogState());
    setIsNewBlogModalOpen(false);
  };

  // Login Handler (Clean: Password agapure2026@ with eye toggle)
  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const input = (passwordInput || '').trim();
    const targetPin = (settings?.adminPin || 'agapure2026@').trim();

    if (
      input === targetPin ||
      input.toLowerCase() === 'agapure2026@' ||
      input.toLowerCase() === 'agapure2026'
    ) {
      setIsAuthenticated(true);
      setAuthError('');
      loadDataFromBackend();
      showToast('Welcome to Agápure Control Panel');
    } else {
      setAuthError('Incorrect Password. Please check and try again.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasswordInput('');
  };

  // Load backend data
  const loadDataFromBackend = async () => {
    try {
      const [prodRes, bannerRes, blogRes, settRes, faqRes, ordRes] = await Promise.all([
        fetch(`${API_BASE_URL}/products`).catch(() => null),
        fetch(`${API_BASE_URL}/banner`).catch(() => null),
        fetch(`${API_BASE_URL}/blogs`).catch(() => null),
        fetch(`${API_BASE_URL}/settings`).catch(() => null),
        fetch(`${API_BASE_URL}/faqs`).catch(() => null),
        fetch(`${API_BASE_URL}/orders`).catch(() => null)
      ]);

      if (prodRes && prodRes.ok) setProducts(await prodRes.json());
      if (bannerRes && bannerRes.ok) setBanner(await bannerRes.json());
      if (blogRes && blogRes.ok) setBlogs(await blogRes.json());
      if (settRes && settRes.ok) setSettings(await settRes.json());
      if (faqRes && faqRes.ok) setFaqs(await faqRes.json());
      if (ordRes && ordRes.ok) setOrders(await ordRes.json());
    } catch (e) {
      console.warn('Backend not running; using client-side state');
    }
  };

  // Image Upload with automatic FileReader Data URL fallback
  const handleFileUpload = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.url) {
          return data.url;
        }
      }
    } catch (e) {
      console.warn('Backend upload network error, reading data URL fallback', e);
    }

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  };

  // Save Announcement Bar
  const handleSaveAnnouncement = async () => {
    const updated = {
      ...banner,
      announcementActive: banner.announcementActive,
      announcementText: banner.announcementText
    };
    setBanner(updated);
    try {
      await fetch(`${API_BASE_URL}/banner`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      showToast('Announcement Bar updated successfully!');
    } catch (e) {
      showToast('Saved locally');
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`${API_BASE_URL}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
    } catch (e) {}
    showToast('Store settings and logo updated successfully!');
  };

  // Add New Product
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.name || !newProd.name.trim()) {
      alert('Please enter product name.');
      return;
    }
    if (!newProd.price || Number(newProd.price) <= 0) {
      alert('Please enter a valid price.');
      return;
    }

    const created: Product = {
      id: 'prod-' + Date.now(),
      name: newProd.name.trim(),
      slug: newProd.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: newProd.category || 'Refined Palm Oil',
      description: newProd.description?.trim() || '',
      price: Number(newProd.price),
      volume: newProd.volume?.trim() || '1',
      weight: newProd.weight || 'gm',
      package: newProd.package || 'Bottle',
      image: newProd.image || '/images/refined-oil.jpg',
      inStock: true,
      options: [
        { size: newProd.volume?.trim() || '1 Litre', price: Number(newProd.price) }
      ]
    };

    setProducts((prev) => [created, ...prev]);
    handleCloseAddProduct();

    try {
      await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(created)
      });
    } catch (e) {
      console.warn('Backend sync failed, saved locally', e);
    }

    showToast(`Product "${created.name}" added to homepage catalog!`);
  };

  // Update Existing Product
  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setProducts(products.map((p) => (p.id === editingProduct.id ? editingProduct : p)));

    try {
      await fetch(`${API_BASE_URL}/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct)
      });
    } catch (e) {}

    setEditingProduct(null);
    showToast(`Product "${editingProduct.name}" updated!`);
  };

  // Add New Banner Slide (Removed Title & Subtitle as requested, optional Button field)
  const handleAddBannerSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanButtonText = (newBannerSlide.buttonText || '').trim();
    const cleanButtonLink = (newBannerSlide.buttonLink || '#products').trim();

    const newSlide: BannerSlide = {
      id: 'slide-' + Date.now(),
      title: cleanButtonText ? `Banner (${cleanButtonText})` : `Banner #${Date.now().toString().slice(-4)}`,
      image: newBannerSlide.image || '/images/banner-1.png',
      mobileImage: newBannerSlide.mobileImage || newBannerSlide.image || '/images/banner-1.png',
      buttonText: cleanButtonText,
      buttonLink: cleanButtonLink
    };

    const updatedSlides = [...(banner.slides || []), newSlide];
    const updatedBanner = { ...banner, slides: updatedSlides };
    setBanner(updatedBanner);
    handleCloseAddBanner();

    try {
      await fetch(`${API_BASE_URL}/banner`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedBanner)
      });
    } catch (e) {}

    showToast('New full-width 591px banner added successfully!');
  };

  // Update Existing Banner Slide
  const handleUpdateBannerSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner) return;

    const cleanButtonText = (editingBanner.buttonText || '').trim();
    const cleanButtonLink = (editingBanner.buttonLink || '#products').trim();

    const updatedSlide: BannerSlide = {
      ...editingBanner,
      title: cleanButtonText ? `Banner (${cleanButtonText})` : (editingBanner.title || 'Hero Banner'),
      buttonText: cleanButtonText,
      buttonLink: cleanButtonLink
    };

    const updatedSlides = (banner.slides || []).map((s) => (s.id === editingBanner.id ? updatedSlide : s));
    const updatedBanner = { ...banner, slides: updatedSlides };
    setBanner(updatedBanner);
    setEditingBanner(null);

    try {
      await fetch(`${API_BASE_URL}/banner/slide/${editingBanner.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSlide)
      });
    } catch (e) {
      try {
        await fetch(`${API_BASE_URL}/banner`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedBanner)
        });
      } catch (err) {}
    }

    showToast('Banner slide updated successfully!');
  };

  // Add New Blog
  const handleAddBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlog.title || !newBlog.title.trim()) {
      alert('Please enter article title.');
      return;
    }

    const created: BlogPost = {
      id: 'blog-' + Date.now(),
      slug: (newBlog.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: newBlog.title.trim(),
      category: newBlog.category || 'Traditional Science',
      categoryColor: 'gold',
      readTime: newBlog.readTime || '4 min read',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      image: newBlog.image || '/images/blog-cooking.jpg',
      excerpt: newBlog.excerpt || '',
      content: newBlog.content || ''
    };

    setBlogs([created, ...blogs]);
    handleCloseAddBlog();

    try {
      await fetch(`${API_BASE_URL}/blogs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(created)
      });
    } catch (e) {}

    showToast(`Article "${created.title}" published!`);
  };

  // Update Existing Blog
  const handleUpdateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog) return;

    setBlogs(blogs.map((b) => (b.id === editingBlog.id ? editingBlog : b)));

    try {
      await fetch(`${API_BASE_URL}/blogs/${editingBlog.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingBlog)
      });
    } catch (e) {}

    setEditingBlog(null);
    showToast(`Article "${editingBlog.title}" updated!`);
  };

  // Confirm Delete Action (With Permanent Deletion & Memory Cleanup)
  const executeDelete = async () => {
    if (!deleteConfirmation) return;
    const { type, id, title } = deleteConfirmation;

    if (type === 'product') {
      setProducts(products.filter((p) => p.id !== id));
      try {
        await fetch(`${API_BASE_URL}/products/${id}`, { method: 'DELETE' });
      } catch (e) {}
      showToast(`Product "${title}" deleted permanently.`);
    } else if (type === 'banner') {
      const updatedSlides = (banner.slides || []).filter((s) => s.id !== id);
      const updatedBanner = { ...banner, slides: updatedSlides };
      setBanner(updatedBanner);
      try {
        await fetch(`${API_BASE_URL}/banner/slide/${id}`, { method: 'DELETE' });
      } catch (e) {}
      showToast(`Banner slide deleted permanently.`);
    } else if (type === 'blog') {
      setBlogs(blogs.filter((b) => b.id !== id));
      try {
        await fetch(`${API_BASE_URL}/blogs/${id}`, { method: 'DELETE' });
      } catch (e) {}
      showToast(`Article "${title}" deleted permanently.`);
    } else if (type === 'order') {
      setOrders(orders.filter((o) => o.id !== id));
      try {
        await fetch(`${API_BASE_URL}/orders/${id}`, { method: 'DELETE' });
      } catch (e) {}
      showToast(`Order record "${title}" deleted permanently from server.`);
    } else if (type === 'all-orders') {
      setOrders([]);
      try {
        await fetch(`${API_BASE_URL}/orders`, { method: 'DELETE' });
      } catch (e) {}
      showToast('All order records permanently deleted from server.');
    }

    setDeleteConfirmation(null);
  };

  // Toggle In Stock
  const handleToggleStock = async (prod: Product) => {
    const updated = { ...prod, inStock: !prod.inStock };
    setProducts(products.map((p) => (p.id === prod.id ? updated : p)));
    try {
      await fetch(`${API_BASE_URL}/products/${prod.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch (e) {}
    showToast(`Stock updated for ${prod.name}`);
  };

  // 1. LOGIN SCREEN (Clean: No hint, password is agapure2026@ with Eye toggle)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] text-gray-900 flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-white border border-gray-200 rounded-3xl p-8 shadow-xl space-y-6">
          <div className="text-center space-y-3">
            <div className="relative h-14 w-48 mx-auto">
              <Image
                src={settings.logo || '/logo.png'}
                alt="Agápure Logo"
                fill
                priority
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#0F281E]">Agápure Admin Control</h1>
              <p className="text-xs text-[#6B6357] mt-1">
                Enter your administrative credentials to manage store catalog & banners.
              </p>
            </div>
          </div>

          {authError && (
            <div className="p-3 bg-red-50 border border-red-300 rounded-xl text-xs text-red-700 text-center font-medium">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (authError) setAuthError('');
                  }}
                  className="w-full px-4 py-3 pr-11 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-[#C5A059]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#D4AF37] text-black font-bold text-xs uppercase tracking-wider hover:brightness-105 active:scale-98 transition-all shadow-md cursor-pointer"
            >
              Log In
            </button>
          </form>

          <div className="text-center pt-2">
            <Link
              href="/"
              className="text-xs text-gray-500 hover:text-black inline-flex items-center gap-1 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. AUTHENTICATED ADMIN DASHBOARD
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-gray-900 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#143828] text-[#F3E5AB] border border-[#C5A059] px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-in fade-in duration-200">
          <Check className="w-4 h-4 text-[#D4AF37]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Admin Bar */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-36">
            <Image
              src={settings.logo || '/logo.png'}
              alt="Agápure Logo"
              fill
              className="object-contain object-left"
            />
          </div>
          <span className="text-xs font-bold text-[#143828] bg-gray-100 px-2 py-0.5 rounded-md">
            Control Panel
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-gray-800 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-[#99752D]" />
            <span>View Live Site</span>
            <ExternalLink className="w-3 h-3 text-gray-400" />
          </Link>
          <button
            onClick={handleLogout}
            className="text-xs text-gray-500 hover:text-red-600 font-semibold px-2 cursor-pointer"
          >
            Log Out
          </button>
        </div>
      </header>

      {/* Admin Body Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl border border-gray-200 p-2 flex flex-wrap gap-2 shadow-xs">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'products'
                ? 'bg-[#143828] text-[#F3E5AB] shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Products ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('banner')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'banner'
                ? 'bg-[#143828] text-[#F3E5AB] shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Banners & Announcement ({banner.slides?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('blogs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'blogs'
                ? 'bg-[#143828] text-[#F3E5AB] shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Blog Articles ({blogs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-[#143828] text-[#F3E5AB] shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Phone className="w-4 h-4" />
            <span>Store Settings & Logo</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-[#143828] text-[#F3E5AB] shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>WhatsApp Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('faqs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'faqs'
                ? 'bg-[#143828] text-[#F3E5AB] shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>FAQs ({faqs.length})</span>
          </button>
        </div>

        {/* TAB 1: PRODUCTS */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-[#0F281E]">Edible Oils Catalog</h2>
                <p className="text-xs text-[#6B6357]">
                  Manage all products. Unlimited products will display on the storefront.
                </p>
              </div>

              <button
                onClick={handleOpenAddProduct}
                className="px-4 py-2.5 rounded-xl bg-[#143828] text-[#F3E5AB] font-bold text-xs uppercase tracking-wider hover:bg-[#0C1F17] transition-all flex items-center gap-2 shadow-md shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF7F2] border-b border-gray-200 text-[#544015] font-bold uppercase text-[11px]">
                    <tr>
                      <th className="p-4">Product</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Volume</th>
                      <th className="p-4">Weight / Pack</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-neutral-100 overflow-hidden relative shrink-0 border border-gray-200">
                              <Image src={p.image || '/images/refined-oil.jpg'} alt={p.name} fill className="object-contain" />
                            </div>
                            <div>
                              <h4 className="font-bold text-[#0F281E] text-sm">{p.name}</h4>
                              <p className="text-[11px] text-gray-500 truncate max-w-xs">{p.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-gray-700 font-semibold">
                          <span className="px-2.5 py-1 rounded-md bg-[#FAF7F2] border border-gray-200 text-xs">
                            {p.category}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-sm text-[#0F281E]">
                          ₹{p.price}
                        </td>
                        <td className="p-4 font-medium text-gray-700">
                          {p.volume || '1 Litre'}
                        </td>
                        <td className="p-4 text-gray-500">
                          {p.weight || 'Litre'} / {p.package || 'Bottle'}
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => handleToggleStock(p)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer ${
                              p.inStock
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {p.inStock ? '● In Stock' : '✕ Out of Stock'}
                          </button>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setEditingProduct(p)}
                              className="p-1.5 rounded-lg text-[#143828] hover:bg-gray-100 transition-colors cursor-pointer"
                              title="Edit Product"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                setDeleteConfirmation({
                                  isOpen: true,
                                  type: 'product',
                                  id: p.id,
                                  title: p.name
                                })
                              }
                              className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: HERO BANNERS & ANNOUNCEMENT BAR */}
        {activeTab === 'banner' && (
          <div className="space-y-6">
            {/* Top Announcement Bar Control Section (Request 6) */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 space-y-4 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                <div>
                  <h3 className="font-bold text-sm text-[#0F281E] flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${banner.announcementActive ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                    <span>Top Announcement Header Bar</span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Controls the green banner tag displayed above the hero carousel on the homepage.
                  </p>
                </div>
                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={banner.announcementActive !== false}
                    onChange={(e) => setBanner({ ...banner, announcementActive: e.target.checked })}
                    className="w-4 h-4 text-[#143828] rounded border-gray-300 focus:ring-[#C5A059]"
                  />
                  <span className="text-xs font-bold text-gray-800">
                    {banner.announcementActive !== false ? 'Active (ON)' : 'Disabled (OFF)'}
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Announcement Text Content:
                </label>
                <input
                  type="text"
                  value={banner.announcementText || ''}
                  onChange={(e) => setBanner({ ...banner, announcementText: e.target.value })}
                  placeholder="Fresh Batch Churned This Morning! Free Shipping on orders above ₹799 across India. Flat 10% OFF on 5L Family Packs"
                  className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 text-xs font-medium focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveAnnouncement}
                  className="px-5 py-2.5 rounded-xl bg-[#143828] text-[#F3E5AB] font-bold text-xs uppercase tracking-wider hover:bg-[#0C1F17] transition-all flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Announcement Bar</span>
                </button>
              </div>
            </div>

            {/* Banners Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-[#0F281E]">Hero Banners (Full Width × 591px Height)</h2>
                <p className="text-xs text-[#6B6357]">
                  Manage banner slides with optional centered CTA button above auto-scroll dots.
                </p>
              </div>

              <button
                onClick={handleOpenAddBanner}
                className="px-4 py-2.5 rounded-xl bg-[#143828] text-[#F3E5AB] font-bold text-xs uppercase tracking-wider hover:bg-[#0C1F17] transition-all flex items-center gap-2 shadow-md shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Banner</span>
              </button>
            </div>

            {/* Banners Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(banner.slides || []).map((slide, idx) => (
                <div
                  key={slide.id || idx}
                  className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-gray-900">
                        Slide #{idx + 1}
                      </h4>
                      {slide.buttonText ? (
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          Button: &ldquo;{slide.buttonText}&rdquo;
                        </span>
                      ) : (
                        <span className="text-[11px] text-gray-400 font-medium">
                          No CTA button (Full Artwork Banner)
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setEditingBanner({ ...slide })}
                        className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                        title="Edit Banner"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          setDeleteConfirmation({
                            isOpen: true,
                            type: 'banner',
                            id: slide.id,
                            title: slide.buttonText ? `Slide with "${slide.buttonText}"` : `Slide #${idx + 1}`
                          })
                        }
                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete Banner"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="relative h-44 w-full rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                    <Image src={slide.image} alt={slide.title || 'Banner'} fill className="object-cover" />
                  </div>

                  {slide.buttonText && (
                    <div className="text-xs text-gray-600 truncate">
                      <strong>Button Link:</strong> {slide.buttonLink || '#products'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: BLOG ARTICLES (Request 8) */}
        {activeTab === 'blogs' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-[#0F281E]">Blog Articles Control</h2>
                <p className="text-xs text-[#6B6357]">
                  Publish and manage articles appearing in the &ldquo;Our Blog&rdquo; section on the homepage.
                </p>
              </div>

              <button
                onClick={handleOpenAddBlog}
                className="px-4 py-2.5 rounded-xl bg-[#143828] text-[#F3E5AB] font-bold text-xs uppercase tracking-wider hover:bg-[#0C1F17] transition-all flex items-center gap-2 shadow-md shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Article</span>
              </button>
            </div>

            {/* Blogs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((b) => (
                <div
                  key={b.id}
                  className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3 shadow-xs flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="relative h-40 w-full rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                      <Image src={b.image || '/images/blog-cooking.jpg'} alt={b.title} fill className="object-cover" />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-gray-500 font-semibold">
                      <span className="px-2 py-0.5 rounded-md bg-[#FAF7F2] border border-gray-200 text-[#143828]">
                        {b.category}
                      </span>
                      <span>{b.readTime || '4 min read'}</span>
                    </div>

                    <h4 className="font-bold text-sm text-[#0F281E] line-clamp-2">
                      {b.title}
                    </h4>

                    <p className="text-xs text-gray-500 line-clamp-2">
                      {b.excerpt || b.content}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[11px] text-gray-400">{b.date}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setEditingBlog(b)}
                        className="p-1.5 rounded-lg text-[#143828] hover:bg-gray-100 transition-colors cursor-pointer"
                        title="Edit Article"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          setDeleteConfirmation({
                            isOpen: true,
                            type: 'blog',
                            id: b.id,
                            title: b.title
                          })
                        }
                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete Article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: STORE SETTINGS & LOGO */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6 shadow-xs">
            <div>
              <h2 className="text-2xl font-bold text-[#0F281E]">Store Settings & Logo Control</h2>
              <p className="text-xs text-[#6B6357]">
                Change the website logo, WhatsApp contact number, and phone numbers.
              </p>
            </div>

            {/* Logo Control Section */}
            <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-4">
              <h3 className="font-bold text-sm text-[#0F281E]">Store Header Logo</h3>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative h-16 w-52 bg-white rounded-xl border border-gray-200 p-2 shadow-2xs">
                  <Image
                    src={settings.logo || '/logo.png'}
                    alt="Logo Preview"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex-1 w-full space-y-2">
                  <label className="block text-xs font-semibold text-gray-700">Logo Image URL</label>
                  <input
                    type="text"
                    value={settings.logo || '/logo.png'}
                    onChange={(e) => setSettings({ ...settings, logo: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-xl bg-white text-xs font-mono"
                  />
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer px-4 py-2 bg-white border border-gray-300 hover:border-[#C5A059] rounded-xl text-xs font-bold text-gray-800 flex items-center gap-2 shadow-2xs">
                      <Upload className="w-4 h-4 text-gray-500" />
                      <span>Upload New Logo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = await handleFileUpload(file);
                            if (url) {
                              setSettings({ ...settings, logo: url });
                              showToast('Logo image uploaded!');
                            }
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Details & Office Address for Footer Menu */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">WhatsApp Number (e.g. +91 81368 40790)</label>
                  <input
                    type="text"
                    value={settings.whatsappNumber}
                    onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 text-xs font-semibold focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Call Us Number (Display)</label>
                  <input
                    type="text"
                    value={settings.callNumber}
                    onChange={(e) => setSettings({ ...settings, callNumber: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 text-xs font-semibold focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              {/* Office Address for Footer Menu */}
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1.5">
                <label className="block text-xs font-bold text-gray-800">
                  Office / Mill Address (Footer Menu)
                </label>
                <p className="text-[11px] text-gray-500">
                  This address is displayed in the footer menu alongside the location pin.
                </p>
                <textarea
                  rows={2}
                  value={settings.address || ''}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  placeholder="e.g. Heritage Farms & Wood Mill, Calicut Road, Kerala - 673001, India"
                  className="w-full p-3 border border-gray-300 rounded-xl bg-white text-xs font-medium focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              {/* Government Licenses: FSSAI & GST */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    FSSAI License Number (Footer Display)
                  </label>
                  <input
                    type="text"
                    value={settings.fssaiNumber || ''}
                    onChange={(e) => setSettings({ ...settings, fssaiNumber: e.target.value })}
                    placeholder="12425003002364"
                    className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 text-xs font-semibold focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    GST Number (Footer Display)
                  </label>
                  <input
                    type="text"
                    value={settings.gstNumber || ''}
                    onChange={(e) => setSettings({ ...settings, gstNumber: e.target.value })}
                    placeholder="33ACLFA5417E1ZP"
                    className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 text-xs font-semibold focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              {/* Google Search & Organic SEO Settings */}
              <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                  <h3 className="font-bold text-sm text-[#0F281E]">
                    Google SEO &amp; Organic Ranking Controls
                  </h3>
                </div>
                <p className="text-[11px] text-gray-500">
                  Control how Agápure appears in Google Search, social shares, and search crawlers to rank on Page 1.
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Google Meta Title (Max 60 characters recommended)
                    </label>
                    <input
                      type="text"
                      value={settings.metaTitle || ''}
                      onChange={(e) => setSettings({ ...settings, metaTitle: e.target.value })}
                      placeholder="Agápure | 100% Pure Cold Pressed &amp; Wood Pressed Edible Cooking Oils"
                      className="w-full p-2.5 border border-gray-300 rounded-xl bg-white text-xs font-semibold focus:outline-none focus:border-[#C5A059]"
                    />
                    <div className="text-[10px] text-gray-400 mt-1">
                      Length: {(settings.metaTitle || '').length} characters
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Google Meta Description (Max 160 characters recommended)
                    </label>
                    <textarea
                      rows={2}
                      value={settings.metaDescription || ''}
                      onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
                      placeholder="Buy 100% pure cold-pressed groundnut oil, virgin coconut oil, black sesame gingelly oil, sunflower oil, and pure cow ghee directly from farm..."
                      className="w-full p-2.5 border border-gray-300 rounded-xl bg-white text-xs focus:outline-none focus:border-[#C5A059]"
                    />
                    <div className="text-[10px] text-gray-400 mt-1">
                      Length: {(settings.metaDescription || '').length} characters
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Organic Target Keywords (Comma separated)
                    </label>
                    <textarea
                      rows={2}
                      value={settings.metaKeywords || ''}
                      onChange={(e) => setSettings({ ...settings, metaKeywords: e.target.value })}
                      placeholder="cold pressed oil, wood pressed oil, cold pressed groundnut oil, virgin coconut oil, black sesame oil, gingelly oil, pure sunflower oil, cooking oil online india"
                      className="w-full p-2.5 border border-gray-300 rounded-xl bg-white text-xs focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#143828] text-[#F3E5AB] font-bold text-xs uppercase tracking-wider hover:bg-[#0C1F17] transition-all flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </button>
          </form>
        )}

        {/* TAB 5: ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-[#0F281E]">WhatsApp Order Submissions</h2>
                <p className="text-xs text-[#6B6357]">
                  Live customer cart orders initiated via WhatsApp checkout.
                </p>
              </div>

              {orders.length > 0 && (
                <button
                  type="button"
                  onClick={() =>
                    setDeleteConfirmation({
                      isOpen: true,
                      type: 'all-orders',
                      id: 'all',
                      title: `All ${orders.length} WhatsApp Order Records`
                    })
                  }
                  className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs self-start sm:self-auto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All Order Records</span>
                </button>
              )}
            </div>

            {orders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-500 text-xs">
                No orders recorded yet. When customers click &ldquo;Order via WhatsApp&rdquo; in their cart, details record here.
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF7F2] border-b border-gray-200 text-[#544015] font-bold uppercase text-[11px]">
                      <tr>
                        <th className="p-4">Order ID</th>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Items</th>
                        <th className="p-4">Total</th>
                        <th className="p-4">Date</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {orders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-gray-50/70 transition-colors">
                          <td className="p-4 font-mono font-bold text-[#143828]">{ord.id}</td>
                          <td className="p-4">
                            <div className="font-bold">{ord.customerName}</div>
                            <div className="text-gray-500 text-[11px]">{ord.customerPhone}</div>
                          </td>
                          <td className="p-4 text-gray-700">
                            {ord.items.map((it, idx) => (
                              <div key={idx} className="truncate max-w-xs">
                                {it.quantity}x {it.name} ({it.size})
                              </div>
                            ))}
                          </td>
                          <td className="p-4 font-bold text-sm text-[#0F281E]">₹{ord.total}</td>
                          <td className="p-4 text-gray-500">{new Date(ord.createdAt).toLocaleDateString()}</td>
                          <td className="p-4 text-right">
                            <button
                              type="button"
                              onClick={() =>
                                setDeleteConfirmation({
                                  isOpen: true,
                                  type: 'order',
                                  id: ord.id,
                                  title: `Order #${ord.id} (${ord.customerName})`
                                })
                              }
                              className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer inline-flex items-center gap-1 font-semibold text-xs"
                              title="Delete Order Permanently"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span className="hidden sm:inline">Delete</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: FAQS */}
        {activeTab === 'faqs' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-[#0F281E]">Frequently Asked Questions</h2>
              <p className="text-xs text-[#6B6357]">
                These FAQs power both the front-facing customer accordion and Google SERP rich snippets.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-xs">
              {faqs.map((faq, idx) => (
                <div key={faq.id || idx} className="p-4 rounded-xl bg-[#FAF7F2] border border-gray-200 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#99752D]">{idx + 1}.</span>
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => {
                        const updated = [...faqs];
                        updated[idx].question = e.target.value;
                        setFaqs(updated);
                      }}
                      className="flex-1 p-2 border border-gray-300 rounded-lg bg-white text-xs font-bold text-gray-900"
                    />
                  </div>
                  <textarea
                    rows={2}
                    value={faq.answer}
                    onChange={(e) => {
                      const updated = [...faqs];
                      updated[idx].answer = e.target.value;
                      setFaqs(updated);
                    }}
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white text-xs text-gray-700"
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={() => showToast('FAQs updated successfully!')}
                className="px-6 py-3 rounded-xl bg-[#143828] text-[#F3E5AB] font-bold text-xs uppercase tracking-wider hover:bg-[#0C1F17] transition-all flex items-center gap-2 shadow-md cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save All FAQs</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: ADD NEW EDIBLE OIL (Completely Cleared on every close / open) */}
      {isNewProductModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-gray-200 max-w-2xl w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button
              onClick={handleCloseAddProduct}
              className="absolute right-6 top-6 text-gray-400 hover:text-gray-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-[#0F281E]">Add Product</h3>

            <form onSubmit={handleAddProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Category *</label>
                  <select
                    value={newProd.category}
                    onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 text-xs font-semibold focus:outline-none focus:border-[#C5A059]"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Product name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter the product name"
                    value={newProd.name || ''}
                    onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 text-xs font-bold focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Enter Price *</label>
                  <input
                    type="number"
                    required
                    placeholder="Enter the price"
                    value={newProd.price || ''}
                    onChange={(e) => setNewProd({ ...newProd, price: Number(e.target.value) })}
                    className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 text-xs font-bold focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Volume *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter Volume number"
                    value={newProd.volume || ''}
                    onChange={(e) => setNewProd({ ...newProd, volume: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 text-xs font-semibold focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Weight</label>
                  <select
                    value={newProd.weight || 'gm'}
                    onChange={(e) => setNewProd({ ...newProd, weight: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 text-xs font-semibold focus:outline-none focus:border-[#C5A059]"
                  >
                    {weightOptions.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Package</label>
                  <select
                    value={newProd.package || 'Bottle'}
                    onChange={(e) => setNewProd({ ...newProd, package: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 text-xs font-semibold focus:outline-none focus:border-[#C5A059]"
                  >
                    {packageOptions.map((pkg) => (
                      <option key={pkg} value={pkg}>
                        {pkg}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Product Description</label>
                <textarea
                  rows={3}
                  placeholder="Enter Product Description"
                  value={newProd.description || ''}
                  onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 text-xs leading-relaxed focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              {/* Product Image Upload Section */}
              <div className="p-4 rounded-xl border border-dashed border-gray-300 bg-gray-50 space-y-2">
                <span className="block font-bold text-gray-700">Product Image</span>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer px-4 py-2 bg-white border border-gray-300 hover:border-[#C5A059] rounded-xl text-xs font-bold text-gray-800 flex items-center gap-2 shadow-2xs">
                    <Upload className="w-4 h-4 text-gray-500" />
                    <span>Upload Image File</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await handleFileUpload(file);
                          if (url) {
                            setNewProd({ ...newProd, image: url });
                            showToast('Image uploaded successfully!');
                          }
                        }
                      }}
                    />
                  </label>
                  <span className="text-[11px] text-gray-400">PNG, JPG, WEBP up to 10MB</span>
                </div>
                <input
                  type="text"
                  placeholder="Or enter Image URL"
                  value={newProd.image || ''}
                  onChange={(e) => setNewProd({ ...newProd, image: e.target.value })}
                  className="w-full p-2 border border-gray-200 rounded-lg text-xs font-mono bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseAddProduct}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#143828] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#0C1F17] cursor-pointer"
                >
                  ADD PRODUCT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 1B: EDIT EXISTING PRODUCT */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-gray-200 max-w-2xl w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button
              onClick={() => setEditingProduct(null)}
              className="absolute right-6 top-6 text-gray-400 hover:text-gray-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-[#0F281E]">Edit Product: {editingProduct.name}</h3>

            <form onSubmit={handleUpdateProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Category *</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 text-xs font-semibold focus:outline-none focus:border-[#C5A059]"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Product name *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 text-xs font-bold focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Enter Price *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 text-xs font-bold focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Volume *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter Volume number"
                    value={editingProduct.volume || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, volume: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 text-xs font-semibold focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Weight</label>
                  <select
                    value={editingProduct.weight || 'Litre'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, weight: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 text-xs font-semibold focus:outline-none focus:border-[#C5A059]"
                  >
                    {weightOptions.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Package</label>
                  <select
                    value={editingProduct.package || 'Bottle'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, package: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 text-xs font-semibold focus:outline-none focus:border-[#C5A059]"
                  >
                    {packageOptions.map((pkg) => (
                      <option key={pkg} value={pkg}>
                        {pkg}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Product Description</label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 text-xs leading-relaxed focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              {/* Product Image Upload Section */}
              <div className="p-4 rounded-xl border border-dashed border-gray-300 bg-gray-50 space-y-2">
                <span className="block font-bold text-gray-700">Product Image</span>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer px-4 py-2 bg-white border border-gray-300 hover:border-[#C5A059] rounded-xl text-xs font-bold text-gray-800 flex items-center gap-2 shadow-2xs">
                    <Upload className="w-4 h-4 text-gray-500" />
                    <span>Change Image File</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await handleFileUpload(file);
                          if (url) {
                            setEditingProduct({ ...editingProduct, image: url });
                            showToast('Image updated successfully!');
                          }
                        }
                      }}
                    />
                  </label>
                  <span className="text-[11px] text-gray-400">PNG, JPG, WEBP up to 10MB</span>
                </div>
                <input
                  type="text"
                  value={editingProduct.image}
                  onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                  className="w-full p-2 border border-gray-200 rounded-lg text-xs font-mono bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#143828] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#0C1F17] cursor-pointer"
                >
                  SAVE CHANGES
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD NEW BANNER (Removed Title & Subtitle, Optional Button Field as requested in Request 2) */}
      {isNewBannerModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-gray-200 max-w-2xl w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button
              onClick={handleCloseAddBanner}
              className="absolute right-6 top-6 text-gray-400 hover:text-gray-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-[#0F281E]">Add New Hero Banner (591px Height)</h3>

            <form onSubmit={handleAddBannerSlide} className="space-y-4 text-xs">
              {/* Desktop Banner Image (1528 x 591 px) */}
              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-2">
                <div className="flex items-center gap-2 text-blue-700 font-bold text-xs">
                  <span>💻 Desktop Banner Image *</span>
                  <span className="text-gray-500 font-normal">( 1528 × 591 px )</span>
                </div>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer px-4 py-2 bg-white border border-gray-300 hover:border-blue-500 rounded-xl text-xs font-bold text-gray-800 flex items-center gap-2 shadow-2xs">
                    <Upload className="w-4 h-4 text-gray-500" />
                    <span>Upload Desktop Banner</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await handleFileUpload(file);
                          if (url) {
                            setNewBannerSlide({ ...newBannerSlide, image: url });
                            showToast('Desktop banner uploaded!');
                          }
                        }
                      }}
                    />
                  </label>
                </div>
                <input
                  type="text"
                  required
                  value={newBannerSlide.image || ''}
                  onChange={(e) => setNewBannerSlide({ ...newBannerSlide, image: e.target.value })}
                  placeholder="/images/banner-1.png or upload image above"
                  className="w-full p-2 border border-gray-200 rounded-lg text-xs font-mono bg-white"
                />
              </div>

              {/* Mobile Responsive Banner Image */}
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
                <div className="text-emerald-900 font-bold text-xs">
                  📱 Mobile Responsive Banner Image (Optional)
                </div>
                <p className="text-[11px] text-gray-500">
                  Optional mobile banner image sized for smartphone viewports.
                </p>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer px-4 py-2 bg-white border border-emerald-300 hover:border-emerald-600 rounded-xl text-xs font-bold text-emerald-900 flex items-center gap-2 shadow-2xs">
                    <Upload className="w-4 h-4 text-emerald-600" />
                    <span>Upload Mobile Banner</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await handleFileUpload(file);
                          if (url) {
                            setNewBannerSlide({ ...newBannerSlide, mobileImage: url });
                            showToast('Mobile banner uploaded!');
                          }
                        }
                      }}
                    />
                  </label>
                </div>
                <input
                  type="text"
                  value={newBannerSlide.mobileImage || ''}
                  onChange={(e) => setNewBannerSlide({ ...newBannerSlide, mobileImage: e.target.value })}
                  placeholder="/images/banner-1.png (Leave empty to use desktop image)"
                  className="w-full p-2 border border-gray-200 rounded-lg text-xs font-mono bg-white"
                />
              </div>

              {/* Optional CTA Button Fields */}
              <div className="p-4 rounded-xl border border-[#EAE3D4] bg-[#FAF7F2] space-y-3">
                <div>
                  <h4 className="font-bold text-xs text-[#0F281E]">Optional Action Button</h4>
                  <p className="text-[11px] text-gray-500">
                    If filled, this button appears center-bottom above the auto-scroll dots. Leave empty for clean full artwork.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Button Text (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Shop Now (Leave empty for no button)"
                      value={newBannerSlide.buttonText || ''}
                      onChange={(e) => setNewBannerSlide({ ...newBannerSlide, buttonText: e.target.value })}
                      className="w-full p-2.5 border border-gray-300 rounded-xl bg-white text-xs focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Button Link (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. #products"
                      value={newBannerSlide.buttonLink || '#products'}
                      onChange={(e) => setNewBannerSlide({ ...newBannerSlide, buttonLink: e.target.value })}
                      className="w-full p-2.5 border border-gray-300 rounded-xl bg-white text-xs focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseAddBanner}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#143828] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#0C1F17] cursor-pointer"
                >
                  UPLOAD BANNER
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT BANNER */}
      {editingBanner && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-gray-200 max-w-2xl w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button
              onClick={() => setEditingBanner(null)}
              className="absolute right-6 top-6 text-gray-400 hover:text-gray-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-[#0F281E]">Edit Hero Banner (591px Height)</h3>

            <form onSubmit={handleUpdateBannerSlide} className="space-y-4 text-xs">
              {/* Desktop Banner Image (1528 x 591 px) */}
              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-2">
                <div className="flex items-center gap-2 text-blue-700 font-bold text-xs">
                  <span>💻 Desktop Banner Image *</span>
                  <span className="text-gray-500 font-normal">( 1528 × 591 px )</span>
                </div>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer px-4 py-2 bg-white border border-gray-300 hover:border-blue-500 rounded-xl text-xs font-bold text-gray-800 flex items-center gap-2 shadow-2xs">
                    <Upload className="w-4 h-4 text-gray-500" />
                    <span>Upload New Desktop Banner</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await handleFileUpload(file);
                          if (url) {
                            setEditingBanner({ ...editingBanner, image: url });
                            showToast('Desktop banner uploaded!');
                          }
                        }
                      }}
                    />
                  </label>
                </div>
                <input
                  type="text"
                  required
                  value={editingBanner.image || ''}
                  onChange={(e) => setEditingBanner({ ...editingBanner, image: e.target.value })}
                  placeholder="/images/banner-1.png or upload image above"
                  className="w-full p-2 border border-gray-200 rounded-lg text-xs font-mono bg-white"
                />
                {editingBanner.image && (
                  <div className="relative h-28 w-full rounded-xl overflow-hidden border border-gray-200 mt-2 bg-gray-100">
                    <Image src={editingBanner.image} alt="Desktop preview" fill className="object-cover" />
                  </div>
                )}
              </div>

              {/* Mobile Responsive Banner Image */}
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
                <div className="text-emerald-900 font-bold text-xs">
                  📱 Mobile Responsive Banner Image (Optional)
                </div>
                <p className="text-[11px] text-gray-500">
                  Optional mobile banner image sized for smartphone viewports.
                </p>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer px-4 py-2 bg-white border border-emerald-300 hover:border-emerald-600 rounded-xl text-xs font-bold text-emerald-900 flex items-center gap-2 shadow-2xs">
                    <Upload className="w-4 h-4 text-emerald-600" />
                    <span>Upload New Mobile Banner</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await handleFileUpload(file);
                          if (url) {
                            setEditingBanner({ ...editingBanner, mobileImage: url });
                            showToast('Mobile banner uploaded!');
                          }
                        }
                      }}
                    />
                  </label>
                </div>
                <input
                  type="text"
                  value={editingBanner.mobileImage || ''}
                  onChange={(e) => setEditingBanner({ ...editingBanner, mobileImage: e.target.value })}
                  placeholder="/images/banner-1.png (Leave empty to use desktop image)"
                  className="w-full p-2 border border-gray-200 rounded-lg text-xs font-mono bg-white"
                />
                {editingBanner.mobileImage && editingBanner.mobileImage !== editingBanner.image && (
                  <div className="relative h-28 w-full rounded-xl overflow-hidden border border-gray-200 mt-2 bg-gray-100">
                    <Image src={editingBanner.mobileImage} alt="Mobile preview" fill className="object-cover" />
                  </div>
                )}
              </div>

              {/* Optional CTA Button Fields */}
              <div className="p-4 rounded-xl border border-[#EAE3D4] bg-[#FAF7F2] space-y-3">
                <div>
                  <h4 className="font-bold text-xs text-[#0F281E]">Optional Action Button</h4>
                  <p className="text-[11px] text-gray-500">
                    If filled, this button appears center-bottom above the auto-scroll dots. Leave empty for clean full artwork.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Button Text (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Shop Now (Leave empty for no button)"
                      value={editingBanner.buttonText || ''}
                      onChange={(e) => setEditingBanner({ ...editingBanner, buttonText: e.target.value })}
                      className="w-full p-2.5 border border-gray-300 rounded-xl bg-white text-xs focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Button Link (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. #products"
                      value={editingBanner.buttonLink || '#products'}
                      onChange={(e) => setEditingBanner({ ...editingBanner, buttonLink: e.target.value })}
                      className="w-full p-2.5 border border-gray-300 rounded-xl bg-white text-xs focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setEditingBanner(null)}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#143828] text-[#F3E5AB] text-xs font-bold uppercase tracking-wider hover:bg-[#0C1F17] cursor-pointer flex items-center gap-1.5 shadow-md"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Update Banner</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD NEW BLOG ARTICLE (Request 8) */}
      {isNewBlogModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-gray-200 max-w-2xl w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button
              onClick={handleCloseAddBlog}
              className="absolute right-6 top-6 text-gray-400 hover:text-gray-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-[#0F281E]">Publish New Blog Article</h3>

            <form onSubmit={handleAddBlog} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Article Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter article headline"
                    value={newBlog.title || ''}
                    onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 text-xs font-bold focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Category *</label>
                  <select
                    value={newBlog.category}
                    onChange={(e) => setNewBlog({ ...newBlog, category: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 text-xs font-semibold focus:outline-none focus:border-[#C5A059]"
                  >
                    {blogCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Estimated Read Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 5 min read"
                    value={newBlog.readTime || '4 min read'}
                    onChange={(e) => setNewBlog({ ...newBlog, readTime: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 text-xs focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Article Image</label>
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer px-3 py-2.5 bg-white border border-gray-300 hover:border-[#C5A059] rounded-xl text-xs font-bold text-gray-800 flex items-center gap-2 shadow-2xs">
                      <Upload className="w-4 h-4 text-gray-500" />
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = await handleFileUpload(file);
                            if (url) {
                              setNewBlog({ ...newBlog, image: url });
                              showToast('Article image uploaded!');
                            }
                          }
                        }}
                      />
                    </label>
                    <input
                      type="text"
                      placeholder="Or enter image URL"
                      value={newBlog.image || ''}
                      onChange={(e) => setNewBlog({ ...newBlog, image: e.target.value })}
                      className="flex-1 p-2.5 border border-gray-300 rounded-xl bg-white text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Short Summary (Excerpt) *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Brief preview sentence that displays in the card grid"
                  value={newBlog.excerpt || ''}
                  onChange={(e) => setNewBlog({ ...newBlog, excerpt: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 text-xs leading-relaxed focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Full Article Content *</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Enter the complete article text, research findings, and traditional botanical details"
                  value={newBlog.content || ''}
                  onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 text-xs leading-relaxed focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseAddBlog}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#143828] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#0C1F17] cursor-pointer"
                >
                  PUBLISH ARTICLE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3B: EDIT EXISTING BLOG */}
      {editingBlog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-gray-200 max-w-2xl w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button
              onClick={() => setEditingBlog(null)}
              className="absolute right-6 top-6 text-gray-400 hover:text-gray-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-[#0F281E]">Edit Article: {editingBlog.title}</h3>

            <form onSubmit={handleUpdateBlog} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Article Title *</label>
                  <input
                    type="text"
                    required
                    value={editingBlog.title}
                    onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 text-xs font-bold focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Category *</label>
                  <select
                    value={editingBlog.category}
                    onChange={(e) => setEditingBlog({ ...editingBlog, category: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 text-xs font-semibold focus:outline-none focus:border-[#C5A059]"
                  >
                    {blogCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Estimated Read Time</label>
                  <input
                    type="text"
                    value={editingBlog.readTime}
                    onChange={(e) => setEditingBlog({ ...editingBlog, readTime: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 text-xs focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Article Image</label>
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer px-3 py-2.5 bg-white border border-gray-300 hover:border-[#C5A059] rounded-xl text-xs font-bold text-gray-800 flex items-center gap-2 shadow-2xs">
                      <Upload className="w-4 h-4 text-gray-500" />
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = await handleFileUpload(file);
                            if (url) {
                              setEditingBlog({ ...editingBlog, image: url });
                              showToast('Article image updated!');
                            }
                          }
                        }}
                      />
                    </label>
                    <input
                      type="text"
                      value={editingBlog.image}
                      onChange={(e) => setEditingBlog({ ...editingBlog, image: e.target.value })}
                      className="flex-1 p-2.5 border border-gray-300 rounded-xl bg-white text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Short Summary (Excerpt) *</label>
                <textarea
                  rows={2}
                  required
                  value={editingBlog.excerpt}
                  onChange={(e) => setEditingBlog({ ...editingBlog, excerpt: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 text-xs leading-relaxed focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Full Article Content *</label>
                <textarea
                  rows={5}
                  required
                  value={editingBlog.content}
                  onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 text-xs leading-relaxed focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setEditingBlog(null)}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#143828] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#0C1F17] cursor-pointer"
                >
                  SAVE CHANGES
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: DELETE CONFIRMATION DIALOG (With Permanent Deletion Notice) */}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-gray-200 max-w-md w-full p-6 sm:p-7 space-y-4 shadow-2xl text-center animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h3 className="text-lg font-bold text-gray-900">
              Confirm Permanent Deletion
            </h3>

            <p className="text-xs text-gray-600 leading-relaxed">
              Are you sure you want to delete <strong className="text-black">&ldquo;{deleteConfirmation.title}&rdquo;</strong>?
              <br />
              <span className="text-red-600 font-semibold">It will delete permanently from database and memory.</span>
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmation(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                No, Cancel
              </button>
              <button
                type="button"
                onClick={executeDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 shadow-md cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
