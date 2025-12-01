import type { Locator, Page } from '@playwright/test';

export class Calculator {
  calculator!: Locator;
  result!: Locator;
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async open() {
    await this.page.getByRole('button', { name: 'Calculate' }).click();
    this.calculator = this.page.getByRole('dialog', { name: 'Calculator' });
    this.result = this.calculator.getByLabel('Result');
  }

  getButton(name: string) {
    return this.calculator.getByRole('button', { name });
  }
}
