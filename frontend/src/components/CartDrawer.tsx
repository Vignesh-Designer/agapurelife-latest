'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { SiteSettings } from '@/lib/types';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, MessageCircle } from 'lucide-react';
import { logOrder } from '@/lib/api';

interface CartDrawerProps {
  settings: SiteSettings;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ settings }) => {
  const {
    items,
    isOpen,
    setIsOpen,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    subtotal,
    shippingFee,
    finalTotal
  } = useCart();

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate WhatsApp Order Link
  const handleWhatsAppCheckout = async () => {
    if (items.length === 0) return;

    setIsSubmitting(true);

    const orderSummaryText = items
      .map((item, idx) => `${idx + 1}. *${item.name}* (${item.size}) × ${item.quantity} = ₹${item.price * item.quantity}`)
      .join('\n');

    const fullMessage = `🌿 *NEW ORDER FROM AGAPURELIFE.COM* 🌿\n\n${orderSummaryText}\n\n-------------------------------\n*Subtotal:* ₹${subtotal}\n*Shipping:* ${shippingFee === 0 ? 'FREE Express Delivery' : `₹${shippingFee}`}\n*Total Payable:* ₹${finalTotal}\n\n*Payment Mode:* COD / UPI on delivery\n_Please confirm my order and share batch dispatch details!_`;

    // Log to backend database
    try {
      await logOrder({
        customerName: 'WhatsApp Customer',
        customerPhone: settings.whatsappNumber,
        customerAddress: 'Shared directly on WhatsApp chat',
        items: items.map(i => ({
          productId: i.productId,
          name: i.name,
          size: i.size,
          price: i.price,
          quantity: i.quantity
        })),
        subtotal,
        shippingFee,
        total: finalTotal,
        source: 'WhatsApp Cart Drawer'
      });
    } catch (e) {
      console.error('Error logging order:', e);
    }

    setIsSubmitting(false);

    // Clean phone number for WhatsApp link
    const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const encodedMessage = encodeURIComponent(fullMessage);
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;

    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop: translucent on mobile, transparent click-through on large desktop so user can add more from left */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:bg-black/25 transition-opacity"
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Cart Drawer occupying ~30% right view */}
      <aside
        className="fixed top-0 right-0 h-full w-full sm:w-[420px] lg:w-[32%] xl:w-[30%] bg-[#FCFBF9] text-[#1A1A1A] z-50 shadow-2xl flex flex-col border-l border-[#E5DFC9] animate-in slide-in-from-right duration-300"
        role="dialog"
        aria-label="Shopping Cart"
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-[#EAE3D4] bg-[#F4EFE6] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#143828] text-[#D4AF37] flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif-luxury font-bold text-lg text-[#0F281E]">Your Pure Cart</h3>
                <span className="bg-[#C5A059] text-black text-xs font-bold px-2 py-0.5 rounded-full">
                  {totalItems}
                </span>
              </div>
              <p className="text-xs text-[#6B6357]">Added items show here. Add more on the left!</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-[#6B6357] hover:text-[#0F281E] hover:bg-[#EAE3D4] rounded-full transition-colors"
            aria-label="Close cart drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#716B61]">
              <div className="w-16 h-16 rounded-full bg-[#F4EFE6] flex items-center justify-center mb-4 text-[#C5A059]">
                <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
              </div>
              <p className="font-serif-luxury text-lg text-[#143828] font-bold">Your cart is empty</p>
              <p className="text-sm mt-1 mb-6 text-[#716B61]">Select your favorite cold-pressed oils on the left to begin your wellness journey.</p>
              <button
                onClick={() => setIsOpen(false)}
                className="px-5 py-2.5 bg-[#143828] text-[#F3E5AB] rounded-full text-xs font-bold tracking-wider uppercase hover:bg-[#0C1F17] transition-colors"
              >
                Browse Our Oils
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.cartId}
                className="bg-white border border-[#EAE3D4] rounded-xl p-3 sm:p-3.5 flex gap-3 shadow-xs hover:border-[#C5A059]/50 transition-colors"
              >
                <div className="w-18 h-18 sm:w-20 sm:h-20 relative rounded-lg overflow-hidden bg-[#FAF7F2] shrink-0 border border-[#EAE3D4]">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#143828] line-clamp-1 font-serif-luxury">
                        {item.name}
                      </h4>
                      <span className="inline-block mt-0.5 text-[11px] font-semibold px-2 py-0.5 bg-[#FAF7F2] text-[#99752D] rounded-md border border-[#EAE3D4]">
                        {item.size}
                      </span>
                    </div>
                    <button
                      onClick={() => removeItem(item.cartId)}
                      className="text-[#998F81] hover:text-red-600 p-1 transition-colors"
                      title="Remove oil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F4EFE6]">
                    <div className="flex items-center border border-[#DCD5C5] rounded-md bg-[#FAF7F2] overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                        className="px-2 py-1 text-[#4A4235] hover:bg-[#EAE3D4] transition-colors text-xs"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 py-0.5 text-xs font-bold text-[#143828] min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                        className="px-2 py-1 text-[#4A4235] hover:bg-[#EAE3D4] transition-colors text-xs"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-bold text-[#143828]">
                        ₹{item.price * item.quantity}
                      </div>
                      {item.mrp != null && item.mrp > item.price && (
                        <div className="text-[10px] text-[#8C8275] line-through">
                          ₹{item.mrp * item.quantity}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer & Checkout Actions */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 bg-[#F4EFE6] border-t border-[#EAE3D4] space-y-3">
            <div className="space-y-1.5 text-xs text-[#4A4235]">
              <div className="flex justify-between">
                <span>Subtotal ({totalItems} items):</span>
                <span className="font-semibold text-[#143828]">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Express Pan-India Shipping:</span>
                <span className="font-semibold text-[#143828]">
                  {shippingFee === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : `₹${shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between text-sm sm:text-base font-bold text-[#143828] pt-2 border-t border-[#DCD5C5]">
                <span>Total Amount:</span>
                <span className="font-serif-luxury text-base sm:text-lg text-[#0F281E]">₹{finalTotal}</span>
              </div>
            </div>

            {/* Order On WhatsApp Primary Button */}
            <button
              onClick={handleWhatsAppCheckout}
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-[#143828] via-[#1B4D3E] to-[#143828] hover:from-[#0C1F17] hover:to-[#0C1F17] text-[#FAF7F2] rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-[#143828]/25 border border-[#C5A059]/40 hover:border-[#D4AF37] transition-all transform active:scale-98"
            >
              <div className="w-6 h-6 rounded-full bg-[#25D366] text-white flex items-center justify-center">
                <MessageCircle className="w-4 h-4 fill-current" />
              </div>
              <span>Order via WhatsApp Now</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            {/* Trust and safety badges */}
            <div className="flex items-center justify-center gap-4 text-[10px] text-[#6B6357] pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#143828]" /> 100% Zero Adulteration
              </span>
              <span>•</span>
              <span>Cash on Delivery / UPI</span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
