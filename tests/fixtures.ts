import { test as base } from '@playwright/test';
import { AppPage } from './pages/app';
import { Calculator } from './pages/calculator';
import rates from './fixtures/rates.json' assert { type: 'json' };
import symbols from './fixtures/symbols.json' assert { type: 'json' };

export interface Fixtures {
  appPage: AppPage;
  calculator: Calculator;
  forEachTest: void;
}

export const test = base.extend<Fixtures>({
  forEachTest: [
    async ({ page }, use) => {
      await page.route('/.netlify/functions/symbols', async (route) => {
        await route.fulfill({ json: symbols });
      });
      await page.route('/.netlify/functions/rates**', async (route) => {
        const base = new URL(route.request().url()).searchParams.get(
          'base',
        ) as keyof typeof rates;
        await route.fulfill({
          json: {
            base,
            success: true,
            rates: rates[base],
          },
        });
      });
      await page.goto('/');
      await use();
    },
    { auto: true },
  ],
  async appPage({ page }, use) {
    const appPage = new AppPage(page);
    await use(appPage);
  },
  async calculator({ page }, use) {
    const calculator = new Calculator(page);
    await use(calculator);
  },
});
