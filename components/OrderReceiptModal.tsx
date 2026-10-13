'use client';

import React from 'react';
import { CheckCircle2, Clock, MapPin, Printer, MessageCircle, X, ChevronRight, Phone, Send, ExternalLink } from 'lucide-react';
import { OrderRecord } from '../types/restaurant';
import { restaurantConfig } from '../config/restaurant.config';
import { formatPrice } from '../lib/restaurantData';
import { buildWhatsAppOrderUrl } from '../lib/orderDispatcher';
import { Button } from './ui/Button';

interface OrderReceiptModalProps {
  order: OrderRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderReceiptModal: React.FC<OrderReceiptModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const whatsAppUrl = buildWhatsAppOrderUrl(order);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150 print:p-0 print:bg-white">
      <div
        className="fixed inset-0 print:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden z-10 max-h-[92vh] flex flex-col print:border-none print:shadow-none print:max-h-full print:w-full">
        {/* Modal Top Bar */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/80 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
              Receipt & Tracking
            </span>
            <span className="text-sm font-bold text-stone-900">#{order.id}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-lg transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Receipt Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 print:p-0">
          {/* Success Banner */}
          <div className="text-center space-y-2 pb-2">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold font-display text-stone-900">
              Order Confirmed!
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              Thank you, <strong className="text-stone-900">{order.customer.name}</strong>. The kitchen has received your order and is getting everything ready.
            </p>
          </div>

          {/* Real-time Order Progress Timeline */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/90 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-stone-800">
              <span>Order Status</span>
              <span className="text-emerald-700 uppercase tracking-wider text-[11px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {order.status === 'confirmed' ? 'Preparing in Kitchen' : order.status}
              </span>
            </div>

            {/* Step Indicators */}
            <div className="grid grid-cols-4 gap-1 text-center pt-1">
              <div className="space-y-1">
                <div className="h-1.5 rounded-full bg-emerald-600" />
                <span className="text-[10px] font-semibold text-emerald-800">Received</span>
              </div>
              <div className="space-y-1">
                <div className="h-1.5 rounded-full bg-emerald-600" />
                <span className="text-[10px] font-semibold text-emerald-800">Accepted</span>
              </div>
              <div className="space-y-1">
                <div className="h-1.5 rounded-full bg-orange-500 animate-pulse" />
                <span className="text-[10px] font-semibold text-orange-700">Cooking</span>
              </div>
              <div className="space-y-1">
                <div className="h-1.5 rounded-full bg-stone-200" />
                <span className="text-[10px] font-semibold text-stone-400">Ready</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-stone-600 pt-1 border-t border-stone-200/60">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-orange-600" />
                <span>Target: <strong>{order.fulfillmentTime}</strong></span>
              </div>
              <div className="text-[11px] text-stone-500">
                Type: <strong>{order.serviceOption}</strong>
              </div>
            </div>
          </div>

          {/* Prominent WhatsApp Dispatch Card */}
          <div className="bg-emerald-50 border-2 border-emerald-500/40 rounded-2xl p-4.5 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-emerald-950">
                  Send Order to Restaurant WhatsApp
                </h3>
                <p className="text-xs text-emerald-800 leading-relaxed mt-0.5">
                  Sends your itemized bill, contact details, and pickup slot directly to our kitchen staff for instant confirmation.
                </p>
              </div>
            </div>

            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-sm active:scale-[0.99]"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Open in WhatsApp (Pre-Filled Bill)</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>
          </div>

          {/* Itemized Bill Table */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-600 flex justify-between border-b border-stone-200 pb-1.5">
              <span>Items Ordered</span>
              <span>Amount</span>
            </div>

            <div className="space-y-2.5">
              {order.items.map((ci, idx) => (
                <div key={idx} className="flex justify-between items-start text-xs gap-3">
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <div className="font-semibold text-stone-900 truncate">
                      {ci.quantity}x {ci.item.name}
                    </div>
                    {ci.specialInstructions && (
                      <div className="text-[11px] text-orange-700 italic">
                        Note: {ci.specialInstructions}
                      </div>
                    )}
                  </div>
                  <div className="font-bold text-stone-800 tabular-nums shrink-0">
                    {formatPrice(ci.item.price * ci.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="pt-3 border-t border-stone-200 space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-stone-900 tabular-nums">
                  {formatPrice(order.subtotal)}
                </span>
              </div>
              {order.packagingFee > 0 && (
                <div className="flex justify-between">
                  <span>Eco-Packaging Box</span>
                  <span className="font-medium text-stone-900 tabular-nums">
                    {formatPrice(order.packagingFee)}
                  </span>
                </div>
              )}
              {order.taxAmount > 0 && (
                <div className="flex justify-between">
                  <span>Taxes / GST ({restaurantConfig.pricing.taxRatePercent}%)</span>
                  <span className="font-medium text-stone-900 tabular-nums">
                    {formatPrice(order.taxAmount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-stone-200">
                <span>Grand Total</span>
                <span className="text-orange-600 tabular-nums">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Location & Support Notice */}
          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600 space-y-2">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
              <span>
                <strong>{restaurantConfig.brand.name}</strong> · {restaurantConfig.address.full}
              </span>
            </div>
            <div className="flex items-center gap-2 text-stone-700">
              <Phone className="w-4 h-4 text-orange-600 shrink-0" />
              <span>Helpline: {restaurantConfig.contact.phone}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="p-5 border-t border-stone-200 bg-stone-50/70 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Send to WhatsApp</span>
            </a>

            <button
              onClick={handlePrint}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-100 rounded-lg border border-stone-200 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Bill</span>
            </button>
          </div>

          <Button variant="primary" size="md" onClick={onClose} fullWidth className="sm:w-auto">
            <span>Done</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};
