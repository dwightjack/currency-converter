import type { Locator, Page } from '@playwright/test';

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

    this.inputPanel = page.getByRole('group', { name: 'Input' });
    this.inputField = this.inputPanel.getByLabel('Amount');
    this.inputSelector = page.getByRole('combobox', {
      name: 'Input Currency',
    });

    this.outPutPanel = page.getByRole('group', { name: 'Output' });
    this.outPutField = this.outPutPanel.getByLabel('Converted Amount');
    this.outputSelector = page.getByRole('combobox', {
      name: 'Output Currency',
    });
  }

  async setInputAmount(amount: number) {
    await this.inputField.clear();
    await this.inputField.fill(amount.toString());
  }

  async getCalculator() {
    return this.page.getByRole('dialog', { name: 'Calculator' });
  }
}
