'use client';

import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingBag, CheckCircle, ArrowRight, Clock, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { RESTAURANT_INFO } from '../lib/restaurantData';
import { Button } from './ui/Button';

export const CartDrawer: React.FC = () => {
  const {
    items,
    updateQuantity,
    clearCart,
    orderType,
    setOrderType,
    isCartOpen,
    setIsCartOpen,
    subtotal,
  } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [cookingNote, setCookingNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

  if (!isCartOpen) return null;

  const packagingFee = orderType === 'Takeaway' ? 20 : 0;
  const grandTotal = subtotal + packagingFee;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Please provide your name and contact phone number.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const orderId = `SJK-${Math.floor(1000 + Math.random() * 9000)}`;
      setIsSubmitting(false);
      setOrderSuccess(orderId);
      clearCart();
    }, 600);
  };

  const generateWhatsAppMessage = () => {
    const itemLines = items
      .map((ci) => `• ${ci.quantity}x ${ci.item.name} (₹${ci.item.price * ci.quantity})`)
      .join('\n');
    const msg = `*New ${orderType} Order - Spicy Junction Kitchen*\nName: ${customerName}\nPhone: ${customerPhone}\nType: ${orderType}\n\n*Items:*\n${itemLines}\n\n*Total:* ₹${grandTotal}\nNotes: ${cookingNote || 'None'}\nPickup Address: ${RESTAURANT_INFO.address.shop}, ${RESTAURANT_INFO.address.locality}`;
    return `https://wa.me/${RESTAURANT_INFO.contact.whatsapp}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-orange-600" />
              <h2 className="text-lg font-bold text-stone-900 font-display">
                Your Order Bag
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-lg transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {orderSuccess ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-stone-900 font-display">
                  Order Placed Successfully!
                </h3>
                <p className="text-sm text-stone-600 max-w-xs mx-auto">
                  Your reference ID is <strong className="text-stone-900">{orderSuccess}</strong>. The kitchen is preparing your fresh order.
                </p>
                <div className="p-4 bg-orange-50/70 rounded-xl border border-orange-200/80 text-left text-xs text-stone-700 space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-orange-950">
                    <Clock className="w-4 h-4 text-orange-600" />
                    <span>Estimated Ready: 15–20 mins</span>
                  </div>
                  <div className="flex items-start gap-2 text-stone-600">
                    <MapPin className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                    <span>{RESTAURANT_INFO.address.shop}, {RESTAURANT_INFO.address.street}, {RESTAURANT_INFO.address.locality}</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => {
                      setOrderSuccess(null);
                      setIsCartOpen(false);
                    }}
                  >
                    Done & Return to Menu
                  </Button>
                </div>
              </div>
            ) : items.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-16 h-16 bg-stone-100 text-stone-400 rounded-full flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-base font-semibold text-stone-900">Your bag is empty</p>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  Explore our Biryani, Solo specials, and crispy quick bite small plates to start your order.
                </p>
              </div>
            ) : (
              <>
                {/* Service Option Switcher */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Service Option
                  </div>
                  <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-lg gap-1">
                    <button
                      type="button"
                      onClick={() => setOrderType('Takeaway')}
                      className={`py-2 px-3 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                        orderType === 'Takeaway'
                          ? 'bg-white text-stone-900 shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      Takeaway (Pickup)
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderType('Dine-in')}
                      className={`py-2 px-3 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                        orderType === 'Dine-in'
                          ? 'bg-white text-stone-900 shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      Dine-in Pre-order
                    </button>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-stone-500">
                    <span>Selected Items</span>
                    <button
                      onClick={clearCart}
                      className="text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      Clear all
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {items.map(({ item, quantity }) => (
                      <div
                        key={item.id}
                        className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 flex items-start justify-between gap-3"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`w-2 h-2 rounded-xs shrink-0 ${
                                item.dietary === 'veg'
                                  ? 'bg-emerald-600 ring-2 ring-emerald-600/20'
                                  : 'bg-rose-600 ring-2 ring-rose-600/20'
                              }`}
                              title={item.dietary === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}
                            />
                            <h4 className="text-sm font-semibold text-stone-900 truncate">
                              {item.name}
                            </h4>
                          </div>
                          <div className="text-xs text-stone-500 mt-0.5">
                            ₹{item.price} each · {item.serves}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <div className="flex items-center border border-stone-300 rounded-lg bg-white overflow-hidden">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="p-1 hover:bg-stone-100 text-stone-600 transition-colors cursor-pointer"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-7 text-center text-xs font-bold text-stone-800 tabular-nums">
                              {quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="p-1 hover:bg-stone-100 text-stone-600 transition-colors cursor-pointer"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="text-sm font-bold text-stone-900 tabular-nums w-12 text-right">
                            ₹{item.price * quantity}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Checkout Details Form */}
                <form id="cart-form" onSubmit={handleCheckout} className="space-y-3 pt-2">
                  <div className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Contact & Kitchen Instructions
                  </div>

                  <div className="grid grid-cols-1 gap-2.5">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="e.g. +91 98490 00000"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Special Instructions (Optional)
                      </label>
                      <input
                        type="text"
                        value={cookingNote}
                        onChange={(e) => setCookingNote(e.target.value)}
                        placeholder="e.g. Extra salan, mild spice for kid"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                      />
                    </div>
                  </div>
                </form>
              </>
            )}
          </div>

          {/* Footer Calculations */}
          {items.length > 0 && !orderSuccess && (
            <div className="p-5 border-t border-stone-200 bg-stone-50/70 space-y-4">
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Items Subtotal</span>
                  <span className="tabular-nums font-medium text-stone-900">₹{subtotal}</span>
                </div>
                {orderType === 'Takeaway' && (
                  <div className="flex justify-between">
                    <span>Eco-friendly Food Container Box</span>
                    <span className="tabular-nums font-medium text-stone-900">₹{packagingFee}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-stone-900 pt-1 border-t border-stone-200">
                  <span>Grand Total</span>
                  <span className="tabular-nums text-orange-600">₹{grandTotal}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  variant="primary"
                  fullWidth
                  size="lg"
                  type="submit"
                  form="cart-form"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    'Confirming...'
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <span>Place {orderType} Order (₹{grandTotal})</span>
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>

                {customerName && customerPhone && (
                  <a
                    href={generateWhatsAppMessage()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors"
                  >
                    <span>Send Order directly via WhatsApp</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
