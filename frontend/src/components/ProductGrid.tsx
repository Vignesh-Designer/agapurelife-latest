'use client';

import React, { useState, useMemo } from 'react';
import { Product } from '@/lib/types';
import { ProductCard } from './ProductCard';
import { Search, ChevronDown, Sparkles, X, RefreshCw } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 6 exact product categories requested by user
  const categoriesList = [
    { label: 'Categories: All', value: 'All' },
    { label: 'Refined Palm Oil', value: 'Refined Palm Oil' },
    { label: 'Cold pressed Groundnut Oil', value: 'Cold pressed Groundnut Oil' },
    { label: 'Cold pressed Sunflower Oil', value: 'Cold pressed Sunflower Oil' },
    { label: 'Cold pressed Coconut Oil', value: 'Cold pressed Coconut Oil' },
    { label: 'Cold pressed Sesame Oil', value: 'Cold pressed Sesame Oil' },
    { label: 'Ghee', value: 'Ghee' }
  ];

  // Real-time filter by category and search query with ZERO RESTRICTION
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category matching
      const matchesCategory =
        selectedCategory === 'All' ||
        p.category?.toLowerCase() === selectedCategory.toLowerCase() ||
        p.name?.toLowerCase().includes(selectedCategory.toLowerCase());

      // Search matching
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        p.name?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const handleClearFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
  };

  return (
    <section id="products" className="py-14 sm:py-20 bg-[#FAF7F2] text-[#1A1A1A] relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header: H2 for Section Name (36px) and Single Primary H1 for Page SEO (16px) */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#143828] text-[#D4AF37] text-xs font-bold uppercase tracking-wider mb-2.5 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Farm-Fresh Traditional Extraction</span>
          </div>

          <h2 className="text-[36px] font-extrabold text-[#0F281E] tracking-tight leading-tight">
            Our Signature Edible Oils
          </h2>

          <h1 className="mt-2.5 text-[16px] font-normal text-[#6B6357] max-w-2xl mx-auto leading-relaxed">
            100% pure cold-pressed, wood-churned &amp; unrefined cooking oils. Select your preferred pure oil, choose volume, and order via WhatsApp directly from mill.
          </h1>
        </div>

        {/* Categories Filter & Search Bar */}
        <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-3 sm:p-4 mb-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Left: Category Selector Dropdown */}
          <div className="relative w-full sm:w-72">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full appearance-none bg-[#FAF7F2] hover:bg-[#F4EFE6] border border-gray-200 text-gray-800 text-xs sm:text-sm font-semibold rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:border-[#C5A059] cursor-pointer transition-colors"
            >
              {categoriesList.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Right: Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-gray-200 bg-[#FAF7F2] text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#C5A059] focus:bg-white transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 6 Oil Categories Quick Links Directly Below Filter Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2.5 px-1">
            <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#6B6357] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#C5A059] inline-block" />
              <span>Quick Category Links:</span>
            </div>
            {(selectedCategory !== 'All' || searchQuery) && (
              <button
                onClick={handleClearFilters}
                className="text-xs text-[#99752D] hover:text-[#143828] font-bold underline transition-colors flex items-center gap-1"
              >
                <span>Reset to All</span>
                <RefreshCw className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none sm:flex-wrap">
            {categoriesList.map((cat) => {
              const isSelected = selectedCategory.toLowerCase() === cat.value.toLowerCase();
              const count =
                cat.value === 'All'
                  ? products.length
                  : products.filter(
                      (p) =>
                        p.category?.toLowerCase() === cat.value.toLowerCase() ||
                        p.name?.toLowerCase().includes(cat.value.toLowerCase())
                    ).length;

              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`shrink-0 inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer shadow-xs ${
                    isSelected
                      ? 'bg-[#143828] text-[#F3E5AB] border-2 border-[#143828] shadow-md ring-2 ring-[#C5A059]/40'
                      : 'bg-white text-[#3D352A] border border-[#EAE3D4] hover:border-[#C5A059] hover:bg-[#F9F6F0]'
                  }`}
                >
                  <span>{cat.value === 'All' ? 'All Products' : cat.value}</span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full transition-colors ${
                      isSelected
                        ? 'bg-[#C5A059] text-[#143828]'
                        : 'bg-[#FAF7F2] text-[#716B61] border border-[#EAE3D4]'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Status Row */}
          <div className="flex items-center justify-between text-xs text-[#6B6357] mt-3 px-1">
            <div>
              Showing <strong className="text-[#143828] font-bold">{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'product' : 'products'}
              {selectedCategory !== 'All' && (
                <span> in <strong className="text-[#143828] font-bold">&ldquo;{selectedCategory}&rdquo;</strong></span>
              )}
              {searchQuery && (
                <span> matching &ldquo;<strong className="text-[#143828] font-bold">{searchQuery}</strong>&rdquo;</span>
              )}
            </div>
            {selectedCategory !== 'All' && (
              <button
                onClick={() => setSelectedCategory('All')}
                className="inline-flex items-center gap-1 text-xs text-[#99752D] hover:text-[#143828] font-bold"
              >
                <span>Clear filter</span>
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Empty Search State */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center max-w-lg mx-auto shadow-sm space-y-3">
            <Search className="w-10 h-10 text-gray-400 mx-auto" />
            <h3 className="text-lg font-bold text-gray-800">No matching oils found</h3>
            <p className="text-xs text-gray-500">
              No products found matching &ldquo;{searchQuery}&rdquo;. Try another keyword or reset the category filter.
            </p>
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 rounded-xl bg-[#143828] text-[#F3E5AB] text-xs font-bold inline-flex items-center gap-1.5 hover:bg-[#0F281E]"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        ) : (
          /* Products Display with NO RESTRICTION: Displays ALL products in an equal, responsive 3-column grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <div key={product.id} className="h-full">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
