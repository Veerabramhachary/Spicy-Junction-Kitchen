export type DietaryType = 'non-veg' | 'veg' | 'egg' | 'vegan';
export type SpiceLevel = 'none' | 'mild' | 'medium' | 'fiery';
export type ServiceOption = 'Takeaway' | 'Dine-in' | 'Delivery';
export type OrderStatus = 'placed' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
export type PaymentMethod = 'pay_at_counter' | 'upi_qr' | 'card_simulator';

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  categoryLabel?: string;
  description: string;
  price: number;
  image?: string;
  dietary: DietaryType;
  spiceLevel: SpiceLevel;
  isPopular?: boolean;
  isQuickBite?: boolean;
  isSmallPlate?: boolean;
  isSoloSpecial?: boolean;
  serves: string;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
  specialInstructions?: string;
}

export interface ReviewItem {
  id: string;
  author: string;
  type: 'Solo Diner' | 'Family Group' | 'Takeaway Customer' | 'Group Gathering';
  rating: number;
  text: string;
  date: string;
  source?: 'Google Maps' | 'Manual Guest Review';
  verifiedCustomer?: boolean;
}

export interface TableBooking {
  id?: string;
  name: string;
  phone: string;
  date: string;
  timeSlot: string;
  mealType: 'Lunch' | 'Dinner';
  partySize: number;
  diningPreference: 'Solo Dining' | 'Family with Children' | 'Group Gathering';
  specialRequests?: string;
  createdAt?: string;
}

export interface OrderRecord {
  id: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  packagingFee: number;
  taxAmount: number;
  total: number;
  serviceOption: ServiceOption;
  fulfillmentTime: string; // e.g., 'ASAP (15-20 min)' or 'Today, 8:30 PM'
  customer: {
    name: string;
    phone: string;
    email?: string;
    tableNumber?: string;
    deliveryAddress?: string;
    notes?: string;
  };
  paymentMethod: PaymentMethod;
  paymentStatus: 'paid' | 'pending_at_counter';
  status: OrderStatus;
}
