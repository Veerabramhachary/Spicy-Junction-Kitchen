import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Guards the single-source-of-truth refactor.
 *
 * The number used to be declared twice - `contact.whatsapp` ("7981901713") and
 * `integrations.whatsappOrders.phoneNumber` ("919849281734") - and the two had
 * drifted apart. Orders and bookings went to one number while the contact page
 * and the UPI id advertised the other.
 *
 * These tests fail if a second copy of the number is reintroduced anywhere, and
 * assert that every generated link agrees.
 */
const EXPECTED_WHATSAPP = '917981901713'; // +91 7981901713 -> digits only

test.describe('contact number consistency', () => {
  test('order WhatsApp link uses the configured number', async ({ page }) => {
    await page.goto('/order');
    await page.getByRole('button', { name: /Add to Order ·/ }).first().click();
    await page.getByRole('button', { name: 'Close cart' }).click();

    await page.getByPlaceholder('e.g. Ramesh Reddy').fill('Test Guest');
    await page.getByPlaceholder('+91 98490 00000').fill('9876543210');
    await page.getByRole('button', { name: /Place Takeaway Order/ }).click();
    await expect(page.getByText('Order Confirmed!')).toBeVisible({ timeout: 10_000 });

    const waHref = await page
      .getByRole('link', { name: /Open in WhatsApp/ })
      .getAttribute('href');

    expect(waHref).toContain(`wa.me/${EXPECTED_WHATSAPP}`);
    // The old conflicting number must not appear anywhere.
    expect(waHref).not.toContain('919849281734');
    expect(waHref).not.toContain('9849281734');
  });

  test('reservation WhatsApp link uses the same number', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Reserve Table' }).first().click();
    await page.getByPlaceholder('Your name').fill('Priya Sharma');
    await page.getByPlaceholder('+91 98490 00000').fill('9000000001');
    await page.getByRole('button', { name: 'Confirm Reservation' }).click();

    const waHref = await page
      .getByRole('link', { name: /Send Reservation to WhatsApp/ })
      .getAttribute('href');

    expect(waHref).toContain(`wa.me/${EXPECTED_WHATSAPP}`);
    expect(waHref).not.toContain('919849281734');
  });

  test('contact page WhatsApp button uses the same number', async ({ page }) => {
    await page.goto('/contact');
    const waHref = await page.getByRole('link', { name: /WhatsApp Us/ }).getAttribute('href');
    expect(waHref).toContain(`wa.me/${EXPECTED_WHATSAPP}`);
  });

  test('UPI id derives from the same number', async ({ page }) => {
    await page.goto('/order');
    await page.getByRole('button', { name: /Add to Order ·/ }).first().click();
    await page.getByRole('button', { name: 'Close cart' }).click();
    await page.getByPlaceholder('e.g. Ramesh Reddy').fill('Test Guest');
    await page.getByPlaceholder('+91 98490 00000').fill('9876543210');
    await page.getByRole('button', { name: 'UPI QR Code' }).click();
    await page.getByRole('button', { name: /Place Takeaway Order/ }).click();

    await expect(page.getByText('UPI ID:')).toBeVisible();
    await expect(page.getByText(`UPI ID: ${EXPECTED_WHATSAPP}@upi`)).toBeVisible();
  });

  test('tel: links contain no spaces', async ({ page }) => {
    await page.goto('/contact');
    const tels = await page.locator('a[href^="tel:"]').evaluateAll((els) =>
      els.map((e) => (e as HTMLAnchorElement).getAttribute('href') || '')
    );
    expect(tels.length).toBeGreaterThan(0);
    for (const href of tels) {
      expect(href, `tel: href must not contain spaces -> "${href}"`).not.toContain(' ');
      expect(href).toMatch(/^tel:\+\d{10,15}$/);
    }
  });

  test('the number is declared in exactly one place in source', async () => {
    // Node-side source scan: the canonical number must appear only as
    // `contact.whatsapp` in the config. Any second literal copy is the bug
    // this suite exists to prevent.
    const cfg = readFileSync(
      join(process.cwd(), 'config', 'restaurant.config.ts'),
      'utf8'
    );

    // The legacy, conflicting number must be gone from config entirely.
    expect(cfg).not.toContain('919849281734');
    expect(cfg).not.toContain('9849281734');

    // whatsappOrders must no longer carry its own phoneNumber field.
    const integrationsBlock = cfg.slice(cfg.indexOf('integrations:'));
    expect(integrationsBlock).not.toMatch(/phoneNumber\s*:/);

    // Exactly one whatsapp declaration in the contact block.
    const whatsappDecls = cfg.match(/whatsapp\s*:\s*["']/g) || [];
    expect(whatsappDecls).toHaveLength(1);

    // Assert the value that links actually resolve to, not the literal text.
    // lib/contact.ts strips "+" and spaces, so "+91 7981901713" and
    // "917981901713" both work; the invariant that matters is the digits.
    const declared = cfg.match(/whatsapp\s*:\s*["']([^"']+)["']/)?.[1] ?? '';
    expect(declared.replace(/[^0-9]/g, '')).toBe(EXPECTED_WHATSAPP);
    expect(declared.replace(/[^0-9]/g, '')).toMatch(/^\d{10,15}$/);
  });

  test('address.full and address.postalCode agree', () => {
    // These two previously read 500113 and 500112 - two pincodes for one
    // address, and both render publicly. Source-level so it fails before deploy.
    const cfg = readFileSync(join(process.cwd(), 'config', 'restaurant.config.ts'), 'utf8');
    const postalCode = cfg.match(/postalCode:\s*["']([^"']+)["']/)?.[1];
    const full = cfg.match(/\bfull:\s*["']([^"']+)["']/)?.[1];

    expect(postalCode, 'address.postalCode not found in config').toBeTruthy();
    expect(full, 'address.full not found in config').toBeTruthy();
    expect(
      full!.trim().endsWith(postalCode!),
      `address.full ends with "${full!.slice(-6)}" but postalCode is "${postalCode}"`
    ).toBe(true);
  });

  test('the contact number renders and links correctly', async ({ page }) => {
    await page.goto('/contact');
    // Rendered twice: the Direct Kitchen Helplines card and the footer.
    const links = page.getByRole('link', { name: '+91 7981901713' });
    await expect(links).toHaveCount(2);

    for (const href of await links.evaluateAll((els) =>
      els.map((e) => (e as HTMLAnchorElement).getAttribute('href') || '')
    )) {
      expect(href).toBe('tel:+917981901713');
    }
  });
});