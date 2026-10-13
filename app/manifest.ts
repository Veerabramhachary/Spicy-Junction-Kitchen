import { MetadataRoute } from 'next';
import { restaurantConfig } from '../config/restaurant.config';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: restaurantConfig.brand.name,
    short_name: restaurantConfig.brand.shortName,
    description: restaurantConfig.brand.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#fafaf9',
    theme_color: '#ea580c',
    icons: [
      {
        src: restaurantConfig.images.hero,
        sizes: '512x512',
        type: 'image/jpeg',
      },
    ],
  };
}
