import { MenuItem, ReviewItem } from './restaurant';

export interface RestaurantConfig {
  brand: {
    name: string;
    shortName: string;
    tagline: string;
    description: string;
    cuisineType: string;
    establishedYear: number;
    bannerNotice: string;
  };
  currency: {
    symbol: string;
    code: string;
    placement: 'prefix' | 'suffix';
  };
  contact: {
    phone: string;
    secondaryPhone: string;
    whatsapp: string;
    email: string;
  };
  address: {
    shop: string;
    street: string;
    locality: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    full: string;
    landmark: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
    directionsNotes?: {
      fromNorth?: string;
      fromSouth?: string;
      parkingInfo: string;
    };
  };
  googleMaps: {
    shareUrl: string;
    searchUrl?: string;
    embedQuery?: string;
    verifiedBadgeText: string;
  };
  timings: {
    lunch: string;
    dinner: string;
    days: string;
    summary: string;
    timeSlots: {
      lunch: string[];
      dinner: string[];
    };
  };
  services: {
    takeaway: boolean;
    dineIn: boolean;
    delivery: boolean;
    tableReservations: boolean;
  };
  pricing: {
    takeawayPackagingFee: number;
    taxRatePercent: number; // e.g. 5 for 5% GST
    minOrderForDelivery?: number;
    deliveryFee?: number;
  };
  features: {
    title: string;
    description: string;
    icon: 'utensils' | 'clock' | 'car' | 'heart' | 'users' | 'shield';
  }[];
  atmosphere: {
    badge: string;
    title: string;
    description: string;
    pillars: {
      title: string;
      badge: string;
      description: string;
      bulletPoint: string;
      icon: 'utensils' | 'users' | 'heart';
    }[];
    parkingTitle: string;
    parkingDescription: string;
  };
  heritage: {
    badge: string;
    title: string;
    description: string;
    points: {
      title: string;
      description: string;
      icon: 'flame' | 'shield' | 'utensils';
    }[];
  };
  images: {
    hero: string;
    soloPlatter: string;
    smallPlates: string;
    atmosphere: string;
  };
  categories: {
    id: string;
    label: string;
    description?: string;
  }[];
  menu: MenuItem[];
  initialReviews: ReviewItem[];
  faqs: {
    question: string;
    answer: string;
  }[];
  integrations?: {
    whatsappOrders?: {
      enabled: boolean;
      phoneNumber: string; // international digits only, e.g. '919849281734'
      promptDirectOpen?: boolean;
    };
    webhookUrl?: string; // Optional custom webhook (e.g., Zapier, Make, Formspree, n8n)
    googleSheetWebhookUrl?: string; // Optional Google Apps Script web app URL for instant sheet append
    notificationEmail?: string; // Optional email recipient (e.g. via Formspree/Resend/EmailJS)
  };
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
}
