import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Clock, Car, Users, Utensils, Heart } from 'lucide-react';
import { RESTAURANT_INFO } from '../lib/restaurantData';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          {/* Col 1: Brand & Identity */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold font-display text-white tracking-tight">
              {RESTAURANT_INFO.name}
            </h3>
            <p className="text-sm text-stone-400 leading-relaxed">
              Traditional Hyderabadi dum cooking with freshly ground spices, slow-sealed clay handis, and authentic hospitality. Made for solo dining and group gatherings alike.
            </p>
            <div className="flex flex-wrap gap-2 text-xs text-stone-400 pt-1">
              <span>Takeaway</span>
              <span>·</span>
              <span>Dine-in</span>
              <span>·</span>
              <span>Quick Bites</span>
              <span>·</span>
              <span>Small Plates</span>
            </div>
          </div>

          {/* Col 2: Timings & Dining Options */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-stone-200">
              Kitchen Hours & Dining
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-stone-200 font-medium">Lunch Service</div>
                  <div className="tabular-nums">{RESTAURANT_INFO.timings.lunch}</div>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-stone-200 font-medium">Dinner Service</div>
                  <div className="tabular-nums">{RESTAURANT_INFO.timings.dinner}</div>
                </div>
              </li>
              <li className="text-xs text-stone-500 pt-1">
                {RESTAURANT_INFO.timings.days}
              </li>
            </ul>
          </div>

          {/* Col 3: Amenities & Hospitality */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-stone-200">
              Guest Amenities
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li className="flex items-center gap-2.5">
                <Car className="w-4 h-4 text-stone-400 shrink-0" />
                <span>{RESTAURANT_INFO.parking} (Almasguda Rd)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Utensils className="w-4 h-4 text-stone-400 shrink-0" />
                <span>Popular for Solo Dining Combos</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-stone-400 shrink-0" />
                <span>Spacious Seating for Groups</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Heart className="w-4 h-4 text-stone-400 shrink-0" />
                <span>Good for kids & family friendly</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Location & Phone */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-stone-200">
              Visit Kitchen
            </h4>
            <div className="text-sm text-stone-400 space-y-2">
              <p className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <span>{RESTAURANT_INFO.address.full}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-orange-400 shrink-0" />
                <a href={`tel:${RESTAURANT_INFO.contact.phone}`} className="hover:text-white transition-colors tabular-nums">
                  {RESTAURANT_INFO.contact.phone}
                </a>
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/contact"
                className="text-xs font-medium text-orange-400 hover:text-orange-300 underline underline-offset-4 cursor-pointer"
              >
                View Driving Directions & Landmarks →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © {new Date().getFullYear()} {RESTAURANT_INFO.name}. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <a
              href={RESTAURANT_INFO.googleMapsShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-1 font-medium"
            >
              <span>Google Maps Profile</span>
              <span aria-hidden="true">↗</span>
            </a>
            <Link href="/menu" className="hover:text-stone-400 cursor-pointer">
              Full Menu
            </Link>
            <Link href="/order" className="hover:text-stone-400 cursor-pointer">
              Takeaway Counter
            </Link>
            <Link href="/atmosphere" className="hover:text-stone-400 cursor-pointer">
              Atmosphere
            </Link>
            <Link href="/contact" className="hover:text-stone-400 cursor-pointer">
              Contact & Parking
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
