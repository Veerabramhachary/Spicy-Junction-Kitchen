import { restaurantConfig } from '../config/restaurant.config';

/**
 * Single source of truth for every phone / WhatsApp link in the app.
 *
 * Previously the number lived in two places:
 *   - `contact.whatsapp`                  ("7981901713")   -> /contact, UPI id
 *   - `integrations.whatsappOrders.phoneNumber` ("919849281734") -> order + booking wa.me links
 *
 * They had drifted apart, so orders went to one number while the contact page
 * and the UPI id advertised another. There is now exactly one number to edit:
 * `restaurantConfig.contact.whatsapp`. Everything else derives from it here.
 *
 * Format rules enforced by this module:
 *   - WhatsApp needs international digits only, no "+" and no spaces (wa.me).
 *   - `tel:` URIs must not contain spaces or many diallers ignore the call.
 *   - UPI ids are alphanumeric, so punctuation is stripped.
 */

/** Digits-only, country code included, no "+". e.g. "919849281734". */
export const WHATSAPP_NUMBER: string = restaurantConfig.contact.whatsapp.replace(
  /[^0-9]/g,
  ''
);

/** Pretty display form, e.g. "+91 7981901713". */
export const CONTACT_PHONE: string = restaurantConfig.contact.phone;

/** Dialable form for `tel:` - spaces removed so diallers accept it. */
export const TEL_HREF: string = `+${CONTACT_PHONE.replace(/[^0-9]/g, '')}`;

/** UPI virtual payment address built from the same number. */
export const UPI_ID: string = `${WHATSAPP_NUMBER}@upi`;

/**
 * Build a wa.me click-to-chat link.
 * @param text Prefilled message body.
 * @param number Override, digits only. Defaults to the configured number.
 */
export function buildWhatsAppLink(text: string, number: string = WHATSAPP_NUMBER): string {
  return `https://wa.me/${number.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
}

/** True when the configured number looks like a real international number. */
export function isValidWhatsAppNumber(number: string = WHATSAPP_NUMBER): boolean {
  return /^\d{10,15}$/.test(number);
}