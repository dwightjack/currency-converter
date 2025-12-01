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
      ['+', '12'],
      ['-', '8'],
      ['/', '5'],
      ['*', '20'],
    ].forEach(([operation, expected]) => {
      test(`basic ${operation} operation`, async ({ calculator, page }) => {
        await calculator.open();

        await page.keyboard.type('10');
        await page.keyboard.type(operation);
        await page.keyboard.type('2');
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

    test('complex operation input', async ({ calculator, page }) => {
      await calculator.open();

      await page.keyboard.type('10+');
      await expect(calculator.result).toHaveText('10');

      await page.keyboard.type('5');
      await expect(calculator.result).toHaveText('5');

      await page.keyboard.press('Enter');

      await expect(calculator.result).toHaveText('15');

      await page.keyboard.type('*2+');

      await expect(calculator.result).toHaveText('30');

      await page.keyboard.type('5');
      await page.keyboard.press('Enter');

      await expect(calculator.result).toHaveText('35');
    });

    test('operator button gets pressed state', async ({ calculator, page }) => {
      await calculator.open();

      await page.keyboard.type('1+');

      await expect(calculator.getButton('+')).toHaveAttribute(
        'aria-pressed',
        'true',
      );
    });

    test('operator button can be cleared by re-clicking on it', async ({
      calculator,
      page,
    }) => {
      await calculator.open();

      await page.keyboard.type('1+');

      await expect(calculator.getButton('+')).toHaveAttribute(
        'aria-pressed',
        'true',
      );

      await page.keyboard.type('+');

      await expect(calculator.getButton('+')).not.toHaveAttribute(
        'aria-pressed',
        'true',
      );
    });

    test(`operator button can be cleared by pressing Backspace`, async ({
      calculator,
      page,
    }) => {
      await calculator.open();

      await page.keyboard.type('1+');

      await expect(calculator.getButton('+')).toHaveAttribute(
        'aria-pressed',
        'true',
      );

      await page.keyboard.press('Backspace');

      await expect(calculator.getButton('+')).not.toHaveAttribute(
        'aria-pressed',
        'true',
      );
    });

    test('operator button can be changed by pressing another operator', async ({
      calculator,
      page,
    }) => {
      await calculator.open();

      await page.keyboard.type('10+');
      await page.keyboard.type('/');

      await expect(calculator.getButton('÷')).toHaveAttribute(
        'aria-pressed',
        'true',
      );

      await page.keyboard.type('2');
      await page.keyboard.press('Enter');

      await expect(calculator.result).toHaveText('5');
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
        await calculator.getButton('=').click();
        await expect(calculator.result).toHaveText(expected);
      });
    });
    test('complex operation input', async ({ calculator }) => {
      await calculator.open();

      await calculator.getButton('1').click();
      await calculator.getButton('0').click();
      await calculator.getButton('+').click();

      await expect(calculator.result).toHaveText('10');

      await calculator.getButton('5').click();
      await expect(calculator.result).toHaveText('5');

      await calculator.getButton('=').click();

      await expect(calculator.result).toHaveText('15');

      await calculator.getButton('×').click();
      await calculator.getButton('2').click();
      await calculator.getButton('+').click();

      await expect(calculator.result).toHaveText('30');

      await calculator.getButton('5').click();
      await calculator.getButton('=').click();

      await expect(calculator.result).toHaveText('35');
    });

    test('operator button gets pressed state', async ({ calculator }) => {
      await calculator.open();

      await calculator.getButton('1').click();
      await calculator.getButton('+').click();

      await expect(calculator.getButton('+')).toHaveAttribute(
        'aria-pressed',
        'true',
      );
    });

    test('operator button can be cleared by re-clicking on it', async ({
      calculator,
    }) => {
      await calculator.open();

      await calculator.getButton('1').click();
      await calculator.getButton('+').click();

      await expect(calculator.getButton('+')).toHaveAttribute(
        'aria-pressed',
        'true',
      );

      await calculator.getButton('+').click();

      await expect(calculator.getButton('+')).not.toHaveAttribute(
        'aria-pressed',
        'true',
      );
    });

    test('operator button can be changed by pressing another operator', async ({
      calculator,
    }) => {
      await calculator.open();

      await calculator.getButton('1').click();
      await calculator.getButton('0').click();
      await calculator.getButton('+').click();
      await calculator.getButton('÷').click();

      await expect(calculator.getButton('÷')).toHaveAttribute(
        'aria-pressed',
        'true',
      );

      await calculator.getButton('2').click();
      await calculator.getButton('=').click();

      await expect(calculator.result).toHaveText('5');
    });
  });
});
