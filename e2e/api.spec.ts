import { test, expect } from '@playwright/test';

/**
 * API route coverage for /api/orders and /api/bookings.
 *
 * These handlers only validate, log, and optionally forward to webhooks - there
 * is no database - so the contract worth pinning down is the status codes and
 * the validation guards.
 */

const VALID_ORDER = {
  id: 'SJK-0001',
  createdAt: new Date().toISOString(),
  items: [{ item: { id: 'biryani-special-chicken-dum', name: 'Special Hyderabadi Chicken Dum Biryani', price: 240 }, quantity: 2, specialInstructions: 'extra salan' }],
  subtotal: 480,
  packagingFee: 20,
  taxAmount: 0,
  total: 500,
  serviceOption: 'Takeaway',
  fulfillmentTime: 'ASAP (15–20 mins)',
  customer: { name: 'API Test', phone: '9876543210', email: 'api@test.dev' },
  paymentMethod: 'pay_at_counter',
  paymentStatus: 'pending_at_counter',
  status: 'confirmed',
};

const VALID_BOOKING = {
  id: 'SJK-RES-101',
  name: 'Booking Test',
  phone: '9876543210',
  date: '2030-01-01',
  timeSlot: 'Dinner (7:00 PM - 11:30 PM)',
  mealType: 'Dinner',
  partySize: 4,
  diningPreference: 'Group Gathering',
  createdAt: new Date().toISOString(),
};

test.describe('GET endpoints', () => {
  test('GET /api/orders reports healthy', async ({ request }) => {
    const res = await request.get('/api/orders');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('ok');
    expect(body.endpoint).toBe('/api/orders');
  });

  test('GET /api/bookings reports healthy', async ({ request }) => {
    const res = await request.get('/api/bookings');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('ok');
    expect(body.endpoint).toBe('/api/bookings');
  });
});

test.describe('POST /api/orders', () => {
  test('accepts a valid order', async ({ request }) => {
    const res = await request.post('/api/orders', { data: VALID_ORDER });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.orderId).toBe('SJK-0001');
    expect(Array.isArray(body.channelsNotified)).toBe(true);
  });

  test('rejects a payload with no customer', async ({ request }) => {
    const res = await request.post('/api/orders', {
      data: { ...VALID_ORDER, customer: undefined },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error).toContain('Invalid order payload');
  });

  test('rejects a payload with no items', async ({ request }) => {
    // Previously accepted with 200: the guard used `!order.items`, which is
    // false for an empty array. Now `order.items.length === 0` rejects it.
    const res = await request.post('/api/orders', { data: { ...VALID_ORDER, items: [] } });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error).toContain('non-empty items array');
  });

  test('rejects a payload whose items is not an array', async ({ request }) => {
    const res = await request.post('/api/orders', {
      data: { ...VALID_ORDER, items: 'nope' },
    });
    expect(res.status()).toBe(400);
  });

  test('rejects an empty body', async ({ request }) => {
    const res = await request.post('/api/orders', { data: {} });
    expect(res.status()).toBe(400);
  });

  test('rejects malformed JSON with 500', async ({ request }) => {
    // Send raw bytes - passing a plain string would be JSON-encoded by the
    // client and therefore still be valid JSON server-side.
    const res = await request.post('/api/orders', {
      headers: { 'Content-Type': 'application/json' },
      data: Buffer.from('{not valid json'),
    });
    expect(res.status()).toBe(500);
  });
});

test.describe('POST /api/bookings', () => {
  test('accepts a valid booking', async ({ request }) => {
    const res = await request.post('/api/bookings', { data: VALID_BOOKING });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.bookingId).toBe('SJK-RES-101');
  });

  // Playwright has no `test.each`; loop instead. `undefined` values are dropped
// by JSON.stringify, so each body genuinely omits that field.
  const missingFieldCases: Array<[string, Record<string, unknown>]> = [
    ['name', { ...VALID_BOOKING, name: undefined }],
    ['phone', { ...VALID_BOOKING, phone: undefined }],
    ['date', { ...VALID_BOOKING, date: undefined }],
  ];

  for (const [field, payload] of missingFieldCases) {
    test(`rejects a booking missing ${field}`, async ({ request }) => {
      const res = await request.post('/api/bookings', { data: payload });
      expect(res.status()).toBe(400);
      const body = await res.json();
      expect(body.error).toContain('name, phone, and date are required');
    });
  }

  test('rejects an empty body', async ({ request }) => {
    const res = await request.post('/api/bookings', { data: {} });
    expect(res.status()).toBe(400);
  });
});

test.describe('identifier scheme', () => {
  // Both ids derive from brand.idPrefix via lib/ids.ts. They used to be
  // unrelated: orders were "SPICYJUNCTION-1234" and reservations "SJK-RES-123".
  test('order id uses the configured prefix', async ({ page }) => {
    await page.goto('/order');
    await page.getByRole('button', { name: /Add to Order ·/ }).first().click();
    await page.getByRole('button', { name: 'Close cart' }).click();
    await page.getByPlaceholder('e.g. Ramesh Reddy').fill('Id Guest');
    await page.getByPlaceholder('+91 98490 00000').fill('9000000004');
    await page.getByRole('button', { name: /Place Takeaway Order/ }).click();
    await expect(page.getByText('Order Confirmed!')).toBeVisible({ timeout: 10_000 });

    const id = await page.evaluate(
      () => JSON.parse(localStorage.getItem('sjk_order_history')!)[0].id as string
    );
    expect(id).toMatch(/^SJK-\d{4}$/);
    expect(id).not.toMatch(/SPICYJUNCTION/);
  });

  test('reservation id uses the same prefix', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Reserve Table' }).first().click();
    await page.getByPlaceholder('Your name').fill('Id Booking');
    await page.getByPlaceholder('+91 98490 00000').fill('9000000005');
    await page.getByRole('button', { name: 'Confirm Reservation' }).click();

    await expect(page.getByText(/reservation number is/i)).toContainText('SJK-RES-');
  });
});

test.describe('UI triggers the API', () => {
  test('placing an order POSTs to /api/orders', async ({ page }) => {
    const posts: string[] = [];
    page.on('request', (req) => {
      if (req.method() === 'POST') posts.push(new URL(req.url()).pathname);
    });

    await page.goto('/order');
    await page.getByRole('button', { name: /Add to Order ·/ }).first().click();
    await page.getByRole('button', { name: 'Close cart' }).click();
    await page.getByPlaceholder('e.g. Ramesh Reddy').fill('Test Guest');
    await page.getByPlaceholder('+91 98490 00000').fill('9876543210');
    await page.getByRole('button', { name: /Place Takeaway Order/ }).click();
    await expect(page.getByText('Order Confirmed!')).toBeVisible({ timeout: 10_000 });

    await expect.poll(() => posts.filter((p) => p === '/api/orders').length).toBeGreaterThan(0);
  });

  test('placing an order dispatches exactly once', async ({ page }) => {
    const posts: string[] = [];
    page.on('request', (req) => {
      if (req.method() === 'POST') posts.push(req.url());
    });

    await page.goto('/order');
    await page.getByRole('button', { name: /Add to Order ·/ }).first().click();
    await page.getByRole('button', { name: 'Close cart' }).click();
    await page.getByPlaceholder('e.g. Ramesh Reddy').fill('Test Guest');
    await page.getByPlaceholder('+91 98490 00000').fill('9876543210');
    await page.getByRole('button', { name: /Place Takeaway Order/ }).click();
    await expect(page.getByText('Order Confirmed!')).toBeVisible({ timeout: 10_000 });
    await expect.poll(() => posts.filter((p) => p.includes('/api/orders')).length).toBe(1);

    // The browser must not also POST to the sheet/webhook itself. Server-side
    // fan-out already forwards there, so a second client-side POST produced
    // duplicate rows and duplicate notifications.
    await page.waitForTimeout(500);
    const external = posts.filter(
      (p) => !p.includes('/api/orders') && !p.startsWith('http://localhost:3000')
    );
    expect(external, `unexpected client-side dispatch: ${external.join(', ')}`).toEqual([]);
  });

  test('submitting a reservation dispatches exactly once', async ({ page }) => {
    const posts: string[] = [];
    page.on('request', (req) => {
      if (req.method() === 'POST') posts.push(req.url());
    });

    await page.goto('/');
    await page.getByRole('button', { name: 'Reserve Table' }).first().click();
    await page.getByPlaceholder('Your name').fill('Booking Guest');
    await page.getByPlaceholder('+91 98490 00000').fill('9000000001');
    await page.getByRole('button', { name: 'Confirm Reservation' }).click();
    await expect(page.getByText('Table Reserved!')).toBeVisible();

    await expect.poll(() => posts.filter((p) => p.includes('/api/bookings')).length).toBe(1);
    await page.waitForTimeout(500);
    const external = posts.filter(
      (p) => !p.includes('/api/bookings') && !p.startsWith('http://localhost:3000')
    );
    expect(external, `unexpected client-side dispatch: ${external.join(', ')}`).toEqual([]);
  });
});