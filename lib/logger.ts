/**
 * Minimal server-side logger.
 *
 * Replaces bare `console.log` / `console.error` in the API routes with two
 * differences that actually matter:
 *
 * 1. **Level gating.** Per-request success chatter (`info`, `debug`) is silent in
 *    production so logs stay readable, while failures (`warn`, `error`) always
 *    emit. Previously every order logged its customer name, phone number and the
 *    entire Google Sheets response body - noise at best, PII in logs at worst.
 *
 * 2. **Redaction.** `redactPhone` masks the middle of a phone number so a log
 *    line can identify a customer without storing their full number.
 *
 * Deliberately dependency-free - this is a single-restaurant app, not a
 * platform. If you outgrow it, swap the body for pino/winston; the call sites
 * are already shaped for that.
 */

const isProduction = process.env.NODE_ENV === 'production';

/** Emit only outside production. For per-request success detail. */
function dev(...args: unknown[]) {
  if (!isProduction) console.log(...args);
}

/** Always emit. For degraded-but-handled conditions. */
function warn(...args: unknown[]) {
  console.warn(...args);
}

/** Always emit. For failures the operator must see. */
function error(...args: unknown[]) {
  console.error(...args);
}

export const logger = { dev, warn, error };

/**
 * Mask a phone number for logging: `9876543210` -> `98*****210`.
 * Keeps enough digits to correlate with a booking without recording the number.
 */
export function redactPhone(phone: unknown): string {
  if (typeof phone !== 'string' || phone.length < 4) return '[no phone]';
  const digits = phone.replace(/\D/g, '');
  if (digits.length <= 4) return '*'.repeat(digits.length);
  return `${digits.slice(0, 2)}${'*'.repeat(digits.length - 5)}${digits.slice(-3)}`;
}