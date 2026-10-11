'use client';

import React, { useState } from 'react';
import { Calendar, CheckCircle, Car } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { RESTAURANT_INFO } from '../lib/restaurantData';
import { useCart } from '../context/CartContext';

export const ReservationModal: React.FC = () => {
  const { isReservationOpen, setIsReservationOpen } = useCart();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [mealType, setMealType] = useState<'Lunch' | 'Dinner'>('Dinner');
  const [partySize, setPartySize] = useState(2);
  const [preference, setPreference] = useState<'Solo Dining' | 'Group Gathering' | 'Family with Children'>('Group Gathering');
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingId, setBookingId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const id = `SJK-RES-${Math.floor(100 + Math.random() * 900)}`;
    setBookingId(id);
    setIsSuccess(true);
  };

  const handleClose = () => {
    setIsReservationOpen(false);
    setIsSuccess(false);
  };

  return (
    <Modal
      isOpen={isReservationOpen}
      onClose={handleClose}
      title="Reserve a Table at Spicy Junction"
      maxWidth="md"
    >
      {isSuccess ? (
        <div className="py-6 text-center space-y-4">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-stone-900 font-display">
            Table Reserved!
          </h3>
          <p className="text-sm text-stone-600 max-w-sm mx-auto">
            Thank you, <strong className="text-stone-900">{name}</strong>. Your reservation number is <strong className="text-stone-900">{bookingId}</strong> for {partySize} guests ({mealType}).
          </p>
          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600 text-left space-y-1.5">
            <div className="flex items-center gap-2 text-stone-900 font-medium">
              <Calendar className="w-4 h-4 text-orange-600" />
              <span>Date: {date} · {mealType === 'Lunch' ? 'Lunch Service' : 'Dinner Service'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4 text-stone-500" />
              <span>Reminder: Free street parking available outside on Almasguda Rd.</span>
            </div>
          </div>
          <Button variant="primary" fullWidth onClick={handleClose}>
            Done
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-xs text-stone-600">
            Enjoy casual dining in Badangpet. Welcoming solo diners, families with children, and lively friend groups.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Mobile Number *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98490 00000"
                className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Dining Option
              </label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value as 'Lunch' | 'Dinner')}
                className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              >
                <option value="Lunch">Lunch ({RESTAURANT_INFO.timings.lunch})</option>
                <option value="Dinner">Dinner ({RESTAURANT_INFO.timings.dinner})</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Guests
              </label>
              <input
                type="number"
                min="1"
                max="24"
                value={partySize}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 1;
                  setPartySize(val);
                  if (val === 1) setPreference('Solo Dining');
                }}
                className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Table Atmosphere Preference
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'Solo Dining', label: 'Solo Diner' },
                { id: 'Group Gathering', label: 'Group (Friends)' },
                { id: 'Family with Children', label: 'Family & Kids' },
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setPreference(opt.id as any)}
                  className={`py-2 px-2 text-xs font-medium rounded-lg border text-center transition-all cursor-pointer ${
                    preference === opt.id
                      ? 'border-orange-600 bg-orange-50 text-orange-800 font-semibold'
                      : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Special Requests (High chair for baby, mild spices, etc.)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Need high chair for toddler, extra napkins"
              className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-stone-100">
            <Button variant="ghost" size="md" type="button" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit">
              Confirm Reservation
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
