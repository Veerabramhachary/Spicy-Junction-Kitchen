import { defineConfig } from '@playwright/test';
import base from './playwright.config';

/**
 * Production-mode test run: `npm run build && next start`, instead of the dev
 * server.
 *
 * The dev server compiles routes on demand, so a cold first hit on a page takes
 * seconds. With parallel workers that intermittently blew action timeouts and
 * produced failures that passed on re-run - tests that looked flaky but were
 * only ever competing with the compiler. Production mode compiles everything up
 * front, which is what makes a green run actually mean something.
 *
 * Use this before shipping and in CI. Use plain `npm run test:e2e` while
 * iterating, where the faster dev server matters more than determinism.
 */
const PORT = 3100;

export default defineConfig(base, {
  webServer: {
    command: `npm run build && npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 300_000, // `next build` has to run first
  },
});