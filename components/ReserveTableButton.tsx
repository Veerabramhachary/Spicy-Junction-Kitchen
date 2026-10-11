'use client';

import React from 'react';
import { useCart } from '../context/CartContext';
import { Button } from './ui/Button';

interface ReserveTableButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const ReserveTableButton: React.FC<ReserveTableButtonProps> = ({
  variant = 'secondary',
  size = 'md',
  fullWidth = false,
  className = '',
  children = 'Reserve Table',
}) => {
  const { setIsReservationOpen } = useCart();

  return (
    <Button
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      className={className}
      onClick={() => setIsReservationOpen(true)}
    >
      {children}
    </Button>
  );
};

export const OpenCartButton: React.FC<{
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
}> = ({ variant = 'outline', size = 'lg', className = '', children = 'Takeaway Bag' }) => {
  const { setIsCartOpen } = useCart();
  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={() => setIsCartOpen(true)}
    >
      {children}
    </Button>
  );
};
