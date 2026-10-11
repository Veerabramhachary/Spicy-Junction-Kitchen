'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, CheckCircle2, Utensils } from 'lucide-react';
import { RESTAURANT_INFO, MENU_ITEMS } from '../../lib/restaurantData';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useCart } from '../../context/CartContext';

export default function OrderPage() {
  const {
    addToCart,
    orderType,
    setOrderType,
    setIsCartOpen,
    itemCount,
  } = useCart();

  const soloCombos = MENU_ITEMS.filter((i) => i.category === 'solo-combos');
  const quickBites = MENU_ITEMS.filter((i) => i.isQuickBite);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Top Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="text-xs font-semibold text-orange-700 uppercase tracking-wider">
          Service Options: Takeaway & Dine-in
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-stone-900 tracking-tight">
          Piping Hot Takeaway & Dine-In Ordering
        </h1>
        <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
          Order authentic Hyderabadi Dum Biryani and quick bite small plates packed fresh in heat-sealed containers or pre-booked for your dine-in table.
        </p>
      </div>

      {/* Service Options Comparison Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Takeaway Card */}
        <div
          onClick={() => setOrderType('Takeaway')}
          className={`p-6 sm:p-8 rounded-2xl border transition-all cursor-pointer ${
            orderType === 'Takeaway'
              ? 'bg-orange-50/60 border-orange-400 ring-2 ring-orange-500/20'
              : 'bg-white border-stone-200 hover:border-stone-300'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-600 text-white rounded-xl shadow-xs">
              <ShoppingBag className="w-6 h-6" />
            </div>
            {orderType === 'Takeaway' && (
              <span className="text-xs font-bold text-orange-700 bg-white px-2.5 py-1 rounded-md border border-orange-200">
                Selected Mode
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold font-display text-stone-900 mb-2">
            Takeaway Counter Pickup
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-4">
            Order online or via phone. We pack in sturdy spill-resistant thermal containers with separate salan and raita bowls. Ready in 15–20 minutes.
          </p>
          <ul className="space-y-2 text-xs text-stone-700 mb-6">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Ready for pickup in 15–20 mins</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Free Street Parking outside for quick curbside grab</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Pick up at Shop No 7, Almasguda Rd</span>
            </li>
          </ul>
          <Button
            variant={orderType === 'Takeaway' ? 'primary' : 'outline'}
            size="sm"
            fullWidth
            onClick={() => setIsCartOpen(true)}
          >
            {orderType === 'Takeaway' ? 'Review Takeaway Bag' : 'Switch to Takeaway'}
          </Button>
        </div>

        {/* Dine-in Card */}
        <div
          onClick={() => setOrderType('Dine-in')}
          className={`p-6 sm:p-8 rounded-2xl border transition-all cursor-pointer ${
            orderType === 'Dine-in'
              ? 'bg-orange-50/60 border-orange-400 ring-2 ring-orange-500/20'
              : 'bg-white border-stone-200 hover:border-stone-300'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-stone-900 text-white rounded-xl shadow-xs">
              <Utensils className="w-6 h-6" />
            </div>
            {orderType === 'Dine-in' && (
              <span className="text-xs font-bold text-orange-700 bg-white px-2.5 py-1 rounded-md border border-orange-200">
                Selected Mode
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold font-display text-stone-900 mb-2">
            Dine-In Table Pre-Order
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-4">
            Ideal for office groups or family dinners. Select your biryani and small plates ahead of arrival so our kitchen has your dishes simmering when you sit down.
          </p>
          <ul className="space-y-2 text-xs text-stone-700 mb-6">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Zero waiting time at the table</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Great for lunch breaks & group family gatherings</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Casual atmosphere with kid-friendly accommodations</span>
            </li>
          </ul>
          <Button
            variant={orderType === 'Dine-in' ? 'primary' : 'outline'}
            size="sm"
            fullWidth
            onClick={() => setIsCartOpen(true)}
          >
            {orderType === 'Dine-in' ? 'Review Dine-in Order' : 'Switch to Dine-In Pre-order'}
          </Button>
        </div>
      </div>

      {/* Solo Dining Specials Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-stone-200 pb-4">
          <div>
            <div className="text-xs font-semibold text-orange-700 uppercase tracking-wider">
              Popular for Solo Dining
            </div>
            <h2 className="text-2xl font-bold font-display text-stone-900">
              Curated Solo Meal Boxes
            </h2>
          </div>
          <p className="text-xs text-stone-500 max-w-sm">
            Balanced single-person meals featuring Biryani, protein starter, salan, raita and salad.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {soloCombos.map((combo) => (
            <Card key={combo.id} className="p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                    Solo Special
                  </span>
                  <span className="text-sm font-bold text-stone-900 tabular-nums">
                    ₹{combo.price}
                  </span>
                </div>
                <h3 className="text-base font-bold text-stone-900">
                  {combo.name}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {combo.description}
                </p>
              </div>

              <Button
                variant="primary"
                size="sm"
                fullWidth
                onClick={() => addToCart(combo)}
              >
                <ShoppingBag className="w-3.5 h-3.5 mr-1" />
                <span>Add Solo Meal · ₹{combo.price}</span>
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Bites & Small Plates Add-Ons */}
      <div className="space-y-6">
        <div className="border-b border-stone-200 pb-4">
          <div className="text-xs font-semibold text-orange-700 uppercase tracking-wider">
            Offerings: Quick Bites & Small Plates
          </div>
          <h2 className="text-2xl font-bold font-display text-stone-900">
            Crispy Starters for Takeaway
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickBites.slice(0, 3).map((qb) => (
            <div
              key={qb.id}
              className="p-4 bg-white rounded-xl border border-stone-200 flex items-center justify-between gap-3"
            >
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-stone-900 truncate">
                  {qb.name}
                </h4>
                <div className="text-xs text-stone-500 mt-0.5">
                  ₹{qb.price} · {qb.serves}
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

      {/* Live Cart Action Bar & Direct Phone Helpline */}
      <div className="p-6 bg-stone-900 text-white rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <h3 className="text-lg font-bold font-display">
            Need custom party packaging or catering for groups?
          </h3>
          <p className="text-xs text-stone-300">
            Call our Almasguda counter directly at <a href={`tel:${RESTAURANT_INFO.contact.phone}`} className="underline text-orange-400 font-semibold">{RESTAURANT_INFO.contact.phone}</a>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingBag className="w-4 h-4 mr-1.5" />
            <span>Open Order Bag ({itemCount} items)</span>
          </Button>

          <Link href="/menu">
            <Button
              variant="outline"
              size="md"
              className="text-white border-stone-700 hover:bg-stone-800"
            >
              <span>Browse Full Menu</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
