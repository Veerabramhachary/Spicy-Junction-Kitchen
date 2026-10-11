import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Users, Heart, Car, Utensils, Flame, Shield, ArrowRight } from 'lucide-react';
import { RESTAURANT_INFO, RESTAURANT_IMAGES } from '../../lib/restaurantData';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ReserveTableButton } from '../../components/ReserveTableButton';

export const metadata: Metadata = {
  title: 'Atmosphere & Heritage | Spicy Junction Kitchen Hyderabad',
  description: 'Experience casual dining, solo dining comforts, lively group tables, kid-friendly dining, and slow dum cooking heritage in Badangpet, Hyderabad.',
};

export default function AtmospherePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="text-xs font-semibold text-orange-700 uppercase tracking-wider">
          Dining Experience & Hospitality
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-stone-900 tracking-tight">
          Casual Dining, Solo Comfort & Group Celebrations
        </h1>
        <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
          At Spicy Junction Kitchen in Badangpet, Hyderabad, we built an unpretentious, welcoming culinary space where everyone feels at home—from a solo diner on lunch break to three generations dining together.
        </p>
      </div>

      {/* Hero Atmosphere Image & Core Pillars */}
      <div className="relative rounded-3xl overflow-hidden border border-stone-200 shadow-md">
        <div className="h-80 sm:h-96 lg:h-[440px] relative">
          <Image
            src={RESTAURANT_IMAGES.atmosphere}
            alt="Interior dining hall at Spicy Junction Kitchen with wooden tables and warm ambient pendant lights"
            fill
            className="object-cover"
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/30 to-transparent flex flex-col justify-end p-6 sm:p-10 text-white">
            <span className="text-xs uppercase tracking-wider text-orange-400 font-semibold mb-1">
              Atmosphere: Casual & Welcoming
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display max-w-xl">
              Spacious Wooden Seating, Warm Lights & Aromas of Dum Handis
            </h2>
            <p className="text-xs sm:text-sm text-stone-200 mt-2 max-w-lg">
              No stiff dress codes, no rushed servers. Just authentic food, good conversation, and generous portions.
            </p>
          </div>
        </div>
      </div>

      {/* 3 Pillars: Solo Dining, Groups, and Kids */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Pillar 1: Solo Dining */}
        <Card className="p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 bg-orange-100 text-orange-700 rounded-xl flex items-center justify-center">
              <Utensils className="w-6 h-6" />
            </div>
            <div className="text-xs font-semibold uppercase tracking-wider text-orange-700">
              Popular For
            </div>
            <h3 className="text-xl font-bold font-display text-stone-900">
              Solo Dining Haven
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              We take solo diners seriously. Our special Solo Biryani Platters come complete with boiled egg, chicken 65 quick bite, salan, raita, and salad—giving you the full Hyderabadi feast in a single-portion serving with swift service.
            </p>
          </div>
          <div className="pt-2 border-t border-stone-100 text-xs text-stone-500">
            • Fast counter turnover · No awkward large minimums
          </div>
        </Card>

        {/* Pillar 2: Groups */}
        <Card className="p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 bg-stone-100 text-stone-900 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div className="text-xs font-semibold uppercase tracking-wider text-stone-700">
              Crowd: Groups
            </div>
            <h3 className="text-xl font-bold font-display text-stone-900">
              Lively Group Banquets
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Whether you are catching up with office peers over Friday lunch or hosting a weekend reunion of 12 people, our tables easily combine into expansive banquets. Shareable small plates and jumbo handis make passing plates seamless.
            </p>
          </div>
          <div className="pt-2 border-t border-stone-100 text-xs text-stone-500">
            • Modular tables · Family packs & shareable starters
          </div>
        </Card>

        {/* Pillar 3: Good for Kids */}
        <Card className="p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 bg-rose-100 text-rose-700 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <div className="text-xs font-semibold uppercase tracking-wider text-rose-700">
              Children Welcome
            </div>
            <h3 className="text-xl font-bold font-display text-stone-900">
              Good for Kids & Families
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Indian dining is for the whole family. Our chefs happily prepare mild spice biryani portions and gentle paneer or corn quick bites for children. High chairs and friendly staff ensure parents can relax and enjoy dinner.
            </p>
          </div>
          <div className="pt-2 border-t border-stone-100 text-xs text-stone-500">
            • Mild seasoning on request · High chairs available
          </div>
        </Card>
      </div>

      {/* Free Street Parking & Convenience */}
      <div className="p-8 bg-stone-100 rounded-2xl border border-stone-200/80 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-8 space-y-2">
          <div className="flex items-center gap-2 text-stone-900 font-bold text-lg font-display">
            <Car className="w-5 h-5 text-orange-600" />
            <span>Free Street Parking on Almasguda Road</span>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Convenient curbside street parking is readily available directly in front of and adjacent to Shop No 7. No valet fees, no parking ticket hassles—pull right up for dining in or grabbing quick takeaway bags.
          </p>
        </div>
        <div className="md:col-span-4 flex justify-start md:justify-end">
          <ReserveTableButton variant="secondary" size="md">
            Reserve Table For Today
          </ReserveTableButton>
        </div>
      </div>

      {/* Dum Cooking Heritage Feature */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-5">
          <div className="text-xs font-semibold text-orange-700 uppercase tracking-wider">
            Our Kitchen Secret
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-stone-900 leading-snug">
            The Time-Honored Art of Hyderabadi Dum Cooking
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            True Hyderabadi Biryani cannot be rushed on high heat. At Spicy Junction Kitchen, we marinate our chicken and mutton in curd, pounded ginger, garlic, and freshly roasted masala for hours before layering with parboiled aged basmati.
          </p>
          <div className="space-y-3 text-xs sm:text-sm text-stone-700">
            <div className="flex items-start gap-3">
              <Flame className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
              <span><strong>Dough-Sealed Handis:</strong> Wet wheat dough seals the pot rim so zero vapor escapes during the 45-minute dum cycle.</span>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
              <span><strong>Pure Ghee & Saffron:</strong> Only authentic cow ghee and Kashmiri saffron strands are drizzled over the top rice layer.</span>
            </div>
            <div className="flex items-start gap-3">
              <Utensils className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
              <span><strong>Mirchi Ka Salan:</strong> Cooked from scratch with roasted peanuts, desiccated coconut, and fresh green chilies.</span>
            </div>
          </div>
          <div className="pt-2">
            <Link href="/menu">
              <Button variant="primary">
                <span>See Menu & Order Dishes</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="relative rounded-2xl overflow-hidden border border-stone-200 aspect-4/3">
            <Image
              src={RESTAURANT_IMAGES.soloPlatter}
              alt="Solo dining biryani platter"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
          <div className="relative rounded-2xl overflow-hidden border border-stone-200 aspect-4/3">
            <Image
              src={RESTAURANT_IMAGES.smallPlates}
              alt="Crispy Chicken 65 and small plates"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
