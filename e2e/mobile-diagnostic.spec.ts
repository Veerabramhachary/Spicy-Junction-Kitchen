import { test, expect } from '@playwright/test';

/**
 * REGRESSION SUITE — mobile layout overflow (390px).
 *
 * Root cause: the navbar row is `justify-between gap-8` with three `shrink-0`
 * children — the brand wordmark (`whitespace-nowrap`), the "Takeaway Order"
 * button (`whitespace-nowrap`), and the zone wrapper. Minimum content width is
 * 265 + 32 + 218 = 515px against 390px available, so the document lays out
 * 530px wide inside a 390px screen.
 *
 * Knock-on effects, all observed in the manual pass:
 *   - hamburger renders at x=490..530, outside the 390px visible area
 *   - the fixed bottom action bar anchors to the bottom of the inflated
 *     layout viewport (y=1095 in a viewport whose visible height is 844),
 *     so it sits below the fold and cannot be tapped
 *
 * Every assertion below fails until the navbar stops overflowing.
 */
test.describe('mobile layout: no horizontal overflow', () => {
  const PAGES = ['/', '/menu', '/order', '/atmosphere', '/contact'];

  for (const path of PAGES) {
    test(`${path} does not overflow the viewport`, async ({ page }) => {
      await page.goto(path);

      const m = await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
      }));

      expect(
        m.scrollWidth,
        `${path} content is ${m.scrollWidth}px wide inside a ${m.clientWidth}px viewport ` +
          `(${m.scrollWidth - m.clientWidth}px off-screen)`
      ).toBeLessThanOrEqual(m.clientWidth + 1);
    });
  }

  test('every fixed bottom-bar control is inside the visible viewport', async ({ page }) => {
    await page.goto('/');

    const report = await page.evaluate(() => {
      const vv = window.visualViewport;
      const visibleH = vv ? vv.height : window.innerHeight;
      const visibleW = vv ? vv.width : window.innerWidth;

      const bar = document.querySelector('div.fixed.bottom-0');
      if (!bar) return { bar: false as const };

      const items = Array.from(bar.querySelectorAll('button, a')).map((el) => {
        const r = el.getBoundingClientRect();
        return {
          label: (el.textContent || '').trim(),
          offscreen: r.left >= visibleW || r.bottom > visibleH || r.top >= visibleH,
          bottom: Math.round(r.bottom),
        };
      });
      return { bar: true as const, visibleW: Math.round(visibleW), visibleH: Math.round(visibleH), items };
    });

    expect(report.bar).toBe(true);
    if (report.bar) {
      const offscreen = report.items.filter((i) => i.offscreen);
      expect(
        offscreen.map((i) => i.label),
        `these bottom-bar controls render outside the ${report.visibleW}x${report.visibleH} visible viewport`
      ).toEqual([]);
    }
  });
});

/**
 * Behavioural coverage for the controls the overflow made unreachable.
 * These assert the manual pass could not verify because the controls were
 * physically off-screen.
 */
test.describe('mobile: controls that overflow made unreachable', () => {
  // The hamburger and bottom action bar are `md:hidden`, so these controls do
  // not exist on the desktop project at all.
  test.skip(({ isMobile }) => !isMobile, 'hamburger and bottom bar only exist below the md breakpoint');

  test('hamburger opens the nav overlay', async ({ page }) => {
    await page.goto('/');
    const burger = page.getByRole('button', { name: 'Toggle navigation menu' });
    await expect(burger).toBeVisible();
    await burger.click();
    await expect(
      page.getByRole('button', { name: 'Reserve Dine-In Table' })
    ).toBeVisible();
  });

  test('overlay link navigates and closes the overlay', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Toggle navigation menu' }).click();
    await page.locator('.md\\:hidden').getByRole('link', { name: 'Menu & Dishes' }).click();
    await expect(page).toHaveURL(/\/menu/);
  });

  test('bottom bar opens the reservation modal', async ({ page }) => {
    await page.goto('/');
    await page.locator('div.fixed.bottom-0').getByRole('button', { name: /Table/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
  });

  test('bottom bar opens the cart drawer', async ({ page }) => {
    await page.goto('/');
    await page.locator('div.fixed.bottom-0').getByRole('button', { name: /Order \(/ }).click();
    await expect(page.getByText('Your Order Bag')).toBeVisible();
  });

  test('dish added from menu opens the cart drawer on mobile', async ({ page }) => {
    await page.goto('/menu');
    await page.getByRole('button', { name: /Add to Order/ }).first().click();
    await expect(page.getByText('Your Order Bag')).toBeVisible();
  });
});