'use client';

import React from 'react';
import { useCart } from '../context/CartContext';
import { OrderReceiptModal } from './OrderReceiptModal';

export const OrderReceiptPortal: React.FC = () => {
  const { activeOrder, setActiveOrder } = useCart();

  return (
    <OrderReceiptModal
      order={activeOrder}
      isOpen={activeOrder !== null}
      onClose={() => setActiveOrder(null)}
    />
  );
};
