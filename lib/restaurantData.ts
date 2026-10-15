import { restaurantConfig } from '../config/restaurant.config';
import { DietaryType } from '../types/restaurant';
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

/**
 * Dietary indicator colour and accessible label.
 *
 * Previously each component branched on `dietary === 'veg'` and fell through
 * to the red non-veg dot for everything else, so `egg` and `vegan` dishes were
 * both mislabelled as non-vegetarian. Egg now gets its own amber indicator,
 * which is the conventional marking in Indian food labelling.
 */
export const DIETARY_META: Record<DietaryType, { label: string; dot: string }> = {
  veg: { label: 'Vegetarian', dot: 'bg-emerald-600 ring-emerald-600/20' },
  vegan: { label: 'Vegan', dot: 'bg-emerald-600 ring-emerald-600/20' },
  egg: { label: 'Contains Egg', dot: 'bg-amber-500 ring-amber-500/20' },
  'non-veg': { label: 'Non-Vegetarian', dot: 'bg-rose-600 ring-rose-600/20' },
};
