'use client';

import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingBag, ArrowRight, MapPin, Clock, MessageSquare, History } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { restaurantConfig } from '../config/restaurant.config';
import { formatPrice } from '../lib/restaurantData';
import { Button } from './ui/Button';

export const CartDrawer: React.FC = () => {
  const {
    items,
    updateQuantity,
    updateItemInstruction,
    clearCart,
    orderType,
    setOrderType,
    isCartOpen,
    setIsCartOpen,
    subtotal,
    packagingFee,
    taxAmount,
    grandTotal,
    placeOrder,
    setActiveOrder,
  } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [cookingNote, setCookingNote] = useState('');
  const [fulfillmentTime, setFulfillmentTime] = useState('ASAP (15–20 mins)');
  const [paymentMethod, setPaymentMethod] = useState<'pay_at_counter' | 'upi_qr'>('pay_at_counter');
  const [editingNoteItemId, setEditingNoteItemId] = useState<string | null>(null);
  const [itemNoteText, setItemNoteText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  if (!isCartOpen) return null;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    if (!customerName.trim() || !customerPhone.trim()) {
      setFormError('Please enter your name and phone number to complete order.');
      return;
    }

    setFormError(null);
    setIsSubmitting(true);
    setTimeout(() => {
      const order = placeOrder({
        customer: {
          name: customerName.trim(),
          phone: customerPhone.trim(),
          notes: cookingNote.trim(),
        },
        fulfillmentTime,
        paymentMethod,
        paymentStatus: paymentMethod === 'pay_at_counter' ? 'pending_at_counter' : 'paid',
      });
      setIsSubmitting(false);
      setIsCartOpen(false);
      setActiveOrder(order);
    }, 450);
  };

  const saveItemNote = (itemId: string) => {
    updateItemInstruction(itemId, itemNoteText);
    setEditingNoteItemId(null);
    setItemNoteText('');
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
          <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
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
            {items.length === 0 ? (
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
                    <span>Selected Items ({items.length})</span>
                    <button
                      onClick={clearCart}
                      className="text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      Clear all
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {items.map(({ item, quantity, specialInstructions }) => (
                      <div
                        key={item.id}
                        className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 space-y-2"
                      >
                        <div className="flex items-start justify-between gap-3">
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
                              {formatPrice(item.price)} each · {item.serves}
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
                            <div className="text-sm font-bold text-stone-900 tabular-nums w-14 text-right">
                              {formatPrice(item.price * quantity)}
                            </div>
                          </div>
                        </div>

                        {/* Special Instruction per dish */}
                        {specialInstructions && editingNoteItemId !== item.id && (
                          <div className="text-[11px] text-orange-800 bg-orange-50 px-2 py-1 rounded border border-orange-200/60 flex items-center justify-between">
                            <span>Note: {specialInstructions}</span>
                            <button
                              onClick={() => {
                                setEditingNoteItemId(item.id);
                                setItemNoteText(specialInstructions);
                              }}
                              className="underline hover:text-orange-950 ml-2"
                            >
                              Edit
                            </button>
                          </div>
                        )}

                        {editingNoteItemId === item.id ? (
                          <div className="flex items-center gap-1.5 pt-1">
                            <input
                              type="text"
                              value={itemNoteText}
                              onChange={(e) => setItemNoteText(e.target.value)}
                              placeholder="e.g. Mild spice, extra salan"
                              className="text-xs px-2 py-1 border border-stone-300 rounded-md flex-1"
                            />
                            <button
                              onClick={() => saveItemNote(item.id)}
                              className="text-xs font-semibold px-2 py-1 bg-stone-900 text-white rounded-md"
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          !specialInstructions && (
                            <button
                              onClick={() => {
                                setEditingNoteItemId(item.id);
                                setItemNoteText('');
                              }}
                              className="text-[11px] text-stone-500 hover:text-orange-600 flex items-center gap-1"
                            >
                              <MessageSquare className="w-3 h-3" />
                              <span>Add cooking note</span>
                            </button>
                          )
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Checkout Details Form */}
                <form id="cart-drawer-form" onSubmit={handleCheckout} className="space-y-3 pt-2">
                  <div className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Contact & Pickup Schedule
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
                        Pickup / Dining Time
                      </label>
                      <select
                        value={fulfillmentTime}
                        onChange={(e) => setFulfillmentTime(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                      >
                        <option value="ASAP (15–20 mins)">ASAP (Ready in 15–20 mins)</option>
                        {restaurantConfig.timings.timeSlots.lunch.map((t) => (
                          <option key={t} value={`Lunch: ${t}`}>
                            Lunch: {t}
                          </option>
                        ))}
                        {restaurantConfig.timings.timeSlots.dinner.map((t) => (
                          <option key={t} value={`Dinner: ${t}`}>
                            Dinner: {t}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Payment Method
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('pay_at_counter')}
                          className={`py-2 px-2 text-xs font-semibold rounded-lg border text-center transition-all ${
                            paymentMethod === 'pay_at_counter'
                              ? 'border-orange-600 bg-orange-50 text-orange-800'
                              : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                          }`}
                        >
                          Pay at Counter
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('upi_qr')}
                          className={`py-2 px-2 text-xs font-semibold rounded-lg border text-center transition-all ${
                            paymentMethod === 'upi_qr'
                              ? 'border-orange-600 bg-orange-50 text-orange-800'
                              : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                          }`}
                        >
                          UPI / QR Code
                        </button>
                      </div>
                    </div>

                    {formError && (
                      <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
                        {formError}
                      </div>
                    )}
                  </div>
                </form>
              </>
            )}
          </div>

          {/* Footer Calculations & Action */}
          {items.length > 0 && (
            <div className="p-5 border-t border-stone-200 bg-stone-50/80 space-y-4">
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Items Subtotal</span>
                  <span className="tabular-nums font-medium text-stone-900">{formatPrice(subtotal)}</span>
                </div>
                {packagingFee > 0 && (
                  <div className="flex justify-between">
                    <span>Eco-friendly Food Container Box</span>
                    <span className="tabular-nums font-medium text-stone-900">{formatPrice(packagingFee)}</span>
                  </div>
                )}
                {taxAmount > 0 && (
                  <div className="flex justify-between">
                    <span>Tax ({restaurantConfig.pricing.taxRatePercent}%)</span>
                    <span className="tabular-nums font-medium text-stone-900">{formatPrice(taxAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-stone-900 pt-1 border-t border-stone-200">
                  <span>Grand Total</span>
                  <span className="tabular-nums text-orange-600">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              <Button
                variant="primary"
                fullWidth
                size="lg"
                type="submit"
                form="cart-drawer-form"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  'Confirming Order...'
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span>Place {orderType} Order ({formatPrice(grandTotal)})</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
