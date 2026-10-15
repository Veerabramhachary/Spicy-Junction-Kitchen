/**
 * Dispatcher Service for Orders & Table Bookings
 *
 * Supports:
 * 1. Pre-formatted WhatsApp wa.me links with full itemized bill & details
 * 2. Next.js API route dispatch (/api/order, /api/booking)
 * 3. Free external webhooks: Google Apps Script Web App (Sheets), Formspree, Zapier, Make
 * 4. Local audit logging
 */

import { OrderRecord, TableBooking } from '../types/restaurant';
import { restaurantConfig } from '../config/restaurant.config';
import { formatPrice } from './restaurantData';
import { WHATSAPP_NUMBER } from './contact';

/**
 * Builds the WhatsApp wa.me click-to-chat URL with a pre-filled, itemized text message.
 */
export function buildWhatsAppOrderUrl(order: OrderRecord, customPhone?: string): string {
  // Single source of truth: lib/contact.ts, derived from contact.whatsapp.
  const cleanPhone = (customPhone || WHATSAPP_NUMBER).replace(/[^0-9]/g, '');

  const itemLines = order.items
    .map((ci) => {
      const note = ci.specialInstructions ? ` [Note: ${ci.specialInstructions}]` : '';
      return `• ${ci.quantity}x ${ci.item.name} (${formatPrice(ci.item.price * ci.quantity)})${note}`;
    })
    .join('\n');

  const textLines = [
    `*NEW ORDER #${order.id}*`,
    `*Restaurant:* ${restaurantConfig.brand.name}`,
    `--------------------------------`,
    `*Order Type:* ${order.serviceOption}`,
    `*Fulfillment Time:* ${order.fulfillmentTime}`,
    `*Customer:* ${order.customer.name}`,
    `*Phone:* ${order.customer.phone}`,
    order.customer.email ? `*Email:* ${order.customer.email}` : null,
    order.customer.tableNumber ? `*Table:* ${order.customer.tableNumber}` : null,
    order.customer.deliveryAddress ? `*Delivery Address:* ${order.customer.deliveryAddress}` : null,
    `--------------------------------`,
    `*Items Ordered:*`,
    itemLines,
    `--------------------------------`,
    `*Subtotal:* ${formatPrice(order.subtotal)}`,
    order.packagingFee > 0 ? `*Packaging:* ${formatPrice(order.packagingFee)}` : null,
    order.taxAmount > 0 ? `*Tax:* ${formatPrice(order.taxAmount)}` : null,
    `*GRAND TOTAL:* ${formatPrice(order.total)}`,
    `--------------------------------`,
    `*Payment Choice:* ${order.paymentMethod.replace(/_/g, ' ').toUpperCase()}`,
    `*Payment Status:* ${order.paymentStatus === 'paid' ? 'PAID' : 'PAY ON ARRIVAL'}`,
    order.customer.notes ? `*Special Request:* ${order.customer.notes}` : null,
    `--------------------------------`,
    `📍 ${restaurantConfig.address.shop}, ${restaurantConfig.address.locality}, ${restaurantConfig.address.city}`,
  ]
    .filter((line): line is string => Boolean(line))
    .join('\n');

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(textLines)}`;
}

/**
 * Builds the WhatsApp wa.me URL for table reservations.
 */
export function buildWhatsAppBookingUrl(booking: TableBooking, customPhone?: string): string {
  // Single source of truth: lib/contact.ts, derived from contact.whatsapp.
  const cleanPhone = (customPhone || WHATSAPP_NUMBER).replace(/[^0-9]/g, '');

  const textLines = [
    `*TABLE RESERVATION REQUEST*`,
    `*Booking ID:* ${booking.id || 'NEW'}`,
    `*Restaurant:* ${restaurantConfig.brand.name}`,
    `--------------------------------`,
    `*Guest Name:* ${booking.name}`,
    `*Contact Number:* ${booking.phone}`,
    `*Date:* ${booking.date}`,
    `*Meal Service:* ${booking.mealType}`,
    booking.timeSlot ? `*Time:* ${booking.timeSlot}` : null,
    `*Party Size:* ${booking.partySize} Guests`,
    `*Atmosphere Preference:* ${booking.diningPreference}`,
    booking.specialRequests ? `*Special Request:* ${booking.specialRequests}` : null,
    `--------------------------------`,
    `📍 ${restaurantConfig.address.shop}, ${restaurantConfig.address.locality}`,
    `🚗 ${restaurantConfig.features.find((f) => f.icon === 'car')?.title || 'Free Street Parking'}`,
  ]
    .filter((line): line is string => Boolean(line))
    .join('\n');

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(textLines)}`;
}

export interface DispatchResult {
  success: boolean;
  channel: 'internal_api' | 'google_sheet' | 'custom_webhook' | 'local_fallback';
  message: string;
  data?: any;
}

/**
 * Dispatches the order payload to configured destinations:
 * 1. Next.js internal API route (/api/orders)
 * 2. Optional Google Sheets webhook (via Apps Script Web App)
 * 3. Optional Custom webhook (Zapier, Formspree, Make, n8n)
 */
export async function dispatchOrderNotification(order: OrderRecord): Promise<DispatchResult> {
  // The browser's ONLY job is to POST to the internal API route.
  //
  // This function previously also POSTed straight to the Google Sheet webhook
  // and the generic webhook from the client. Because /api/orders forwards to
  // those same destinations server-side, configuring both
  // `integrations.googleSheetWebhookUrl` and `integrations.webhookUrl` produced
  // FOUR dispatches per order - duplicate sheet rows and duplicate
  // Zapier/Formspree notifications. Server-side fan-out is also more reliable
  // (no CORS/`no-cors` opacity, and it can read env vars the browser cannot).
  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    if (res.ok) {
      const data = await res.json();
      return {
        success: true,
        channel: 'internal_api',
        message: 'Order recorded in internal endpoint',
        data,
      };
    }
  } catch {
    // API endpoint unreachable - the order is still stored locally and the
    // customer can always dispatch it over WhatsApp from the receipt.
  }

  return {
    success: true,
    channel: 'local_fallback',
    message: 'Order stored locally and ready for WhatsApp dispatch',
  };
}

/**
 * Dispatches table booking notification to configured destinations.
 */
export async function dispatchBookingNotification(booking: TableBooking): Promise<DispatchResult> {

  // As with orders: the browser only posts to the internal API route, and
  // /api/bookings handles the Google Sheet / webhook fan-out server-side.
  // Dispatching from both places duplicated every booking.
  try {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking),
    });
    if (res.ok) {
      const data = await res.json();
      return {
        success: true,
        channel: 'internal_api',
        message: 'Booking recorded in internal endpoint',
        data,
      };
    }
  } catch {
    // API endpoint unreachable - the booking stays on the guest's device and
    // can be resent over WhatsApp from the confirmation screen.
  }

  return {
    success: true,
    channel: 'local_fallback',
    message: 'Booking stored locally and ready for WhatsApp dispatch',
  };
}
