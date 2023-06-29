import { test, expect } from '@playwright/test';
import symbols from './fixtures/symbols.json';
import rates from './fixtures/latest.json';

test.beforeEach(async ({ page }) => {
  await page.route('https://api.exchangerate.host/symbols', async (route) => {
    await route.fulfill({ json: symbols });
  });
  await page.route('https://api.exchangerate.host/latest', async (route) => {
    const base = new URL(route.request().url()).searchParams.get('base');
    await route.fulfill({
      json: {
        base,
        success: true,
        rates: rates[base],
      },
    });
  });
  await page.goto('/');
});

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects the URL to contain intro.
  await expect(page).toHaveURL(/.*intro/);
});
