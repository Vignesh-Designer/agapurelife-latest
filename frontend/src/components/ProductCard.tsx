'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Check, Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Format the pill text matching the user's reference image exactly (e.g. "910 gm, Bottle", "500ml Litre, Pouch")
  const getPillText = () => {
    const vol = (product.volume || '1 Litre').trim();
    const wt = (product.weight || '').trim();
    const pkg = (product.package || 'Bottle').trim();

    // Combine volume and weight cleanly
    let volWt = vol;
    if (wt && !vol.toLowerCase().endsWith(wt.toLowerCase())) {
      volWt = `${vol} ${wt}`;
    }

    return pkg ? `${volWt}, ${pkg}` : volWt;
  };

  const pillText = getPillText();
  const price = product.price || 200;
  const originalMrp = Math.round(price * 1.16);
  const packageTag = (product.package || 'Bottle').toUpperCase();

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      image: product.image,
      size: pillText,
      price: price,
      quantity: quantity
    });

    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
    }, 1800);
  };

  // Safe image path normalization
  const imageSrc = product.image?.startsWith('http://localhost:5000/uploads/')
    ? product.image.replace('http://localhost:5000/uploads/', '/uploads/')
    : product.image || '/images/refined-oil.jpg';

  const isDataUrl = imageSrc.startsWith('data:');

  return (
    <div className="bg-white rounded-3xl border border-[#EAE3D4]/90 p-4 sm:p-5 shadow-xs hover:shadow-xl hover:border-[#C5A059] transition-all duration-300 flex flex-col justify-between overflow-hidden group h-full">
      {/* 1. Product Image Area */}
      <div>
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#FAF7F2] p-2 flex items-center justify-center">
          {/* Top-left package tag matching reference images (e.g. BOTTLE, POUCH, TIN) */}
          <div className="absolute top-3 left-3 z-10">
            <span className="px-2.5 py-1 rounded-md bg-[#FCE8D5] text-[#7A4B1A] text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-2xs">
              {packageTag}
            </span>
          </div>

          {/* Top-right wishlist heart toggle */}
          <button
            type="button"
            onClick={() => setIsLiked(!isLiked)}
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#716B61] hover:text-red-500 hover:bg-white shadow-xs transition-colors cursor-pointer"
            aria-label="Save to wishlist"
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
          </button>

          {/* Product Image */}
          <div className="relative w-full h-full rounded-xl overflow-hidden flex items-center justify-center">
            {isDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageSrc}
                alt={`${product.name} - 100% Pure Cold-Pressed & Wood-Churned Edible Cooking Oil`}
                className="object-contain w-full h-full p-2 group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <Image
                src={imageSrc}
                alt={`${product.name} - 100% Pure Cold-Pressed & Wood-Churned Edible Cooking Oil`}
                fill
                className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            )}
          </div>
        </div>

        {/* 2. Title & Description */}
        <h3 className="font-bold text-lg sm:text-xl text-[#0F281E] leading-snug mt-3.5">
          {product.name}
        </h3>

        <p className="text-xs text-[#5C5C5C] mt-1.5 line-clamp-2 leading-relaxed">
          {product.description || 'Farm-fresh unrefined edible oil prepared with traditional care.'}
        </p>

        {/* 3. Volume Section matching reference image: exactly ONE dark green pill */}
        <div className="mt-3.5">
          <span className="block text-xs text-[#6B6357] font-medium mb-1.5">Volume:</span>
          <div className="px-4 py-2 rounded-lg bg-[#143828] text-white text-xs font-semibold inline-block">
            {pillText}
          </div>
        </div>
      </div>

      {/* 4. Bottom Divider, Pricing & Add to Cart Controls */}
      <div className="mt-4 pt-3 border-t border-[#EAE3D4]">
        {/* Price Row: Gold/Amber Current Price + Gray Strikethrough Original Price */}
        <div className="flex items-baseline mb-3">
          <span className="text-2xl sm:text-3xl font-extrabold text-[#C5922E]">
            ₹{price}
          </span>
          <span className="text-xs sm:text-sm text-gray-400 line-through ml-2.5 font-normal">
            ₹{originalMrp}
          </span>
        </div>

        {/* Action Row: Stepper on Left, Gold Add to Cart on Right */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Stepper matching reference image (light rounded pill) */}
          <div className="flex items-center bg-[#EBF1EB] text-[#1E3024] rounded-full px-3 py-1.5 gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="text-[#1E3024] hover:text-black font-bold text-sm w-4 flex items-center justify-center cursor-pointer"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="font-bold text-xs sm:text-sm min-w-[12px] text-center">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="text-[#1E3024] hover:text-black font-bold text-sm w-4 flex items-center justify-center cursor-pointer"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          {/* Add to Cart Button matching reference image (golden rounded pill) */}
          <button
            type="button"
            onClick={handleAddToCart}
            className={`flex-1 rounded-full py-2.5 px-4 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-sm cursor-pointer ${
              justAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-[#D4A74B] hover:bg-[#C2963B] active:scale-98 text-white'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4 text-white stroke-[2.5]" />
                <span>Added!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
