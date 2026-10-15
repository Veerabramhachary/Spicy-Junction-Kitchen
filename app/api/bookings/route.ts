import { NextRequest, NextResponse } from "next/server";
import { logger, redactPhone } from "@/lib/logger";

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
        const body = await req.text();

        if (!body.trim()) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Request body is empty. Please send booking JSON.",
                },
                { status: 400 },
            );
        }

        let booking;

        try {
            booking = JSON.parse(body);
        } catch {
            return NextResponse.json(
                {
                    success: false,
                    error: "Invalid JSON in booking request body.",
                },
                { status: 400 },
            );
        }

        if (!booking || !booking.name || !booking.phone || !booking.date) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Invalid booking payload: name, phone, and date are required",
                },
                { status: 400 },
            );
        }

        // Forward to Google Sheet Webhook if configured

        const sheetWebhook = process.env.BOOKING_GOOGLE_SHEETS_WEBHOOK_URL;

        if (!sheetWebhook) {
            // Not an error - the booking is still accepted and the guest can
            // confirm over WhatsApp. Booking simply is not mirrored to a sheet.
            logger.dev(
                "[Booking API] BOOKING_GOOGLE_SHEETS_WEBHOOK_URL not set; booking not mirrored to a sheet",
            );
        } else {
            try {
                const response = await fetch(sheetWebhook, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        timestamp: new Date().toISOString(),
                        type: "booking",
                        bookingId: booking.id || "",
                        guestName: booking.name,
                        phone: booking.phone,
                        date: booking.date,
                        mealType: booking.mealType || "",
                        partySize: booking.partySize,
                        preference: booking.diningPreference || "",
                        specialRequests: booking.specialRequests || "",
                    }),
                    cache: "no-store",
                });

                const responseText = await response.text();

                logger.dev(
                    `[Booking API] Sheets responded ${response.status}: ${responseText.slice(0, 200)}`,
                );

                if (!response.ok) {
                    logger.error(
                        `[Booking API] Sheets HTTP ${response.status} for booking ${booking.id}: ${responseText.slice(0, 200)}`,
                    );
                } else {
                    try {
                        const result = JSON.parse(responseText);

                        if (!result.success) {
                            logger.warn(
                                `[Booking API] Sheets rejected booking ${booking.id}:`,
                                result.error,
                            );
                        } else {
                            logger.dev(
                                `[Booking API] Booking recorded in Sheets: ${result.bookingId}`,
                            );
                        }
                    } catch {
                        logger.warn(
                            `[Booking API] Unexpected Sheets response shape for booking ${booking.id}`,
                        );
                    }
                }
            } catch (error) {
                logger.error(
                    `[Booking API] Failed forwarding booking ${booking.id} to Sheets:`,
                    error,
                );
            }
        }

        return NextResponse.json({
            success: true,
            message: "Booking received successfully",
            bookingId: booking.id,
            timestamp: new Date().toISOString(),
        });
    } catch (error: any) {
        logger.error("[Booking API] Error:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Internal server error" },
            { status: 500 },
        );
    }
}

export async function GET() {
    return NextResponse.json({
        status: "ok",
        endpoint: "/api/bookings",
        description:
            "Table reservation intake route. Send POST with booking JSON payload.",
    });
}
