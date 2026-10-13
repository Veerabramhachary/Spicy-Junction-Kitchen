import { restaurantConfig } from '../config/restaurant.config';
export { restaurantConfig };

export const RESTAURANT_INFO = {
  name: restaurantConfig.brand.name,
  shortName: restaurantConfig.brand.shortName,
  tagline: restaurantConfig.brand.tagline,
  description: restaurantConfig.brand.description,
  type: restaurantConfig.brand.cuisineType,
  establishedYear: restaurantConfig.brand.establishedYear,
  bannerNotice: restaurantConfig.brand.bannerNotice,

  googleMapsShareUrl: restaurantConfig.googleMaps.shareUrl,
  googleMapsSearchUrl: restaurantConfig.googleMaps.searchUrl,
  googleProfileVerified: true,

  address: restaurantConfig.address,
  contact: restaurantConfig.contact,
  timings: restaurantConfig.timings,

  serviceOptions: [
    ...(restaurantConfig.services.takeaway ? (['Takeaway'] as const) : []),
    ...(restaurantConfig.services.dineIn ? (['Dine-in'] as const) : []),
    ...(restaurantConfig.services.delivery ? (['Delivery'] as const) : []),
  ],
  popularFor: 'Solo dining',
  offerings: ['Quick bite', 'Small plates', 'Dishes'] as const,
  diningOptions: ['Lunch', 'Dinner'] as const,
  atmosphere: 'Casual',
  crowd: 'Groups & Solo Diners',
  children: 'Good for kids',
  parking: 'Free street parking',
};

export const RESTAURANT_IMAGES = restaurantConfig.images;
export const MENU_ITEMS = restaurantConfig.menu;
export const REVIEWS = restaurantConfig.initialReviews;
export const FAQS = restaurantConfig.faqs;
export const CATEGORIES = restaurantConfig.categories;

/**
 * Currency formatter respecting restaurantConfig currency settings
 */
export function formatPrice(amount: number): string {
  const { symbol, placement } = restaurantConfig.currency;
  if (placement === 'suffix') {
    return `${amount} ${symbol}`;
  }
  return `${symbol}${amount}`;
}
