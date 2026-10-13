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

/**
 * Builds the WhatsApp wa.me click-to-chat URL with a pre-filled, itemized text message.
 */
export function buildWhatsAppOrderUrl(order: OrderRecord, customPhone?: string): string {
  const phone = customPhone || restaurantConfig.integrations?.whatsappOrders?.phoneNumber || restaurantConfig.contact.whatsapp;
  const cleanPhone = phone.replace(/[^0-9]/g, '');

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
  const phone = customPhone || restaurantConfig.integrations?.whatsappOrders?.phoneNumber || restaurantConfig.contact.whatsapp;
  const cleanPhone = phone.replace(/[^0-9]/g, '');

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
  const results: DispatchResult[] = [];

  // 1. Send to internal Next.js API route
  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    if (res.ok) {
      const data = await res.json();
      results.push({
        success: true,
        channel: 'internal_api',
        message: 'Order recorded in internal endpoint',
        data,
      });
    }
  } catch (err) {
    // API endpoint might be on a client-only build or unreachable
  }

  // 2. Google Sheets or external webhook if configured in restaurant.config.ts
  const sheetWebhook = restaurantConfig.integrations?.googleSheetWebhookUrl;
  if (sheetWebhook && sheetWebhook.trim()) {
    try {
      await fetch(sheetWebhook, {
        method: 'POST',
        mode: 'no-cors', // Google Apps Script Web Apps often require no-cors for simple browser POSTs
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'order',
          orderId: order.id,
          createdAt: order.createdAt,
          customerName: order.customer.name,
          customerPhone: order.customer.phone,
          customerEmail: order.customer.email || '',
          serviceOption: order.serviceOption,
          fulfillmentTime: order.fulfillmentTime,
          total: order.total,
          itemsCount: order.items.length,
          itemSummary: order.items.map((i) => `${i.quantity}x ${i.item.name}`).join(', '),
          notes: order.customer.notes || '',
        }),
      });
      results.push({
        success: true,
        channel: 'google_sheet',
        message: 'Dispatched to Google Sheet webhook',
      });
    } catch (err) {
      // quiet fail
    }
  }

  // 3. Custom generic webhook if configured
  const webhookUrl = restaurantConfig.integrations?.webhookUrl;
  if (webhookUrl && webhookUrl.trim()) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'order.placed',
          restaurant: restaurantConfig.brand.name,
          order,
        }),
      });
      results.push({
        success: true,
        channel: 'custom_webhook',
        message: 'Dispatched to external webhook',
      });
    } catch {
      // quiet fail
    }
  }

  if (results.length > 0) {
    return results[0];
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
  const results: DispatchResult[] = [];

  try {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking),
    });
    if (res.ok) {
      const data = await res.json();
      results.push({
        success: true,
        channel: 'internal_api',
        message: 'Booking recorded in internal endpoint',
        data,
      });
    }
  } catch {
    // quiet fail
  }

  const sheetWebhook = restaurantConfig.integrations?.googleSheetWebhookUrl;
  if (sheetWebhook && sheetWebhook.trim()) {
    try {
      await fetch(sheetWebhook, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'booking',
          bookingId: booking.id,
          createdAt: booking.createdAt,
          name: booking.name,
          phone: booking.phone,
          date: booking.date,
          mealType: booking.mealType,
          timeSlot: booking.timeSlot || '',
          partySize: booking.partySize,
          preference: booking.diningPreference,
          specialRequests: booking.specialRequests || '',
        }),
      });
      results.push({
        success: true,
        channel: 'google_sheet',
        message: 'Booking sent to Google Sheet',
      });
    } catch {
      // quiet fail
    }
  }

  if (results.length > 0) {
    return results[0];
  }

  return {
    success: true,
    channel: 'local_fallback',
    message: 'Booking stored locally and ready for WhatsApp dispatch',
  };
}
