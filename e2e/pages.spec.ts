import { test, expect } from '@playwright/test';
import { PRICE, newestOrderId } from './helpers';

/** Menu filtering, search and reset - the largest untested surface. */
test.describe('menu filtering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/menu');
  });

  const cardCount = (page: any) =>
    page.getByRole('button', { name: /Add to Order|Add Another/ }).count();

  test('renders the full catalogue with no filters', async ({ page }) => {
    await expect.poll(() => cardCount(page)).toBe(18);
  });

  test('category tabs filter the grid', async ({ page }) => {
    await page.getByRole('button', { name: 'Hyderabadi Dum Biryani', exact: true }).click();
    await expect.poll(() => cardCount(page)).toBe(4);

    await page.getByRole('button', { name: 'Solo Dining Combos' }).click();
    await expect.poll(() => cardCount(page)).toBe(3);

    await page.getByRole('button', { name: 'All Offerings' }).click();
    await expect.poll(() => cardCount(page)).toBe(18);
  });

  test('diet filters', async ({ page }) => {
    await page.getByRole('button', { name: 'Vegetarian', exact: true }).click();
    const n = await cardCount(page);
    expect(n).toBeGreaterThan(0);
    expect(n).toBeLessThan(18);

    await page.getByRole('button', { name: 'Egg', exact: true }).click();
    // egg + veg = the two egg dishes plus the veg ones still matching
    expect(await cardCount(page)).toBeGreaterThan(0);
  });

  test('spice filter narrows to fiery dishes', async ({ page }) => {
    await page.getByRole('button', { name: 'Fiery' }).click();
    await expect.poll(() => cardCount(page)).toBe(2);
    await expect(page.getByText('Hyderabadi Chicken 65 (Crispy Small Plate)')).toBeVisible();
    await expect(page.getByText('Andhra Green Chilli Chicken Dry')).toBeVisible();
  });

  test('search matches dish names', async ({ page }) => {
    await page.getByPlaceholder(/Search dishes/).fill('biryani');
    const n = await cardCount(page);
    expect(n).toBeGreaterThan(0);
    expect(n).toBeLessThan(18);
  });

  test('search clear button restores the grid', async ({ page }) => {
    await page.getByPlaceholder(/Search dishes/).fill('biryani');
    await page.getByRole('button', { name: 'Clear' }).click();
    await expect.poll(() => cardCount(page)).toBe(18);
  });

  test('unmatched filters show the empty state', async ({ page }) => {
    await page.getByPlaceholder(/Search dishes/).fill('zzzznotadish');
    await expect(page.getByText('No dishes match your filters')).toBeVisible();
  });

  test('reset filters restores everything', async ({ page }) => {
    await page.getByPlaceholder(/Search dishes/).fill('zzzznotadish');
    await page.getByRole('button', { name: 'Fiery' }).click();
    await page.getByRole('button', { name: 'Vegetarian', exact: true }).click();
    await page.getByRole('button', { name: 'Reset Filters' }).click();
    await expect.poll(() => cardCount(page)).toBe(18);
  });

  test('currency symbol in add-buttons comes from config, not a literal', async ({ page }) => {
  await page.goto('/menu');
  // DishCard previously hardcoded "₹" in the add-button label, so changing
  // currency.symbol in config left a stray ₹ on every card.
  const btn = page.getByRole('button', { name: /Add to Order ·/ }).first();
  const label = (await btn.textContent()) ?? '';
  expect(label).toMatch(/Add to Order · \S\d+/);
  expect(label).toContain('₹');
});

test('egg dishes get an egg indicator, not the non-veg dot', async ({ page }) => {
  await page.goto('/menu');
  await page.getByRole('button', { name: 'Egg', exact: true }).click();

  const eggDot = page.getByTitle('Contains Egg');
  await expect(eggDot.first()).toBeVisible();

  // No egg dish should be presenting itself as non-vegetarian.
  const mislabelled = await page
    .locator('span[title="Non-Vegetarian"]')
    .count();
  expect(mislabelled, 'egg dishes still rendering the non-veg indicator').toBe(0);
});

test('cart drawer shows the styled validation error, not the native tooltip', async ({
  page,
}) => {
  await page.goto('/menu');
  await page.getByRole('button', { name: /Add to Order/ }).first().click();
  // Name and phone deliberately left blank.
  await page.getByRole('button', { name: /Confirm & Track/ }).click();

  // `noValidate` lets handleCheckout run; without it the native tooltip
  // short-circuited submit and this in-app message was unreachable.
  await expect(
    page.getByText('Please enter your name and phone number to complete order.')
  ).toBeVisible();
});

test('order page shows its styled validation error', async ({ page }) => {
  await page.goto('/order');
  await page.getByRole('button', { name: /Add to Order ·/ }).first().click();
  await page.getByRole('button', { name: 'Close cart' }).click();
  await page.getByRole('button', { name: /Place Takeaway Order/ }).click();

  await expect(page.getByText(/Please provide your name and phone number/)).toBeVisible();
});

test('quick bites section lists every configured quick bite', async ({ page }) => {
    await page.goto('/order');
    const addButtons = page.getByRole('button', { name: '+ Add', exact: true });
    // 4 items set isQuickBite in config. `.slice(0, 3)` used to hide one of them
    // (Crispy Corn Pepper Fry), making it unaddable from this page.
    await expect.poll(() => addButtons.count()).toBe(4);

    const expected = [
      'Hyderabadi Chicken 65 (Crispy Small Plate)',
      'Andhra Green Chilli Chicken Dry',
      'Crispy Samosa Quick Bite (3 Pcs)',
      'Crispy Corn Pepper Fry (Small Plate)',
    ];
    for (const name of expected) {
      await expect(page.getByText(name).first()).toBeVisible();
    }
  });

  test('adding a dish flips the button to the in-bag state', async ({ page }) => {
    const btn = page
      .getByRole('button', { name: `Add to Order · ₹${PRICE.chickenDumBiryani}` })
      .first();
    await btn.click();
    await page.getByRole('button', { name: 'Close cart' }).click();
    await expect(page.getByRole('button', { name: /Add Another \(In Bag: 1\)/ }).first()).toBeVisible();
  });
});

test.describe('persistence', () => {
  test('cart survives a reload', async ({ page }) => {
    await page.goto('/menu');
    await page.getByRole('button', { name: /Add to Order/ }).first().click();
    await page.getByRole('button', { name: 'Close cart' }).click();

    await page.reload();

    await page.goto('/order');
    await expect(page.getByText('Order Summary (1 items)')).toBeVisible();
  });

  test('order history survives a reload and newest is first', async ({ page }) => {
    await page.goto('/order');

    // First order
    await page.getByRole('button', { name: /Add to Order ·/ }).first().click();
    await page.getByRole('button', { name: 'Close cart' }).click();
    await page.getByPlaceholder('e.g. Ramesh Reddy').fill('First Guest');
    await page.getByPlaceholder('+91 98490 00000').fill('9000000001');
    await page.getByRole('button', { name: /Place Takeaway Order/ }).click();
    await expect(page.getByText('Order Confirmed!')).toBeVisible({ timeout: 10_000 });
    await page.getByRole('button', { name: 'Done' }).click();

    // Second order
    await page.getByRole('button', { name: /Add to Order ·/ }).last().click();
    await page.getByRole('button', { name: 'Close cart' }).click();
    await page.getByPlaceholder('e.g. Ramesh Reddy').fill('Second Guest');
    await page.getByPlaceholder('+91 98490 00000').fill('9000000002');
    await page.getByRole('button', { name: /Place Takeaway Order/ }).click();
    await expect(page.getByText('Order Confirmed!')).toBeVisible({ timeout: 10_000 });
    await page.getByRole('button', { name: 'Done' }).click();

    await page.reload();

    // CartContext restores an order placed <2h ago as activeOrder, so the
    // receipt reopens on load and blocks the page until dismissed. Wait for it
    // to actually mount before closing, otherwise Escape fires into nothing.
    const receipt = page.getByText('Order Confirmed!');
    await expect(receipt).toBeVisible({ timeout: 10_000 });
    await page.getByRole('button', { name: 'Done' }).click();
    await expect(receipt).toBeHidden();

    await page.getByRole('button', { name: /Order History/ }).click();

    // The history tab now renders OrderHistoryModal (was an inline duplicate).
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText('Your Order History (2)');

    // Newest-first ordering, checked against the persisted store.
    const stored = await page.evaluate(() => {
      const raw = localStorage.getItem('sjk_order_history');
      return raw ? (JSON.parse(raw) as any[]).map((o) => ({ id: o.id, name: o.customer.name })) : [];
    });
    expect(stored).toHaveLength(2);
    expect(stored[0].name).toBe('Second Guest');
    expect(stored[1].name).toBe('First Guest');

    // And the UI lists them in that order.
    const ids = await dialog
      .locator('span')
      .filter({ hasText: /^#[A-Z]+-\d+$/ })
      .allTextContents();
    expect(ids).toHaveLength(2);
    expect(ids[0]).toBe(`#${stored[0].id}`);
  });

  test('re-order restores the original quantities', async ({ page }) => {
    await page.goto('/order');

    // One dish, quantity 3.
    await page.getByRole('button', { name: `Add to Order · ₹260` }).first().click();
    await page.getByRole('button', { name: 'Close cart' }).click();
    await page.getByPlaceholder('e.g. Ramesh Reddy').fill('Bulk Guest');
    await page.getByPlaceholder('+91 98490 00000').fill('9000000003');
    for (let i = 0; i < 2; i++) {
      await page.getByRole('button', { name: /^Increase quantity of/ }).first().click();
    }
    await expect(page.getByText('Order Summary (1 items)')).toBeVisible();

    await page.getByRole('button', { name: /Place Takeaway Order/ }).click();
    await expect(page.getByText('Order Confirmed!')).toBeVisible({ timeout: 10_000 });
    await page.getByRole('button', { name: 'Done' }).click();

    await page.getByRole('button', { name: /Order History/ }).click();
    const dialog = page.getByRole('dialog');
    await dialog.getByRole('button', { name: /^Re-order/ }).click();

    // Read the restored bag from storage rather than climbing the cart DOM -
    // this asserts the behaviour without depending on drawer markup.
    await expect(page.getByText('Your Order Bag')).toBeVisible();
    await expect
      .poll(async () =>
        page.evaluate(() => {
          const raw = localStorage.getItem('sjk_restaurant_cart');
          if (!raw) return null;
          const items = JSON.parse(raw);
          return items.map((c: any) => ({ id: c.item.id, qty: c.quantity }));
        })
      )
      .toEqual([{ id: 'solo-chicken-biryani-combo', qty: 3 }]);
  });

  test('guest review survives a reload', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Add Guest Review' }).click();
    await page.getByPlaceholder('e.g. Ramesh K.').fill('Playwright Reviewer');
    await page.getByPlaceholder(/How was the dum biryani/).fill('Automated review body');
    await page.getByRole('button', { name: 'Save Review' }).click();
    await expect(page.getByText('Thank You for Your Feedback!')).toBeVisible({ timeout: 10_000 });

    await page.reload();
    await expect(page.getByText('Playwright Reviewer')).toBeVisible();
    await expect(page.getByText('Manual Guest Review')).toBeVisible();
  });
});

test.describe('navigation and chrome', () => {
  test('every navbar link routes correctly', async ({ page, isMobile }) => {
    // The desktop nav is `hidden md:flex`; below the md breakpoint its links are
    // display:none and the hamburger overlay takes over (covered separately in
    // mobile-diagnostic.spec.ts).
    test.skip(!!isMobile, 'desktop nav is hidden below the md breakpoint');

    const routes: Array<[string, RegExp]> = [
      ['Home', /\/$/],
      ['Menu & Dishes', /\/menu/],
      ['Takeaway & Order', /\/order/],
      ['Atmosphere', /\/atmosphere/],
      ['Location & Hours', /\/contact/],
    ];
    for (const [label, pattern] of routes) {
      await page.goto('/');
      await page.getByRole('navigation').getByRole('link', { name: label }).click();
      await expect(page).toHaveURL(pattern);
    }
  });

  test('footer links route correctly', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('contentinfo').getByRole('link', { name: 'Full Menu' }).click();
    await expect(page).toHaveURL(/\/menu/);

    await page.goto('/');
    await page.getByRole('contentinfo').getByRole('link', { name: 'Atmosphere' }).click();
    await expect(page).toHaveURL(/\/atmosphere/);
  });

  test('external links open in a new tab with noopener', async ({ page }) => {
    await page.goto('/');
    const links = await page
      .getByRole('link', { name: /Google Maps/ })
      .evaluateAll((els) =>
        els.map((e) => ({
          href: e.getAttribute('href'),
          target: e.getAttribute('target'),
          rel: e.getAttribute('rel'),
        }))
      );
    expect(links.length).toBeGreaterThan(0);
    for (const l of links) {
      expect(l.target).toBe('_blank');
      expect(l.rel).toContain('noopener');
      expect(l.href).toContain('http');
    }
  });

  test('404 page renders and both CTAs work', async ({ page }) => {
    await page.goto('/definitely-not-a-real-route');
    await expect(page.getByText('Page Not Found')).toBeVisible();
    await page.getByRole('button', { name: /Explore Food Menu/ }).click();
    await expect(page).toHaveURL(/\/menu/);

    await page.goto('/definitely-not-a-real-route');
    await page.getByRole('button', { name: /Back to Home/ }).click();
    await expect(page).toHaveURL(/\/$/);
  });
});