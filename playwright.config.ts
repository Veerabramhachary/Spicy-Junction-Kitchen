import { defineConfig, devices } from '@playwright/test';

/**
 * E2E config for Spicy Junction Kitchen.
 *
 * Two projects:
 *  - Desktop Chrome 1280x800  (full nav bar, hover states, multi-column grids)
 *  - Mobile                   (390px viewport, MobileActionBar, hamburger overlay)
 *
 * The mobile project uses real device emulation (touch, DPR, UA) rather than a
 * resized desktop window. That distinction matters: `md:hidden` breakpoints and
 * `hover:` styles resolve differently, so a resized window does not reproduce
 * what a phone actually does.
 *
 * SERVER MODE
 * -----------
 *   npm run test:e2e       -> reuses the dev server on 3000. Fast, for iterating.
 *   npm run test:e2e:prod  -> `next build` + `next start` on 3100. See
 *                             playwright.prod.config.ts - deterministic, and
 *                             what you should run before shipping.
 *
 * The dev-mode server cannot move to a different port: Next refuses to run two
 * `next dev` servers from the same directory, so the tests have to reuse 3000.
 * That is also why dev mode can be flaky under parallel load - it compiles
 * routes on demand. Production mode is the reliable one.
 */
const PORT = Number(process.env.E2E_PORT ?? 3000);
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  workers: process.env.CI ? 1 : 2,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list']],

  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    // Generous enough to absorb a cold dev-server compile; production mode
    // never needs them, which is itself a useful signal.
    actionTimeout: 20_000,
    navigationTimeout: 45_000,
  },

  projects: [
    {
      name: 'desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 800 },
      },
    },
    {
      name: 'mobile',
      use: {
        // Chromium with iPhone-like characteristics. We deliberately do NOT use
        // `devices['iPhone 13']` because that descriptor implies WebKit, and the
        // point here is to reproduce the *viewport* on the same engine the
        // desktop project uses - so any layout difference is a real CSS bug
        // rather than a browser engine difference.
        ...devices['Desktop Chrome'],
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
        userAgent:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
      },
    },
  ],

  webServer: {
    command: `npx next dev -p ${PORT}`,
    url: BASE_URL,
    // Always reuse: Next will not start a second dev server for this directory,
    // so attempting one would fail outright rather than help.
    reuseExistingServer: true,
    timeout: 120_000,
  },
});