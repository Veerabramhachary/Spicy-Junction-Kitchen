'use client';

import React from 'react';
import Image from 'next/image';
import { ShoppingBag } from 'lucide-react';
import { MenuItem } from '../types/restaurant';
import { formatPrice } from '../lib/restaurantData';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { useCart } from '../context/CartContext';

interface DishCardProps {
  dish: MenuItem;
}

export const DishCard: React.FC<DishCardProps> = ({ dish }) => {
  const { addToCart, items } = useCart();
  const quantityInCart = items.find((ci) => ci.item.id === dish.id)?.quantity || 0;

  return (
    <Card className="overflow-hidden flex flex-col justify-between group hover:border-stone-300 transition-all">
      <div>
        {/* Image slot */}
        {dish.image ? (
          <div className="relative h-48 bg-stone-100 overflow-hidden">
            <Image
              src={dish.image}
              alt={dish.name}
              fill
              className="object-cover group-hover:scale-104 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 25vw"
            />
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded text-xs font-semibold text-stone-800 border border-stone-200">
              {dish.categoryLabel}
            </div>
          </div>
        ) : (
          <div className="h-28 bg-stone-50 border-b border-stone-100 p-4 flex items-center justify-between">
            <div className="text-xs font-semibold text-stone-600 uppercase tracking-wide">
              {dish.categoryLabel}
            </div>
            <div className="text-xs text-stone-500">
              {dish.serves}
            </div>
          </div>
        )}

        {/* Content details */}
        <div className="p-5 space-y-2.5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <span
                className={`w-2.5 h-2.5 rounded-xs shrink-0 ${
                  dish.dietary === 'veg'
                    ? 'bg-emerald-600 ring-2 ring-emerald-600/20'
                    : 'bg-rose-600 ring-2 ring-rose-600/20'
                }`}
                title={dish.dietary === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}
              />
              <h3 className="text-base font-bold text-stone-900 group-hover:text-orange-600 transition-colors truncate">
                {dish.name}
              </h3>
            </div>
            <div className="text-base font-bold text-stone-900 tabular-nums shrink-0">
              {formatPrice(dish.price)}
            </div>
          </div>

          <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
            {dish.description}
          </p>

          {/* Metadata line without pills */}
          <div className="flex items-center gap-2 text-xs text-stone-500 pt-1">
            <span>{dish.serves}</span>
            <span aria-hidden="true">·</span>
            <span className="capitalize">{dish.spiceLevel} spice</span>
            {dish.isSoloSpecial && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-orange-700 font-medium">Solo Meal</span>
              </>
            )}
            {dish.isQuickBite && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-stone-700 font-medium">Quick bite</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Card Action */}
      <div className="p-5 pt-0">
        <Button
          variant={quantityInCart > 0 ? 'secondary' : 'primary'}
          size="sm"
          fullWidth
          onClick={() => addToCart(dish)}
        >
          <ShoppingBag className="w-3.5 h-3.5 mr-1" />
          <span>
            {quantityInCart > 0
              ? `Add Another (In Bag: ${quantityInCart})`
              : `Add to Order · ₹${dish.price}`}
          </span>
        </Button>
      </div>
    </Card>
  );
};
