import { NextRequest, NextResponse } from 'next/server';
import { restaurantConfig } from '@/config/restaurant.config';

/**
 * /api/orders
 *
 * Plug-in point for developer backend integrations:
 * - Direct Google Sheets append via Google Sheets API or Apps Script
 * - Email notification (Resend, SendGrid, Postmark, Nodemailer)
 * - Headless CMS / POS database (Supabase, Postgres, Firebase, Strapi)
 * - Webhook forwarder (Zapier, Make, n8n)
 */

export async function POST(req: NextRequest) {
  try {
    const order = await req.json();

    if (!order || !order.customer || !order.items) {
      return NextResponse.json(
        { success: false, error: 'Invalid order payload' },
        { status: 400 }
      );
    }

    // Console logging for local development and server output
    console.log(`[Order API] New order received: #${order.id} for ${order.customer.name} (${order.customer.phone}) - Total: ${order.total}`);

    // If an external webhook is defined in server environment variables or config, forward it
    const externalWebhook = process.env.ORDER_WEBHOOK_URL || restaurantConfig.integrations?.webhookUrl;
    if (externalWebhook) {
      try {
        await fetch(externalWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ event: 'order.created', order }),
        });
      } catch (webhookErr) {
        console.error('[Order API] Failed forwarding to external webhook:', webhookErr);
      }
    }

    // If Google Sheet webhook is defined in server env, forward it
    const sheetWebhook = process.env.GOOGLE_SHEETS_WEBHOOK_URL || restaurantConfig.integrations?.googleSheetWebhookUrl;
    if (sheetWebhook) {
      try {
        await fetch(sheetWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            timestamp: new Date().toISOString(),
            type: 'order',
            orderId: order.id,
            customerName: order.customer.name,
            customerPhone: order.customer.phone,
            customerEmail: order.customer.email || '',
            serviceOption: order.serviceOption,
            fulfillmentTime: order.fulfillmentTime,
            items: order.items.map((i: any) => `${i.quantity}x ${i.item.name}`).join('; '),
            total: order.total,
            notes: order.customer.notes || '',
          }),
        });
      } catch (sheetErr) {
        console.error('[Order API] Failed forwarding to Google Sheet:', sheetErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Order received successfully',
      orderId: order.id,
      timestamp: new Date().toISOString(),
      channelsNotified: [
        'in_memory_log',
        externalWebhook ? 'external_webhook' : null,
        sheetWebhook ? 'google_sheet' : null,
      ].filter(Boolean),
    });
  } catch (error: any) {
    console.error('[Order API] Error processing order:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: '/api/orders',
    description: 'Restaurant order intake route. Send POST with order JSON payload to record.',
  });
}
