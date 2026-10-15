import { NextRequest, NextResponse } from "next/server";
import { restaurantConfig } from "@/config/restaurant.config";
import { logger, redactPhone } from "@/lib/logger";

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

        // `.length` matters: a plain `!order.items` is false for an empty array, so
        // a zero-item order used to be accepted with a 200.
        if (
            !order ||
            !order.customer ||
            !Array.isArray(order.items) ||
            order.items.length === 0
        ) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Invalid order payload: customer and a non-empty items array are required",
                },
                { status: 400 },
            );
        }

        // Dev-only: the Google Sheet is the system of record, so production logs
        // do not need a line per order. Phone is redacted - customer names and
        // numbers should not end up in platform logs.
        logger.dev(
            `[Order API] New order: #${order.id} customer=${order.customer.name} phone=${redactPhone(order.customer.phone)} total=${order.total}`,
        );

        // If an external webhook is defined in server environment variables or config, forward it
        const externalWebhook =
            process.env.ORDER_WEBHOOK_URL ||
            restaurantConfig.integrations?.webhookUrl;
        if (externalWebhook) {
            try {
                await fetch(externalWebhook, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ event: "order.created", order }),
                });
            } catch (webhookErr) {
                logger.error(
                    "[Order API] Failed forwarding to external webhook:",
                    webhookErr,
                );
            }
        }

        // If Google Sheet webhook is defined in server env, forward it

        const sheetWebhook = process.env.ORDER_GOOGLE_SHEETS_WEBHOOK_URL;

        if (sheetWebhook) {
            try {
                const response = await fetch(sheetWebhook, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        timestamp: new Date().toISOString(),
                        type: "order",
                        orderId: order.id,
                        customerName: order.customer.name,
                        customerPhone: order.customer.phone,
                        customerEmail: order.customer.email || "",
                        serviceOption: order.serviceOption || "",
                        fulfillmentTime: order.fulfillmentTime || "",
                        items: order.items
                            .map((i: any) => `${i.quantity}x ${i.item.name}`)
                            .join("; "),
                        total: order.total,
                        notes: order.customer.notes || "",
                    }),
                    cache: "no-store",
                });

                const responseText = await response.text();

                logger.dev(
                    `[Order API] Sheets responded ${response.status}: ${responseText.slice(0, 200)}`,
                );

                if (!response.ok) {
                    logger.error(
                        `[Order API] Sheets HTTP ${response.status} for order #${order.id}: ${responseText.slice(0, 200)}`,
                    );
                } else {
                    try {
                        const result = JSON.parse(responseText);

                        if (!result.success) {
                            // The script answered 200 but reported failure -
                            // actionable, so this warns in production too.
                            logger.warn(
                                `[Order API] Sheets rejected order #${order.id}:`,
                                result.error,
                            );
                        } else {
                            logger.dev(
                                `[Order API] Order recorded in Sheets: ${result.orderId}`,
                            );
                        }
                    } catch {
                        logger.warn(
                            `[Order API] Unexpected Sheets response shape for order #${order.id}`,
                        );
                    }
                }
            } catch (error) {
                logger.error(
                    `[Order API] Failed forwarding order #${order.id} to Sheets:`,
                    error,
                );
            }
        }

        return NextResponse.json({
            success: true,
            message: "Order received successfully",
            orderId: order.id,
            timestamp: new Date().toISOString(),
            channelsNotified: [
                // No "in_memory_log" entry: there is no in-memory store and no
                // database. The listed channels are the ones actually used.
                externalWebhook ? "external_webhook" : null,
                sheetWebhook ? "google_sheet" : null,
            ].filter(Boolean),
        });
    } catch (error: any) {
        logger.error("[Order API] Error processing order:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Internal server error" },
            { status: 500 },
        );
    }
}

export async function GET() {
    return NextResponse.json({
        status: "ok",
        endpoint: "/api/orders",
        description:
            "Restaurant order intake route. Send POST with order JSON payload to record.",
    });
}
