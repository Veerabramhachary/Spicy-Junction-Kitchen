// Deterministic date helpers.
//
// Anything that reaches server-rendered markup must produce identical output on
// the server and in the browser, otherwise React reports a hydration mismatch.
// The usual culprits are `Date.now()`, `new Date()` during render, and
// locale/timezone-dependent `toLocale*String()` calls.

const KITCHEN_TIME_ZONE = 'Asia/Kolkata';
const KITCHEN_LOCALE = 'en-IN';

function formatWith(
  iso: string,
  options: Intl.DateTimeFormatOptions,
  timeZone: string | undefined
): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';

  try {
    return new Intl.DateTimeFormat(KITCHEN_LOCALE, {
      ...options,
      ...(timeZone ? { timeZone } : {}),
    }).format(date);
  } catch {
    // Environments without full ICU data: fall back to a stable numeric form.
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
  }
}

/** `dd Mon yyyy` in the kitchen's timezone. */
export function formatOrderDate(iso: string): string {
  return formatWith(
    iso,
    { day: '2-digit', month: 'short', year: 'numeric' },
    KITCHEN_TIME_ZONE
  );
}

/** `hh:mm am/pm` (24-hour) in the kitchen's timezone. */
export function formatOrderTime(iso: string): string {
  return formatWith(
    iso,
    { hour: '2-digit', minute: '2-digit', hour12: false },
    KITCHEN_TIME_ZONE
  );
}

/**
 * Today's date as `YYYY-MM-DD` using the *local* calendar day.
 * `toISOString()` would shift the day for users east of UTC, which is wrong for
 * a restaurant booking form.
 */
export function getTodayISODate(base: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${base.getFullYear()}-${pad(base.getMonth() + 1)}-${pad(base.getDate())}`;
}