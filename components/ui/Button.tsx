import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 min-h-[36px] rounded-md gap-1.5',
    md: 'text-sm px-4 py-2 min-h-[42px] rounded-lg gap-2',
    lg: 'text-base px-6 py-3 min-h-[48px] rounded-lg gap-2.5',
  };

  const variantStyles = {
    primary: 'bg-orange-600 text-white hover:bg-orange-700 active:bg-orange-800 shadow-sm',
    secondary: 'bg-stone-900 text-white hover:bg-stone-800 active:bg-stone-950 shadow-sm',
    outline: 'border border-stone-300 text-stone-800 bg-white hover:bg-stone-50 active:bg-stone-100 hover:border-stone-400',
    ghost: 'text-stone-700 hover:bg-stone-100 active:bg-stone-200',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
