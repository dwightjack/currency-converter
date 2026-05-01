import { expect } from '@playwright/test';
import { test } from './fixtures';

test.describe('calculator', () => {
  test('picks-up the input value (formatted)', async ({
    calculator,
    appPage,
  }) => {
    await appPage.setInputAmount(1000);
    await calculator.open();

    await expect(calculator.result).toHaveText('1,000');
  });

  test.describe('supports value input by keyboard', () => {
    test('number input', async ({ calculator, page }) => {
      await calculator.open();

      await page.keyboard.type('10');
      await expect(calculator.result).toHaveText('10');
    });

    [
      ['+', '10+2', '12'],
      ['-', '10-2', '8'],
      ['/', '10÷2', '5'],
      ['*', '10×2', '20'],
    ].forEach(([operation, intermediate, expected]) => {
      test(`basic ${operation} operation`, async ({ calculator, page }) => {
        await calculator.open();

        await page.keyboard.type('10');
        await page.keyboard.type(operation);
        await page.keyboard.type('2');
        await expect(calculator.result).toHaveText(intermediate);
        await page.keyboard.press('Enter');
        await expect(calculator.result).toHaveText(expected);
      });
    });

    test(`clear input`, async ({ calculator, page }) => {
      await calculator.open();

      await page.keyboard.type('10');
      await expect(calculator.result).toHaveText('10');
      await page.keyboard.press('Delete');
      await expect(calculator.result).toHaveText('0');
    });

    test(`remove last digit`, async ({ calculator, page }) => {
      await calculator.open();

      await page.keyboard.type('10');
      await page.keyboard.press('Backspace');
      await expect(calculator.result).toHaveText('1');
    });

    test('compute results in steps', async ({ calculator, page }) => {
      await calculator.open();

      await page.keyboard.type('10+5');
      await expect(calculator.result).toHaveText('10+5');
      await page.keyboard.press('Enter');
      await expect(calculator.result).toHaveText('15');

      await page.keyboard.type('*2');
      await page.keyboard.press('Enter');

      await expect(calculator.result).toHaveText('30');
    });

    [
      ['02', '2'],
      ['2++', '2+'],
      ['0.1.1', '0.11'],
      ['0.1+.', '0.1'],
    ].forEach(([operation, expected]) => {
      test(`edge case filtering ${operation} operation`, async ({
        calculator,
        page,
      }) => {
        await calculator.open();

        await page.keyboard.type(operation);
        await expect(calculator.result).toHaveText(expected);
      });
    });
  });

  test.describe('supports value input by UI', () => {
    test('number input', async ({ calculator }) => {
      await calculator.open();

      await calculator.getButton('1').click();
      await calculator.getButton('0').click();

      await expect(calculator.result).toHaveText('10');
    });

    [
      ['+', '12'],
      ['-', '8'],
      ['÷', '5'],
      ['×', '20'],
      ['AC', '2'],
    ].forEach(([operation, expected]) => {
      test(`basic ${operation} operation`, async ({ calculator }) => {
        await calculator.open();

        await calculator.getButton('1').click();
        await calculator.getButton('0').click();
        await calculator.getButton(operation).click();
        await calculator.getButton('2').click();
        await expect(calculator.result).toHaveText(`10${operation}2`);

        await calculator.getButton('=').click();
        await expect(calculator.result).toHaveText(expected);
      });
    });
  });
});
