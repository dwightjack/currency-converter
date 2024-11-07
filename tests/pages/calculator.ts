import type { Locator } from '@playwright/test';
import { AppPage } from './app';

export class Calculator extends AppPage {
  calculator!: Locator;
  result!: Locator;

  async openCalculator() {
    await this.page.getByRole('button', { name: 'Calculate' }).click();
    this.calculator = this.page.getByRole('dialog', { name: 'Calculator' });
    this.result = this.calculator.getByLabel('Result');
  }

  getButton(name: string) {
    return this.calculator.getByRole('button', { name });
  }
}
