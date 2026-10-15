import { Page, expect } from '@playwright/test';

/** Cart / order state lives in localStorage. Each test gets a fresh context by
 *  default, so this is only needed when a test reloads deliberately. */
export async function clearAppState(page: Page) {
  await page.evaluate(() => {
    localStorage.removeItem('sjk_restaurant_cart');
    localStorage.removeItem('sjk_order_history');
    localStorage.removeItem('spicy_junction_manual_reviews');
  });
}

/** Config facts asserted throughout: tax 0%, packaging Rs20 on Takeaway only. */
export const PACKAGING_FEE = 20;

/** Menu prices from config/restaurant.config.ts. */
export const PRICE = {
  chickenDumBiryani: 240,
  muttonDumBiryani: 360,
  eggDumBiryani: 190,
  paneerDumBiryani: 210,
  soloChickenMeal: 260,
  soloEggBox: 180,
  soloPaneerMeal: 230,
  chicken65: 190,
  chilliChicken: 200,
  paneerTikka: 180,
  samosa: 90,
  cornPepperFry: 140,
  butterChicken: 240,
  salan: 90,
  rumaliRoti: 50,
  butterNaan: 60,
  doubleKaMeetha: 110,
  chaas: 50,
};

/** Add a dish from the menu grid by its visible card title. */
export async function addDishFromMenu(page: Page, dishName: string) {
  const card = page.locator('div').filter({ hasText: dishName }).locator('button', { hasText: /Add to Order|Add Another/ }).last();
  await card.click();
}

/** Close the cart drawer if it is open. */
export async function closeCart(page: Page) {
  const closeBtn = page.getByRole('button', { name: 'Close cart' });
  if (await closeBtn.isVisible().catch(() => false)) {
    await closeBtn.click();
    await expect(page.getByText('Your Order Bag')).toBeHidden();
  }
}

/** Read the id of the newest persisted order from localStorage. */
export async function newestOrderId(page: Page): Promise<string> {
  return page.evaluate(() => {
    const raw = localStorage.getItem('sjk_order_history');
    if (!raw) throw new Error('no order history in localStorage');
    return JSON.parse(raw)[0].id as string;
  });
}

/** Assert no element is horizontally overflowing the viewport. */
export async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  // body has overflow-x:hidden so scrollWidth often clamps; also check innerWidth.
  expect(
    overflow.scrollWidth,
    `document scrollWidth ${overflow.scrollWidth} exceeds viewport ${overflow.clientWidth}`
  ).toBeLessThanOrEqual(overflow.clientWidth + 1);
}

/**
 * Hit-test a locator's centre point: returns a description of whatever element
 * actually receives the click. If this is not the target (or a descendant of it)
 * then the element is covered and clicks silently do nothing.
 */
export async function hitTestCentre(page: Page, selector: string) {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return { found: false as const };
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const top = document.elementFromPoint(cx, cy);
    if (!top) return { found: true as const, insideViewport: false, covered: true, by: null };
    return {
      found: true as const,
      insideViewport: cx >= 0 && cx <= window.innerWidth && cy >= 0 && cy <= window.innerHeight,
      covered: !(el === top || el.contains(top)),
      by: top.outerHTML.slice(0, 140),
      box: { x: r.x, y: r.y, width: r.width, height: r.height },
      viewport: { width: window.innerWidth, height: window.innerHeight },
    };
  }, selector);
}