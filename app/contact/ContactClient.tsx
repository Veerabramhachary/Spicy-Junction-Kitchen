'use client';

import React, { useState } from 'react';
import { Navigation, MessageCircle, Calendar } from 'lucide-react';
import { RESTAURANT_INFO } from '../../lib/restaurantData';
import { Button } from '../../components/ui/Button';
import { useCart } from '../../context/CartContext';

export const ContactClient: React.FC = () => {
  const { setIsReservationOpen } = useCart();
  const [copiedAddress, setCopiedAddress] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(RESTAURANT_INFO.address.full);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const googleMapsUrl = RESTAURANT_INFO.googleMapsShareUrl;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Open in Google Maps</span>
        </a>
        <button
          onClick={handleCopyAddress}
          className="py-2 px-3 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
        >
          {copiedAddress ? 'Copied!' : 'Copy Address'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100">
        <a
          href={`https://wa.me/${RESTAURANT_INFO.contact.whatsapp}?text=${encodeURIComponent('Hi Spicy Junction Kitchen, I would like to inquire about today menu and table availability.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>WhatsApp Us</span>
        </a>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsReservationOpen(true)}
        >
          <Calendar className="w-3.5 h-3.5 mr-1" />
          <span>Book Table</span>
        </Button>
      </div>
    </div>
  );
};
