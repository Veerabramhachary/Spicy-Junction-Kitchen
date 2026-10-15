import { test, expect } from '@playwright/test';
import { PRICE } from './helpers';

test('Esc closes the cart drawer', async ({ page }) => {
  await page.goto('/menu');
  await page.getByRole('button', { name: /Add to Order/ }).first().click();
  await expect(page.getByText('Your Order Bag')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByText('Your Order Bag')).toBeHidden();
});

test('Esc closes the receipt modal', async ({ page }) => {
  await page.goto('/order');
  await page.getByRole('button', { name: /Add to Order ·/ }).first().click();
  await page.getByRole('button', { name: 'Close cart' }).click();
  await page.getByPlaceholder('e.g. Ramesh Reddy').fill('Test Guest');
  await page.getByPlaceholder('+91 98490 00000').fill('9876543210');
  await page.getByRole('button', { name: /Place Takeaway Order/ }).click();
  await expect(page.getByText('Order Confirmed!')).toBeVisible({ timeout: 10_000 });
  await page.keyboard.press('Escape');
  await expect(page.getByText('Order Confirmed!')).toBeHidden();
});

test('Esc closes the guest review modal', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Add Guest Review' }).click();
  await expect(page.getByText('Leave Your Review for')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByText('Leave Your Review for')).toBeHidden();
});

test('Esc closes the reservation modal', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Reserve Table' }).first().click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
});

test('reservation form does not leak guest details between opens', async ({ page }) => {
  await page.goto('/');
  const open = page.getByRole('button', { name: 'Reserve Table' }).first();

  await open.click();
  await page.getByPlaceholder('Your name').fill('Priya Sharma');
  await page.getByPlaceholder('+91 98490 00000').fill('9000000001');
  await page.getByPlaceholder(/high chair for toddler/i).fill('Window seat please');
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(page.getByRole('dialog')).toBeHidden();

  await open.click();
  await expect(page.getByPlaceholder('Your name')).toHaveValue('');
  await expect(page.getByPlaceholder('+91 98490 00000')).toHaveValue('');
  await expect(page.getByPlaceholder(/high chair for toddler/i)).toHaveValue('');
  // The Guests label has no htmlFor/id pairing, so it is not reachable via
  // getByLabel - select the number input directly.
  await expect(page.locator('input[type="number"]')).toHaveValue('2');
});

test('email field exists and reaches the order record', async ({ page }) => {
  await page.goto('/order');
  const email = page.getByPlaceholder(/For order updates/);
  await expect(email).toBeVisible();

  await page.getByRole('button', { name: /Add to Order ·/ }).first().click();
  await page.getByRole('button', { name: 'Close cart' }).click();

  await email.fill('guest@example.com');
  await page.getByPlaceholder('e.g. Ramesh Reddy').fill('Test Guest');
  await page.getByPlaceholder('+91 98490 00000').fill('9876543210');
  await page.getByRole('button', { name: /Place Takeaway Order/ }).click();

  await expect(page.getByText('Order Confirmed!')).toBeVisible({ timeout: 10_000 });

  const stored = await page.evaluate(() => {
    const raw = localStorage.getItem('sjk_order_history');
    if (!raw) return null;
    return JSON.parse(raw)[0];
  });
  expect(stored?.customer?.email).toBe('guest@example.com');
});

test('receipt shows paid status after UPI checkout', async ({ page }) => {
  await page.goto('/order');
  await page.getByRole('button', { name: /Add to Order ·/ }).first().click();
  await page.getByRole('button', { name: 'Close cart' }).click();

  await page.getByPlaceholder('e.g. Ramesh Reddy').fill('Test Guest');
  await page.getByPlaceholder('+91 98490 00000').fill('9876543210');
  await page.getByRole('button', { name: 'UPI QR Code' }).click();
  await page.getByRole('button', { name: /Place Takeaway Order/ }).click();

  await expect(page.getByText('Scan & Pay')).toBeVisible();
  await page.getByRole('button', { name: 'Simulate Payment Success' }).click();

  await expect(page.getByText('Order Confirmed!')).toBeVisible({ timeout: 10_000 });
  await expect(page.getByText('PAID')).toBeVisible();
  // Scope to the receipt's payment row - "UPI QR" also matches the (now hidden
  // behind the modal) payment selector on the order page. The receipt applies a
  // CSS `uppercase`, which does not change the DOM text, so match case-insensitively.
  await expect(page.getByText('Method:').locator('..')).toContainText(/upi qr/i);
});

test('receipt shows pay-on-arrival for counter payment', async ({ page }) => {
  await page.goto('/order');
  await page.getByRole('button', { name: /Add to Order ·/ }).first().click();
  await page.getByRole('button', { name: 'Close cart' }).click();

  await page.getByPlaceholder('e.g. Ramesh Reddy').fill('Test Guest');
  await page.getByPlaceholder('+91 98490 00000').fill('9876543210');
  await page.getByRole('button', { name: /Place Takeaway Order/ }).click();

  await expect(page.getByText('Order Confirmed!')).toBeVisible({ timeout: 10_000 });
  await expect(page.getByText('Pay on arrival')).toBeVisible();
});

test('grand total math holds for Takeaway and Dine-in', async ({ page }) => {
  await page.goto('/order');
  await page.getByRole('button', { name: `Add to Order · ₹${PRICE.soloChickenMeal}` }).click();
  await page.getByRole('button', { name: 'Close cart' }).click();

  await expect(page.getByText(`Subtotal`).locator('..')).toContainText(`₹${PRICE.soloChickenMeal}`);
  await expect(page.getByText('Grand Total').locator('..')).toContainText(`₹${PRICE.soloChickenMeal + 20}`);

  await page.getByRole('textbox', { name: /Table Number/ }).isVisible().catch(() => {});
  await page.getByText('Dine-In Table Pre-Order').click();
  await expect(page.getByText('Grand Total').locator('..')).toContainText(`₹${PRICE.soloChickenMeal}`);
});