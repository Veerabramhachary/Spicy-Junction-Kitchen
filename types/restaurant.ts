export type ServiceOption = 'Takeaway' | 'Dine-in';

export interface MenuItem {
  id: string;
  name: string;
  category: 'biryani' | 'solo-combos' | 'small-plates' | 'curries' | 'drinks-desserts';
  categoryLabel: string;
  description: string;
  price: number;
  image?: string;
  dietary: 'non-veg' | 'veg' | 'egg';
  spiceLevel: 'mild' | 'medium' | 'fiery';
  isPopular?: boolean;
  isQuickBite?: boolean;
  isSmallPlate?: boolean;
  isSoloSpecial?: boolean;
  serves: string;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
  selectedOption?: string;
}

export interface ReviewItem {
  id: string;
  author: string;
  type: 'Solo Diner' | 'Family Group' | 'Takeaway Customer';
  rating: number;
  text: string;
  date: string;
}

export interface TableBooking {
  name: string;
  phone: string;
  date: string;
  timeSlot: string;
  mealType: 'Lunch' | 'Dinner';
  partySize: number;
  diningPreference: 'Solo Dining' | 'Family with Children' | 'Group Gathering';
  specialRequests?: string;
}
