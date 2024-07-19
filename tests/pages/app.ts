import { type Locator, type Page } from '@playwright/test';
import rates from '../fixtures/rates.json' assert { type: 'json' };
import symbols from '../fixtures/symbols.json' assert { type: 'json' };

export class AppPage {
  readonly page: Page;
  readonly inputPanel: Locator;
  readonly inputField: Locator;
  readonly inputSelector: Locator;
  readonly outPutPanel: Locator;
  readonly outPutField: Locator;
  readonly outputSelector: Locator;

  constructor(page: Page) {
    this.page = page;

    this.inputPanel = page.getByRole('group', { name: 'Source Currency' });
    this.inputField = this.inputPanel.getByLabel('Amount');
    this.inputSelector = this.inputPanel.getByRole('combobox', {
      name: 'Currency',
    });

    this.outPutPanel = page.getByRole('group', { name: 'Output Currency' });
    this.outPutField = this.outPutPanel.getByLabel('Amount');
    this.outputSelector = this.outPutPanel.getByRole('combobox', {
      name: 'Currency',
    });
  }

  async setup() {
    await this.page.route('/.netlify/functions/symbols', async (route) => {
      await route.fulfill({ json: symbols });
    });
    await this.page.route('/.netlify/functions/rates**', async (route) => {
      const base = new URL(route.request().url()).searchParams.get('base');
      await route.fulfill({
        json: {
          base,
          success: true,
          rates: rates[base],
        },
      });
    });
  }

  async setInputAmount(amount: number) {
    await this.inputField.clear();
    await this.inputField.fill(amount.toString());
  }

  async openCalculator() {
    await this.page.getByRole('button', { name: 'Calculate' }).click();
  }

  async getCalculator() {
    return this.page.getByRole('dialog', { name: 'Calculator' });
  }
}
