'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Utensils, Phone, Calendar } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { TEL_HREF } from '../lib/contact';

export const MobileActionBar: React.FC = () => {
  const { itemCount, setIsCartOpen, setIsReservationOpen } = useCart();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-stone-200 px-4 py-2.5 flex items-center justify-between gap-3 shadow-lg">
      <Link
        href="/menu"
        className="flex-1 flex flex-col items-center justify-center text-xs font-semibold text-stone-700 py-1 hover:text-orange-600 cursor-pointer"
      >
        <Utensils className="w-4 h-4 mb-0.5 text-stone-600" />
        <span>Menu</span>
      </Link>

      <button
        onClick={() => setIsReservationOpen(true)}
        className="flex-1 flex flex-col items-center justify-center text-xs font-semibold text-stone-700 py-1 hover:text-orange-600 cursor-pointer"
      >
        <Calendar className="w-4 h-4 mb-0.5 text-stone-600" />
        <span>Table</span>
      </button>

      <a
        href={`tel:${TEL_HREF}`}
        className="flex-1 flex flex-col items-center justify-center text-xs font-semibold text-stone-700 py-1 hover:text-orange-600"
      >
        <Phone className="w-4 h-4 mb-0.5 text-stone-600" />
        <span>Call</span>
      </a>

      <button
        onClick={() => setIsCartOpen(true)}
        className="flex-2 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold text-white bg-orange-600 rounded-lg shadow-xs cursor-pointer"
      >
        <ShoppingBag className="w-4 h-4" />
        <span>Order ({itemCount})</span>
      </button>
    </div>
  );
};
