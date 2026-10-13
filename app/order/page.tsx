import type { Metadata } from 'next';
import React from 'react';
import OrderPageClient from './OrderPageClient';
import { restaurantConfig } from '../../config/restaurant.config';

export const metadata: Metadata = {
  title: `Order Online (Takeaway & Dine-in) | ${restaurantConfig.brand.name}`,
  description: `Build your order for fast takeaway pickup or dine-in seating with direct WhatsApp confirmation and itemized receipts at ${restaurantConfig.brand.name}.`,
  alternates: {
    canonical: '/order',
  },
  openGraph: {
    title: `Order Online (Takeaway & Dine-in) | ${restaurantConfig.brand.name}`,
    description: `Fast takeaway order builder and dine-in billing with instant WhatsApp order dispatch.`,
    url: '/order',
    images: [
      {
        url: restaurantConfig.images.hero,
        width: 1200,
        height: 630,
        alt: `${restaurantConfig.brand.name} Online Ordering`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Order Online | ${restaurantConfig.brand.name}`,
    description: `Build your order with instant WhatsApp dispatch and clear itemized bill.`,
    images: [restaurantConfig.images.hero],
  },
};

export default function OrderPage() {
  return <OrderPageClient />;
}
