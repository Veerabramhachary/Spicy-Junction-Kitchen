import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Utensils, Star, Clock, Car, Heart, ShoppingBag } from 'lucide-react';
import { RESTAURANT_INFO, RESTAURANT_IMAGES, MENU_ITEMS, REVIEWS } from '../lib/restaurantData';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { DishCard } from '../components/DishCard';
import { ReserveTableButton, OpenCartButton } from '../components/ReserveTableButton';

export default function HomePage() {
  const featuredItems = MENU_ITEMS.filter((item) => item.isPopular).slice(0, 3);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            {/* Left Column: Headline & Action */}
            <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-orange-700 tracking-wide uppercase">
                <span>Shop No 7, Almasguda Rd</span>
                <span aria-hidden="true">·</span>
                <span>Badangpet, Hyderabad</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 tracking-tight font-display leading-[1.08] text-balance">
                Authentic Hyderabadi Dum Biryani, Quick Bites & Small Plates.
              </h1>

              <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-xl">
                Experience slow-cooked earthen handi biryani sealed with fragrant spices, crispy starters, and welcoming dining. Famous for solo dining combos, family lunches, and late dinners.
              </p>

              {/* Service Capabilities Row */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-medium text-stone-600 pt-1">
                <span className="flex items-center gap-1.5 text-stone-900 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  Takeaway & Dine-in
                </span>
                <span aria-hidden="true">·</span>
                <span>Solo Dining Champion</span>
                <span aria-hidden="true">·</span>
                <span>Free Street Parking</span>
                <span aria-hidden="true">·</span>
                <span>Good for Kids</span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link href="/menu">
                  <Button variant="primary" size="lg">
                    <span>Explore Menu & Prices</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>

                <ReserveTableButton variant="secondary" size="lg" />

                <OpenCartButton variant="outline" size="lg">
                  <ShoppingBag className="w-4 h-4 mr-1 text-orange-600" />
                  <span>Quick Takeaway</span>
                </OpenCartButton>
              </div>

              {/* Trust Metric Strip */}
              <div className="pt-4 border-t border-stone-200/80 flex items-center gap-6 text-xs text-stone-600">
                <div className="flex items-center gap-1">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="font-bold text-stone-900 ml-1 tabular-nums">4.8 / 5.0</span>
                </div>
                <span>·</span>
                <span>Over 850+ verified local ratings</span>
                <span>·</span>
                <span>Badangpet, Telangana</span>
              </div>
            </div>

            {/* Right Column: Hero Visual Showcase */}
            <div className="lg:col-span-6 relative">
              <div className="relative h-80 sm:h-96 lg:h-full min-h-[380px] rounded-2xl overflow-hidden border border-stone-200/80 shadow-md group">
                <Image
                  src={RESTAURANT_IMAGES.hero}
                  alt="Authentic Hyderabadi Dum Biryani in clay handi with mirchi ka salan and raita at Spicy Junction Kitchen"
                  fill
                  priority
                  className="object-cover group-hover:scale-102 transition-transform duration-700"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                {/* Subtle scrim overlay at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent flex flex-col justify-end p-6 text-white">
                  <div className="text-xs uppercase tracking-wider text-orange-400 font-semibold mb-1">
                    Signature Slow Dum Handi
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-display">
                    Cooked with Aged Basmati & Pure Ghee
                  </h3>
                  <p className="text-xs text-stone-200 mt-1 max-w-md">
                    Each handi is sealed with dough to trap steam, infusing saffron and royal spices into every succulent grain.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Item Credential Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-stone-100/80 rounded-2xl border border-stone-200/80">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-white rounded-xl text-orange-600 shadow-2xs">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-stone-900">Solo Dining Comfort</h4>
              <p className="text-xs text-stone-600 mt-0.5">
                Thoughtfully sized individual platters, quick counters, and zero hassle.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-white rounded-xl text-orange-600 shadow-2xs">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-stone-900">Lunch & Dinner Service</h4>
              <p className="text-xs text-stone-600 mt-0.5">
                Fresh batches prepared twice daily for lunch (11:30–3:30) & dinner (7:00–11:30).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-white rounded-xl text-orange-600 shadow-2xs">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-stone-900">Free Street Parking</h4>
              <p className="text-xs text-stone-600 mt-0.5">
                Spacious curbside parking directly in front along Almasguda Road.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-white rounded-xl text-orange-600 shadow-2xs">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-stone-900">Good for Kids & Groups</h4>
              <p className="text-xs text-stone-600 mt-0.5">
                Spacious seating layouts with mild spice options customized for little ones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Signature Offerings Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-semibold text-orange-700 uppercase tracking-wider mb-1">
              Handpicked By Chef
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-stone-900">
              Popular Signatures & Quick Bites
            </h2>
          </div>
          <Link
            href="/menu"
            className="text-sm font-semibold text-orange-600 hover:text-orange-700 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>View all 15+ dishes & small plates</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredItems.map((item) => (
            <DishCard key={item.id} dish={item} />
          ))}
        </div>
      </section>

      {/* The 2-Column Experience Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-12 overflow-hidden border border-stone-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-5">
              <div className="text-xs uppercase tracking-wider text-orange-400 font-semibold">
                Casual Dining Atmosphere
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-balance">
                Warm Indian Hospitality in Hanuman Nagar, Badangpet.
              </h2>
              <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
                Whether you drop in during lunch break for a quick solo biryani platter or gather with 10 friends for a weekend dinner banquet, our dining hall welcomes you with genuine warmth.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-stone-800/80 rounded-xl border border-stone-700/60">
                  <div className="text-lg font-bold text-orange-400 font-display">Solo Friendly</div>
                  <div className="text-xs text-stone-400 mt-1">
                    Zero awkwardness, quick table turnover, dedicated individual meal platters.
                  </div>
                </div>
                <div className="p-4 bg-stone-800/80 rounded-xl border border-stone-700/60">
                  <div className="text-lg font-bold text-orange-400 font-display">Kid Loved</div>
                  <div className="text-xs text-stone-400 mt-1">
                    Mild spice custom orders, paneer small bites, and high chairs on demand.
                  </div>
                </div>
              </div>
              <div className="pt-2">
                <Link href="/atmosphere">
                  <Button variant="primary">
                    <span>Explore Kitchen Story & Hall Tour</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden border border-stone-700/80 shadow-xl aspect-4/3">
                <Image
                  src={RESTAURANT_IMAGES.atmosphere}
                  alt="Casual and welcoming dining atmosphere at Spicy Junction Kitchen with wooden tables and warm pendant lamps"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Proof & Reviews Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="text-xs font-semibold text-orange-700 uppercase tracking-wider">
            Guest Testimonials
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-stone-900">
            Loved By Hyderabad Diners & Takeaway Regulars
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Real feedback from neighborhood families, solo lunch-goers, and office groups.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {REVIEWS.map((rev) => (
            <Card key={rev.id} className="p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs text-stone-400 tabular-nums">{rev.date}</span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed italic">
                  "{rev.text}"
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="font-bold text-stone-900">{rev.author}</span>
                <span className="text-stone-500">{rev.type}</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Bottom Visit & Location Quick Prompt */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 bg-orange-50 rounded-2xl border border-orange-200/80 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold font-display text-stone-900">
              Ready for lunch or dinner today?
            </h3>
            <p className="text-xs sm:text-sm text-stone-700">
              Visit us at <strong className="text-stone-900">Shop No 7, Almasguda Rd, Hanuman Nagar, Badangpet</strong>. Takeaway packed in 15 mins. Free street parking right outside.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/contact">
              <Button variant="primary" size="lg">
                Get Directions & Map
              </Button>
            </Link>
            <Link href="/order">
              <Button variant="outline" size="lg">
                Order Takeaway
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
