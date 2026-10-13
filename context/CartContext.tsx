'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem, CartItem, ServiceOption, OrderRecord } from '../types/restaurant';
import { restaurantConfig } from '../config/restaurant.config';
import { formatPrice } from '../lib/restaurantData';

interface CartContextType {
  items: CartItem[];
  addToCart: (item: MenuItem, specialInstructions?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  updateItemInstruction: (itemId: string, note: string) => void;
  clearCart: () => void;
  orderType: ServiceOption;
  setOrderType: (type: ServiceOption) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isReservationOpen: boolean;
  setIsReservationOpen: (open: boolean) => void;
  subtotal: number;
  packagingFee: number;
  taxAmount: number;
  grandTotal: number;
  itemCount: number;
  // Production Order History & Tracking
  orderHistory: OrderRecord[];
  activeOrder: OrderRecord | null;
  setActiveOrder: (order: OrderRecord | null) => void;
  placeOrder: (orderPayload: {
    customer: {
      name: string;
      phone: string;
      email?: string;
      tableNumber?: string;
      deliveryAddress?: string;
      notes?: string;
    };
    fulfillmentTime: string;
    paymentMethod: OrderRecord['paymentMethod'];
    paymentStatus?: OrderRecord['paymentStatus'];
  }) => OrderRecord;
  formatCurrency: (amount: number) => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<ServiceOption>('Takeaway');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [orderHistory, setOrderHistory] = useState<OrderRecord[]>([]);
  const [activeOrder, setActiveOrder] = useState<OrderRecord | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('sjk_restaurant_cart');
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
      const savedOrders = localStorage.getItem('sjk_order_history');
      if (savedOrders) {
        const parsedOrders: OrderRecord[] = JSON.parse(savedOrders);
        setOrderHistory(parsedOrders);
        if (parsedOrders.length > 0) {
          // If there's an ongoing recent order (less than 2 hours ago), set it as active
          const mostRecent = parsedOrders[0];
          const orderAge = Date.now() - new Date(mostRecent.createdAt).getTime();
          if (orderAge < 2 * 60 * 60 * 1000 && mostRecent.status !== 'completed') {
            setActiveOrder(mostRecent);
          }
        }
      }
    } catch {
      // localStorage fallback
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem('sjk_restaurant_cart', JSON.stringify(items));
    } catch {
      // storage quota / unavailable
    }
  }, [items, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem('sjk_order_history', JSON.stringify(orderHistory));
    } catch {
      // storage fallback
    }
  }, [orderHistory, isInitialized]);

  const addToCart = (item: MenuItem, specialInstructions?: string) => {
    setItems((prev) => {
      const existing = prev.find((ci) => ci.item.id === item.id);
      if (existing) {
        return prev.map((ci) =>
          ci.item.id === item.id
            ? {
                ...ci,
                quantity: ci.quantity + 1,
                specialInstructions: specialInstructions || ci.specialInstructions,
              }
            : ci
        );
      }
      return [...prev, { item, quantity: 1, specialInstructions }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setItems((prev) => prev.filter((ci) => ci.item.id !== itemId));
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((ci) => {
          if (ci.item.id === itemId) {
            const newQty = ci.quantity + delta;
            return newQty > 0 ? { ...ci, quantity: newQty } : null;
          }
          return ci;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const updateItemInstruction = (itemId: string, note: string) => {
    setItems((prev) =>
      prev.map((ci) => (ci.item.id === itemId ? { ...ci, specialInstructions: note } : ci))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const subtotal = items.reduce((acc, ci) => acc + ci.item.price * ci.quantity, 0);
  const packagingFee = orderType === 'Takeaway' ? restaurantConfig.pricing.takeawayPackagingFee : 0;
  const taxAmount = Math.round((subtotal * restaurantConfig.pricing.taxRatePercent) / 100);
  const grandTotal = subtotal + packagingFee + taxAmount;
  const itemCount = items.reduce((acc, ci) => acc + ci.quantity, 0);

  const placeOrder = (orderPayload: {
    customer: {
      name: string;
      phone: string;
      email?: string;
      tableNumber?: string;
      deliveryAddress?: string;
      notes?: string;
    };
    fulfillmentTime: string;
    paymentMethod: OrderRecord['paymentMethod'];
    paymentStatus?: OrderRecord['paymentStatus'];
  }): OrderRecord => {
    const orderId = `${restaurantConfig.brand.shortName.toUpperCase().replace(/\s+/g, '')}-${Date.now().toString().slice(-4)}`;
    const newRecord: OrderRecord = {
      id: orderId,
      createdAt: new Date().toISOString(),
      items: [...items],
      subtotal,
      packagingFee,
      taxAmount,
      total: grandTotal,
      serviceOption: orderType,
      fulfillmentTime: orderPayload.fulfillmentTime,
      customer: orderPayload.customer,
      paymentMethod: orderPayload.paymentMethod,
      paymentStatus: orderPayload.paymentStatus || 'pending_at_counter',
      status: 'confirmed',
    };

    setOrderHistory((prev) => [newRecord, ...prev]);
    setActiveOrder(newRecord);
    clearCart();

    // Asynchronously dispatch notification to configured channels (API route, sheets, webhooks)
    if (typeof window !== 'undefined') {
      import('../lib/orderDispatcher').then(({ dispatchOrderNotification }) => {
        dispatchOrderNotification(newRecord).catch(() => {});
      });
    }

    return newRecord;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateItemInstruction,
        clearCart,
        orderType,
        setOrderType,
        isCartOpen,
        setIsCartOpen,
        isReservationOpen,
        setIsReservationOpen,
        subtotal,
        packagingFee,
        taxAmount,
        grandTotal,
        itemCount,
        orderHistory,
        activeOrder,
        setActiveOrder,
        placeOrder,
        formatCurrency: formatPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
