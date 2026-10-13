import { NextRequest, NextResponse } from 'next/server';
import { restaurantConfig } from '@/config/restaurant.config';

/**
 * /api/bookings
 *
 * Plug-in point for developer backend integrations:
 * - Table reservation intake
 * - Google Calendar or Google Sheets append
 * - WhatsApp Business notification trigger
 * - Staff SMS or Email notification
 */

export async function POST(req: NextRequest) {
  try {
    const booking = await req.json();

    if (!booking || !booking.name || !booking.phone || !booking.date) {
      return NextResponse.json(
        { success: false, error: 'Invalid booking payload: name, phone, and date are required' },
        { status: 400 }
      );
    }

    console.log(`[Booking API] New table reservation: ${booking.id || 'N/A'} for ${booking.name} (${booking.partySize} guests, ${booking.mealType} on ${booking.date})`);

    // Forward to Google Sheet Webhook if configured
    const sheetWebhook = process.env.GOOGLE_SHEETS_WEBHOOK_URL || restaurantConfig.integrations?.googleSheetWebhookUrl;
    if (sheetWebhook) {
      try {
        await fetch(sheetWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            timestamp: new Date().toISOString(),
            type: 'booking',
            bookingId: booking.id,
            guestName: booking.name,
            phone: booking.phone,
            date: booking.date,
            mealType: booking.mealType,
            partySize: booking.partySize,
            preference: booking.diningPreference || '',
            specialRequests: booking.specialRequests || '',
          }),
        });
      } catch (err) {
        console.error('[Booking API] Failed forwarding to Google Sheet:', err);
      }
    }

    // Forward to generic webhook if configured
    const externalWebhook = process.env.BOOKING_WEBHOOK_URL || restaurantConfig.integrations?.webhookUrl;
    if (externalWebhook) {
      try {
        await fetch(externalWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ event: 'table.reserved', booking }),
        });
      } catch (webhookErr) {
        console.error('[Booking API] Failed forwarding to external webhook:', webhookErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Booking received successfully',
      bookingId: booking.id,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[Booking API] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: '/api/bookings',
    description: 'Table reservation intake route. Send POST with booking JSON payload.',
  });
}
