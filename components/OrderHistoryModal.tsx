'use client';

import React from 'react';
import { Clock, ShoppingBag, X, ChevronRight, CheckCircle2, RotateCcw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { OrderRecord } from '../types/restaurant';
import { formatPrice } from '../lib/restaurantData';
import { formatOrderDate } from '../lib/dateUtils';
import { useEscapeKey } from '../lib/useEscapeKey';
import { Button } from './ui/Button';

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOrder: (order: OrderRecord) => void;
  /** Shown in the empty state so the user is not stranded. */
  onStartOrder?: () => void;
}

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({
  isOpen,
  onClose,
  onSelectOrder,
  onStartOrder,
}) => {
  const { orderHistory, addToCart } = useCart();

  useEscapeKey(isOpen, onClose);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden z-10 max-h-[85vh] flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-labelledby="order-history-headline"
        >
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-600" />
            <h3 id="order-history-headline" className="text-base font-bold font-display text-stone-900">
              Your Order History ({orderHistory.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close order history"
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Orders */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {orderHistory.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 bg-stone-100 text-stone-400 rounded-full flex items-center justify-center mx-auto">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-stone-800">No previous orders found</p>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Orders you place on this device will appear here so you can easily track receipts or repeat your favorite dishes.
              </p>
              {onStartOrder && (
                <div className="pt-2">
                  <Button variant="primary" size="sm" onClick={onStartOrder}>
                    <RotateCcw className="w-3.5 h-3.5 mr-1" />
                    <span>Start Your First Order</span>
                  </Button>
                </div>
              )}
            </div>
          ) : (
            orderHistory.map((order) => (
              <div
                key={order.id}
                className="p-4 bg-white rounded-2xl border border-stone-200 hover:border-stone-300 transition-all space-y-3 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-900">
                      #{order.id}
                    </span>
                    <span className="text-[11px] font-semibold text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                      {order.serviceOption}
                    </span>
                  </div>
                  <span className="text-xs text-stone-400 tabular-nums">
                    {formatOrderDate(order.createdAt)}
                  </span>
                </div>

                <div className="text-xs text-stone-600 line-clamp-1">
                  {order.items.map((ci) => `${ci.quantity}x ${ci.item.name}`).join(', ')}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                  <div className="text-sm font-bold text-stone-900 tabular-nums">
                    {formatPrice(order.total)}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        // Re-order. `addToCart` increments by one per call, so
                        // a line with quantity 3 must be added three times -
                        // the previous version added each line exactly once, so
                        // re-ordering a 2x order silently halved it.
                        order.items.forEach((ci) => {
                          for (let n = 0; n < ci.quantity; n++) {
                            addToCart(ci.item, ci.specialInstructions);
                          }
                        });
                        onClose();
                      }}
                      aria-label={`Re-order order ${order.id}`}
                      className="px-2.5 py-1 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
                    >
                      Re-order
                    </button>

                    <button
                      onClick={() => {
                        onSelectOrder(order);
                        onClose();
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors cursor-pointer"
                    >
                      <span>Receipt</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-stone-200 bg-stone-50/70 text-right">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
