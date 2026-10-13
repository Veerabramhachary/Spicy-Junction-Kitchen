import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Clock, Car, Users, Utensils, Heart, Shield } from 'lucide-react';
import { RESTAURANT_INFO } from '../lib/restaurantData';
import { restaurantConfig } from '../config/restaurant.config';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
<<<<<<< HEAD
      <div className="shell">
=======
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
>>>>>>> cfd262b4b3de7e01126dc556d5bc97fc881042bb
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          {/* Col 1: Brand & Identity */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold font-display text-white tracking-tight">
              {restaurantConfig.brand.name}
            </h3>
            <p className="text-sm text-stone-400 leading-relaxed">
              {restaurantConfig.brand.description}
            </p>
            <div className="flex flex-wrap gap-2 text-xs text-stone-400 pt-1">
              <span>Takeaway</span>
              <span>·</span>
              <span>Dine-in</span>
              <span>·</span>
              <span>{restaurantConfig.brand.cuisineType}</span>
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
                  <div className="tabular-nums">{restaurantConfig.timings.lunch}</div>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-stone-200 font-medium">Dinner Service</div>
                  <div className="tabular-nums">{restaurantConfig.timings.dinner}</div>
                </div>
              </li>
              <li className="text-xs text-stone-500 pt-1">
                {restaurantConfig.timings.days}
              </li>
            </ul>
          </div>

          {/* Col 3: Amenities & Features */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-stone-200">
              Guest Amenities
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              {restaurantConfig.features.map((feat, idx) => (
                <li key={idx} className="flex items-center gap-2.5">
                  {feat.icon === 'car' ? (
                    <Car className="w-4 h-4 text-stone-400 shrink-0" />
                  ) : feat.icon === 'utensils' ? (
                    <Utensils className="w-4 h-4 text-stone-400 shrink-0" />
                  ) : feat.icon === 'users' ? (
                    <Users className="w-4 h-4 text-stone-400 shrink-0" />
                  ) : (
                    <Heart className="w-4 h-4 text-stone-400 shrink-0" />
                  )}
                  <span>{feat.title}</span>
                </li>
              ))}
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
