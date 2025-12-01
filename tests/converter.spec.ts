import { expect } from '@playwright/test';
import { test } from './fixtures';

test.describe('initial view', () => {
  test('input currency is JPY', async ({ appPage }) => {
    await expect(appPage.inputSelector).toHaveValue('JPY');
    await expect(
      appPage.inputSelector.getByRole('option', { selected: true }),
    ).toHaveText('Japanese Yen');
  });

  test('output currency is EUR', async ({ appPage }) => {
    await expect(appPage.outputSelector).toHaveValue('EUR');
    await expect(
      appPage.outputSelector.getByRole('option', { selected: true }),
    ).toHaveText('Euro');
  });

  test('input gets formatted (en locale)', async ({ appPage }) => {
    await appPage.setInputAmount(1000.5);
    await expect(appPage.inputField).toHaveValue('1,000.5');
  });
});

test.describe('action: convert currency', () => {
  test('default currencies conversion', async ({ appPage }) => {
    const inputAmount = 1000;

    await appPage.setInputAmount(inputAmount);

    await expect(appPage.outPutField).toHaveText('6.36');
  });

  test('select a different input currency', async ({ appPage }) => {
    await appPage.inputSelector.selectOption({ label: 'Canadian Dollar' });

    await appPage.setInputAmount(10);
    await expect(appPage.outPutField).toHaveText('6.92');
  });

  test('select a different output currency', async ({ appPage }) => {
    await appPage.outputSelector.selectOption({
      label: 'United States Dollar',
    });

    await appPage.setInputAmount(1000);
    await expect(appPage.outPutField).toHaveText('6.92');
  });
});

test.describe('interactions', () => {
  test('can copy to clipboard', async ({ appPage, page }) => {
    const inputAmount = 1000;

    await appPage.setInputAmount(inputAmount);

    await page
      .getByRole('button', { name: 'Copy converted amount to clipboard' })
      .click();

    const clipboardText1 = await page.evaluate(
      'navigator.clipboard.readText()',
    );

    expect(clipboardText1).toBe('6.36');
  });

  test('can switch input and output', async ({ appPage, page }) => {
    await page.getByRole('button', { name: 'switch' }).click();

    await expect(appPage.inputSelector).toHaveValue('EUR');
    await expect(appPage.outputSelector).toHaveValue('JPY');
  });
});
