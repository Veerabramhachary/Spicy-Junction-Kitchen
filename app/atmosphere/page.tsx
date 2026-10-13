import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Users, Heart, Car, Utensils, Flame, Shield, ArrowRight } from 'lucide-react';
import { RESTAURANT_IMAGES } from '../../lib/restaurantData';
import { restaurantConfig } from '../../config/restaurant.config';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ReserveTableButton } from '../../components/ReserveTableButton';

export const metadata: Metadata = {
  title: `Atmosphere & Kitchen Heritage | ${restaurantConfig.brand.name}`,
  description: `Experience casual dining, solo dining comfort, lively group tables, kid-friendly dining, and handi dum cooking heritage at ${restaurantConfig.brand.name}.`,
  alternates: {
    canonical: '/atmosphere',
  },
  openGraph: {
    title: `Atmosphere & Kitchen Heritage | ${restaurantConfig.brand.name}`,
    description: `Casual dining, solo dining comfort, and slow dum culinary heritage on Almasguda Road, Badangpet.`,
    url: '/atmosphere',
    images: [
      {
        url: RESTAURANT_IMAGES.atmosphere,
        width: 1200,
        height: 630,
        alt: `${restaurantConfig.brand.name} interior dining ambiance`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Atmosphere & Heritage | ${restaurantConfig.brand.name}`,
    description: `Casual dining, solo dining comfort, and slow dum culinary heritage.`,
    images: [RESTAURANT_IMAGES.atmosphere],
  },
};

export default function AtmospherePage() {
  return (
    <div className="shell shell-safe-bottom py-8 sm:py-12 space-y-16">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="text-xs font-semibold text-orange-700 uppercase tracking-wider">
          Dining Experience & Hospitality
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-stone-900 tracking-tight">
          Casual Dining, Solo Comfort & Group Celebrations
        </h1>
        <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
          {restaurantConfig.atmosphere.description}
        </p>
      </div>

      {/* Hero Atmosphere Image & Core Pillars */}
      <div className="relative rounded-3xl overflow-hidden border border-stone-200 shadow-md">
        <div className="h-80 sm:h-96 lg:h-[440px] relative">
          <Image
            src={RESTAURANT_IMAGES.atmosphere}
            alt={`${restaurantConfig.brand.name} interior dining ambiance`}
            fill
            referrerPolicy="no-referrer"
            className="object-cover"
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/30 to-transparent flex flex-col justify-end p-6 sm:p-10 text-white">
            <span className="text-xs uppercase tracking-wider text-orange-400 font-semibold mb-1">
              {restaurantConfig.atmosphere.badge}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display max-w-xl">
              {restaurantConfig.atmosphere.title}
            </h2>
            <p className="text-xs sm:text-sm text-stone-200 mt-2 max-w-lg">
              No stiff dress codes, no rushed servers. Just authentic food, good conversation, and generous portions.
            </p>
          </div>
        </div>
      </div>

      {/* 3 Pillars from Config */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {restaurantConfig.atmosphere.pillars.map((pillar, idx) => (
          <Card key={idx} className="p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-orange-100 text-orange-700 rounded-xl flex items-center justify-center">
                {pillar.icon === 'utensils' ? (
                  <Utensils className="w-6 h-6" />
                ) : pillar.icon === 'users' ? (
                  <Users className="w-6 h-6" />
                ) : (
                  <Heart className="w-6 h-6" />
                )}
              </div>
              <div className="text-xs font-semibold uppercase tracking-wider text-orange-700">
                {pillar.badge}
              </div>
              <h3 className="text-xl font-bold font-display text-stone-900">
                {pillar.title}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {pillar.description}
              </p>
            </div>
            <div className="pt-2 border-t border-stone-100 text-xs text-stone-500">
              • {pillar.bulletPoint}
            </div>
          </Card>
        ))}
      </div>

      {/* Parking & Convenience Banner */}
      <div className="p-8 bg-stone-100 rounded-2xl border border-stone-200/80 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-8 space-y-2">
          <div className="flex items-center gap-2 text-stone-900 font-bold text-lg font-display">
            <Car className="w-5 h-5 text-orange-600" />
            <span>{restaurantConfig.atmosphere.parkingTitle}</span>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            {restaurantConfig.atmosphere.parkingDescription}
          </p>
        </div>
        <div className="md:col-span-4 flex justify-start md:justify-end">
          <ReserveTableButton variant="secondary" size="md">
            Reserve Table For Today
          </ReserveTableButton>
        </div>
      </div>

      {/* Culinary Heritage Feature from Config */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-5">
          <div className="text-xs font-semibold text-orange-700 uppercase tracking-wider">
            {restaurantConfig.heritage.badge}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-stone-900 leading-snug">
            {restaurantConfig.heritage.title}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            {restaurantConfig.heritage.description}
          </p>
          <div className="space-y-3 text-xs sm:text-sm text-stone-700">
            {restaurantConfig.heritage.points.map((pt, idx) => (
              <div key={idx} className="flex items-start gap-3">
                {pt.icon === 'flame' ? (
                  <Flame className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                ) : pt.icon === 'shield' ? (
                  <Shield className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                ) : (
                  <Utensils className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                )}
                <span>
                  <strong>{pt.title}:</strong> {pt.description}
                </span>
              </div>
            ))}
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
              alt="Solo dining platter showcase"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
          <div className="relative rounded-2xl overflow-hidden border border-stone-200 aspect-4/3">
            <Image
              src={RESTAURANT_IMAGES.smallPlates}
              alt="Small plates and starters showcase"
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
