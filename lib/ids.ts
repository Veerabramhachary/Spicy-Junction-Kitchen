import { restaurantConfig } from '../config/restaurant.config';

/**
 * Single source of truth for order and reservation identifiers.
 *
 * These used to use two unrelated schemes:
 *   - orders      -> `${brand.shortName.toUpperCase()}-1234`  e.g. "SPICYJUNCTION-1234"
 *   - reservations -> hardcoded literal "SJK-RES-123"
 *
 * So renaming the restaurant silently changed order ids but not reservation
 * ids, and the two formats looked unrelated to staff scanning them across
 * channels. Both are now derived from `brand.idPrefix`, configured in exactly
 * one place.
 */

/** Short uppercase prefix, e.g. "SJK". Sanitised defensively. */
export const ID_PREFIX: string = restaurantConfig.brand.idPrefix
  .toUpperCase()
  .replace(/[^A-Z0-9]/g, '');

/** Order id, e.g. "SJK-1234". Last 4 digits of the epoch timestamp. */
export function createOrderId(date: Date = new Date()): string {
  return `${ID_PREFIX}-${date.getTime().toString().slice(-4)}`;
}

/** Reservation id, e.g. "SJK-RES-123". Three random digits. */
export function createBookingId(): string {
  return `${ID_PREFIX}-RES-${Math.floor(100 + Math.random() * 900)}`;
}