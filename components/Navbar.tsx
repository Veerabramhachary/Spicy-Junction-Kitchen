'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X, Calendar } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { itemCount, setIsCartOpen, setIsReservationOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/menu', label: 'Menu & Dishes' },
    { href: '/order', label: 'Takeaway & Order' },
    { href: '/atmosphere', label: 'Atmosphere' },
    { href: '/contact', label: 'Location & Hours' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-18">
          {/* Zone 1: Single text element wordmark */}
          <Link
            href="/"
            className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 font-display whitespace-nowrap shrink-0 hover:text-orange-600 transition-colors cursor-pointer"
          >
            Spicy Junction Kitchen
          </Link>

          {/* Zone 2: 4–5 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-700">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    isActive
                      ? 'text-orange-600 font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-600 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors whitespace-nowrap shrink-0 shadow-xs cursor-pointer min-h-[42px]"
              aria-label="View Cart and Order Takeaway"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Takeaway Order</span>
              {itemCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-xs font-bold bg-white text-orange-700 rounded-md tabular-nums">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-3 text-base font-medium rounded-lg text-left transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-orange-50 text-orange-700 font-semibold'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-600" />
                  )}
                </Link>
              );
            })}

            <div className="pt-3 mt-2 border-t border-stone-100 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsReservationOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Reserve Dine-In Table</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
