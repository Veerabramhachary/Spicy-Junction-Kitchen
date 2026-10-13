'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, CheckCircle2, Utensils, Clock, History, ArrowRight, Plus, Minus, CreditCard, QrCode, Banknote, ShieldCheck } from 'lucide-react';
import { restaurantConfig } from '../../config/restaurant.config';
import { formatPrice } from '../../lib/restaurantData';
<<<<<<< HEAD
import { formatOrderDate, formatOrderTime } from '../../lib/dateUtils';
=======
>>>>>>> cfd262b4b3de7e01126dc556d5bc97fc881042bb
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useCart } from '../../context/CartContext';
import { OrderRecord } from '../../types/restaurant';

export default function OrderPage() {
  const {
    items,
    addToCart,
    updateQuantity,
    updateItemInstruction,
    clearCart,
    orderType,
    setOrderType,
    subtotal,
    packagingFee,
    taxAmount,
    grandTotal,
    itemCount,
    placeOrder,
    orderHistory,
    setActiveOrder,
  } = useCart();

  const [activeTab, setActiveTab] = useState<'build' | 'history'>('build');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [fulfillmentTime, setFulfillmentTime] = useState('ASAP (15–20 mins)');
  const [paymentMethod, setPaymentMethod] = useState<OrderRecord['paymentMethod']>('pay_at_counter');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const soloCombos = restaurantConfig.menu.filter((i) => i.isSoloSpecial);
  const quickBites = restaurantConfig.menu.filter((i) => i.isQuickBite);

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setFormError('Your order bag is empty. Please add items before placing an order.');
      return;
    }
    if (!customerName.trim() || !customerPhone.trim()) {
      setFormError('Please provide your name and phone number so the kitchen can confirm your order.');
      return;
    }

    setFormError(null);

    if (paymentMethod === 'upi_qr') {
      setShowQrModal(true);
      return;
    }

    finalizeOrder('pending_at_counter');
  };

  const finalizeOrder = (paymentStatus: OrderRecord['paymentStatus']) => {
    setIsSubmitting(true);
    setTimeout(() => {
      const newOrder = placeOrder({
        customer: {
          name: customerName.trim(),
          phone: customerPhone.trim(),
          email: customerEmail.trim() || undefined,
          tableNumber: orderType === 'Dine-in' ? tableNumber.trim() || undefined : undefined,
          notes: customerNotes.trim() || undefined,
        },
        fulfillmentTime,
        paymentMethod,
        paymentStatus,
      });
      setIsSubmitting(false);
      setShowQrModal(false);
      setActiveOrder(newOrder);
      // Reset fields
      setCustomerName('');
      setCustomerPhone('');
      setCustomerEmail('');
      setTableNumber('');
      setCustomerNotes('');
    }, 400);
  };

  return (
<<<<<<< HEAD
    <div className="shell shell-safe-bottom py-8 sm:py-12 space-y-12">
=======
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
>>>>>>> cfd262b4b3de7e01126dc556d5bc97fc881042bb
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="text-xs font-semibold text-orange-700 uppercase tracking-wider">
          Production Order Engine
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-stone-900 tracking-tight">
          Piping Hot Takeaway & Dine-In Ordering
        </h1>
        <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
          Order authentic {restaurantConfig.brand.cuisineType} dishes packed fresh in thermal containers or pre-booked for your dining table.
        </p>
      </div>

      {/* Mode Switcher & History Tab */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('build')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'build'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 bg-stone-100'
            }`}
          >
            Create Order ({itemCount})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'history'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 bg-stone-100'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Order History ({orderHistory.length})</span>
          </button>
        </div>

        <span className="text-xs text-stone-500 hidden sm:inline">
          {restaurantConfig.address.shop}, {restaurantConfig.address.locality}
        </span>
      </div>

      {activeTab === 'history' ? (
        /* Order History View */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-display text-stone-900">
              Your Past Orders & Receipts
            </h2>
            <span className="text-xs text-stone-500">Stored safely on this device</span>
          </div>

          {orderHistory.length === 0 ? (
            <div className="py-20 text-center space-y-3 bg-white rounded-3xl border border-stone-200">
              <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto" />
              <h3 className="text-base font-bold text-stone-800">No past orders found</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Orders you place on this device will appear here with live tracking, downloadable bills, and quick re-ordering.
              </p>
              <Button variant="primary" size="sm" onClick={() => setActiveTab('build')}>
                Start Your First Order
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {orderHistory.map((order) => (
                <Card key={order.id} className="p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-stone-900">#{order.id}</span>
                        <span className="text-[11px] font-semibold text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                          {order.serviceOption}
                        </span>
                      </div>
                      <div className="text-xs text-stone-500 mt-1">
<<<<<<< HEAD
                        {formatOrderDate(order.createdAt)} at{' '}
                        {formatOrderTime(order.createdAt)}
=======
                        {new Date(order.createdAt).toLocaleDateString()} at{' '}
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
>>>>>>> cfd262b4b3de7e01126dc556d5bc97fc881042bb
                      </div>
                    </div>
                    <div className="text-base font-bold text-stone-900 tabular-nums">
                      {formatPrice(order.total)}
                    </div>
                  </div>

                  <div className="space-y-1 text-xs text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-200/80">
                    {order.items.map((ci, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>{ci.quantity}x {ci.item.name}</span>
                        <span className="tabular-nums font-medium text-stone-800">
                          {formatPrice(ci.item.price * ci.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{order.status === 'confirmed' ? 'Kitchen Received' : order.status}</span>
                    </span>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveOrder(order)}
                    >
                      View Live Receipt
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Create Order Main Flow */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Menu Items & Quick Add Specials (7 Cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Service Option Selector Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => setOrderType('Takeaway')}
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                  orderType === 'Takeaway'
                    ? 'bg-orange-50/70 border-orange-400 ring-2 ring-orange-500/20'
                    : 'bg-white border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2.5 bg-orange-600 text-white rounded-xl">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  {orderType === 'Takeaway' && (
                    <span className="text-[11px] font-bold text-orange-700 bg-white px-2 py-0.5 rounded border border-orange-200">
                      Active
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold font-display text-stone-900">
                  Takeaway Counter
                </h3>
                <p className="text-xs text-stone-600 mt-1">
                  Piping hot in thermal containers. Ready in 15–20 mins. Free street parking right outside.
                </p>
              </div>

              <div
                onClick={() => setOrderType('Dine-in')}
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                  orderType === 'Dine-in'
                    ? 'bg-orange-50/70 border-orange-400 ring-2 ring-orange-500/20'
                    : 'bg-white border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2.5 bg-stone-900 text-white rounded-xl">
                    <Utensils className="w-5 h-5" />
                  </div>
                  {orderType === 'Dine-in' && (
                    <span className="text-[11px] font-bold text-orange-700 bg-white px-2 py-0.5 rounded border border-orange-200">
                      Active
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold font-display text-stone-900">
                  Dine-In Table Pre-Order
                </h3>
                <p className="text-xs text-stone-600 mt-1">
                  Dishes simmering when you arrive. Perfect for solo diners or large groups. Zero table wait.
                </p>
              </div>
            </div>

            {/* Solo Dining Specials Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold font-display text-stone-900">
                    Solo Dining Meal Platters
                  </h3>
                  <p className="text-xs text-stone-500">
                    Complete balanced single-portion feast boxes
                  </p>
                </div>
                <Link href="/menu" className="text-xs font-semibold text-orange-600 hover:underline">
                  Full Menu →
                </Link>
              </div>

<<<<<<< HEAD
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
=======
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
>>>>>>> cfd262b4b3de7e01126dc556d5bc97fc881042bb
                {soloCombos.map((combo) => (
                  <Card key={combo.id} className="p-4 flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded">
                          Solo Meal
                        </span>
                        <span className="text-sm font-bold text-stone-900 tabular-nums">
                          {formatPrice(combo.price)}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-stone-900">{combo.name}</h4>
                      <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                        {combo.description}
                      </p>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      fullWidth
                      onClick={() => addToCart(combo)}
                    >
                      <Plus className="w-3.5 h-3.5 mr-1 text-orange-600" />
                      <span>Add to Order · {formatPrice(combo.price)}</span>
                    </Button>
                  </Card>
                ))}
              </div>
            </div>

            {/* Quick Bites & Small Plates Add-Ons */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold font-display text-stone-900">
                Crispy Small Plates & Quick Bites
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {quickBites.slice(0, 3).map((qb) => (
                  <div
                    key={qb.id}
                    className="p-3.5 bg-white rounded-xl border border-stone-200 flex flex-col justify-between space-y-2 shadow-2xs"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-stone-900 truncate">{qb.name}</h4>
                      <div className="text-xs text-stone-500 mt-0.5">
                        {formatPrice(qb.price)} · {qb.serves}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addToCart(qb)}
                    >
                      + Add
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Order Form & Summary (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="p-6 space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-orange-600" />
                  <h3 className="text-base font-bold font-display text-stone-900">
                    Order Summary ({items.length} items)
                  </h3>
                </div>
                {items.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-xs text-stone-400 hover:text-rose-600 transition-colors"
                  >
                    Clear bag
                  </button>
                )}
              </div>

              {/* Items List */}
              {items.length === 0 ? (
                <div className="py-8 text-center space-y-2 text-stone-500">
                  <p className="text-sm font-medium">Your order bag is currently empty.</p>
                  <p className="text-xs">Select items from the left or browse our full menu to build your order.</p>
                  <div className="pt-2">
                    <Link href="/menu">
                      <Button variant="outline" size="sm">
                        Browse Full Menu
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {items.map(({ item, quantity, specialInstructions }) => (
                    <div
                      key={item.id}
                      className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 space-y-1.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h5 className="text-xs font-bold text-stone-900 truncate">
                            {item.name}
                          </h5>
                          <div className="text-[11px] text-stone-500">
                            {formatPrice(item.price)} each
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <div className="flex items-center border border-stone-300 rounded-lg bg-white overflow-hidden">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="p-1 hover:bg-stone-100 text-stone-600"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-xs font-bold text-stone-800">
                              {quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="p-1 hover:bg-stone-100 text-stone-600"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="text-xs font-bold text-stone-900 tabular-nums w-12 text-right">
                            {formatPrice(item.price * quantity)}
                          </span>
                        </div>
                      </div>

                      {specialInstructions && (
                        <div className="text-[11px] text-orange-800 italic bg-orange-50 px-2 py-0.5 rounded">
                          Note: {specialInstructions}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Checkout Form */}
              <form onSubmit={handleOrderSubmit} className="space-y-4 pt-2 border-t border-stone-200">
                <div className="text-xs font-bold uppercase tracking-wider text-stone-600">
                  Customer & Schedule Details
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Ramesh Reddy"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="+91 98490 00000"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Fulfillment Time
                      </label>
                      <select
                        value={fulfillmentTime}
                        onChange={(e) => setFulfillmentTime(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                      >
                        <option value="ASAP (15–20 mins)">ASAP (15–20 mins)</option>
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
                  </div>

                  {orderType === 'Dine-in' && (
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Table Number (Optional if already seated)
                      </label>
                      <input
                        type="text"
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        placeholder="e.g. Table 4 or Leaving blank for arrival"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Kitchen Notes (Optional)
                    </label>
                    <input
                      type="text"
                      value={customerNotes}
                      onChange={(e) => setCustomerNotes(e.target.value)}
                      placeholder="e.g. Extra salan, spicy, keep lemons"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                  </div>

                  {/* Payment Method Selector */}
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Payment Choice
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('pay_at_counter')}
                        className={`p-2.5 rounded-xl border text-left flex items-start gap-2 transition-all ${
                          paymentMethod === 'pay_at_counter'
                            ? 'border-orange-600 bg-orange-50/70 text-orange-900 ring-1 ring-orange-500'
                            : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        <Banknote className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs font-bold">Pay at Counter</div>
                          <div className="text-[10px] text-stone-500">Cash / UPI upon arrival</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('upi_qr')}
                        className={`p-2.5 rounded-xl border text-left flex items-start gap-2 transition-all ${
                          paymentMethod === 'upi_qr'
                            ? 'border-orange-600 bg-orange-50/70 text-orange-900 ring-1 ring-orange-500'
                            : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        <QrCode className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs font-bold">UPI QR Code</div>
                          <div className="text-[10px] text-stone-500">Fast digital scan</div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bill Breakdown */}
                <div className="pt-3 border-t border-stone-200 space-y-1.5 text-xs text-stone-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="tabular-nums font-semibold text-stone-900">{formatPrice(subtotal)}</span>
                  </div>
                  {packagingFee > 0 && (
                    <div className="flex justify-between">
                      <span>Packaging Container Box</span>
                      <span className="tabular-nums font-semibold text-stone-900">{formatPrice(packagingFee)}</span>
                    </div>
                  )}
                  {taxAmount > 0 && (
                    <div className="flex justify-between">
                      <span>Tax ({restaurantConfig.pricing.taxRatePercent}%)</span>
                      <span className="tabular-nums font-semibold text-stone-900">{formatPrice(taxAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-stone-200">
                    <span>Grand Total</span>
                    <span className="text-orange-600 tabular-nums">{formatPrice(grandTotal)}</span>
                  </div>
                </div>

                {formError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                    <span className="font-semibold">Note:</span> {formError}
                  </div>
                )}

                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  type="submit"
                  disabled={isSubmitting || items.length === 0}
                >
                  {isSubmitting ? (
                    'Processing Order...'
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <span>Confirm {orderType} Order ({formatPrice(grandTotal)})</span>
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      )}

      {/* UPI QR Payment Modal Simulator */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-5 shadow-2xl border border-stone-200">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-orange-700 uppercase tracking-wider bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                UPI Instant Checkout
              </span>
              <h3 className="text-lg font-bold text-stone-900 font-display">
                Scan & Pay {formatPrice(grandTotal)}
              </h3>
              <p className="text-xs text-stone-500">
                Scan with any UPI app (Google Pay, PhonePe, Paytm)
              </p>
            </div>

            {/* Stylized QR Code Visualizer */}
            <div className="w-48 h-48 bg-stone-100 mx-auto rounded-2xl border border-stone-200 p-4 flex flex-col items-center justify-center relative">
              <QrCode className="w-32 h-32 text-stone-800" />
              <div className="text-[10px] font-mono text-stone-500 mt-1">
                UPI ID: {restaurantConfig.contact.whatsapp}@upi
              </div>
            </div>

            <div className="space-y-2">
              <Button
                variant="primary"
                fullWidth
                onClick={() => finalizeOrder('paid')}
              >
                Simulate Payment Success
              </Button>
              <Button
                variant="ghost"
                size="sm"
                fullWidth
                onClick={() => setShowQrModal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
