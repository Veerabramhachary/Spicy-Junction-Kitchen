import React from 'react';
import Link from 'next/link';
import { Utensils, Home, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { restaurantConfig } from '../config/restaurant.config';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-20">
      <div className="max-w-md w-full bg-white rounded-3xl border border-stone-200 p-8 sm:p-10 text-center space-y-6 shadow-sm">
        <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mx-auto ring-8 ring-orange-50/60">
          <Utensils className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-orange-700">
            404 Error
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-stone-900 tracking-tight">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            The dish or page you are looking for isn&apos;t on our menu. Let&apos;s get you back to the fresh flavors.
          </p>
        </div>

        <div className="flex flex-col gap-2.5 pt-2">
          <Link href="/menu">
            <Button variant="primary" size="lg" fullWidth>
              <span>Explore Food Menu</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>

          <Link href="/">
            <Button variant="outline" size="md" fullWidth>
              <Home className="w-4 h-4 mr-1.5" />
              <span>Back to Home</span>
            </Button>
          </Link>
        </div>

        <div className="pt-4 border-t border-stone-100 text-xs text-stone-500">
          Need immediate assistance? Call {restaurantConfig.contact.phone}
        </div>
      </div>
    </div>
  );
}
