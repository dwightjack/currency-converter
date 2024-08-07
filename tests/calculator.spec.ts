import { test, expect } from '@playwright/test';
import { Calculator } from './pages/calculator';

test.beforeEach(async ({ page }) => {
  const calcPage = new Calculator(page);
  await calcPage.setup();
  await page.goto('/');
});

test.describe('calculator', () => {
  test('picks-up the input value (formatted)', async ({ page }) => {
    const calcPage = new Calculator(page);
    await calcPage.setInputAmount(1000);
    await calcPage.openCalculator();

    await expect(calcPage.result).toHaveText('1,000');
  });

  test.describe('supports value input by keyboard', () => {
    test('number input', async ({ page }) => {
      const calcPage = new Calculator(page);
      await calcPage.openCalculator();

      await page.keyboard.type('10');
      await expect(calcPage.result).toHaveText('10');
    });

    [
      ['+', '12'],
      ['-', '8'],
      ['/', '5'],
      ['*', '20'],
    ].forEach(([operation, expected]) => {
      test(`basic ${operation} operation`, async ({ page }) => {
        const calcPage = new Calculator(page);
        await calcPage.openCalculator();

        await page.keyboard.type('10');
        await page.keyboard.type(operation);
        await page.keyboard.type('2');
        await page.keyboard.press('Enter');
        await expect(calcPage.result).toHaveText(expected);
      });
    });

    test(`clear input`, async ({ page }) => {
      const calcPage = new Calculator(page);
      await calcPage.openCalculator();

      await page.keyboard.type('10');
      await expect(calcPage.result).toHaveText('10');
      await page.keyboard.press('Delete');
      await expect(calcPage.result).toHaveText('0');
    });

    test(`remove last digit`, async ({ page }) => {
      const calcPage = new Calculator(page);
      await calcPage.openCalculator();

      await page.keyboard.type('10');
      await page.keyboard.press('Backspace');
      await expect(calcPage.result).toHaveText('1');
    });

    test('complex operation input', async ({ page }) => {
      const calcPage = new Calculator(page);
      await calcPage.openCalculator();

      await page.keyboard.type('10+');
      await expect(calcPage.result).toHaveText('10');

      await page.keyboard.type('5');
      await expect(calcPage.result).toHaveText('5');

      await page.keyboard.press('Enter');

      await expect(calcPage.result).toHaveText('15');

      await page.keyboard.type('*2+');

      await expect(calcPage.result).toHaveText('30');

      await page.keyboard.type('5');
      await page.keyboard.press('Enter');

      await expect(calcPage.result).toHaveText('35');
    });

    test('operator button gets pressed state', async ({ page }) => {
      const calcPage = new Calculator(page);
      await calcPage.openCalculator();

      await page.keyboard.type('1+');

      await expect(calcPage.getButton('+')).toHaveAttribute(
        'aria-pressed',
        'true',
      );
    });

    test('operator button can be cleared by re-clicking on it', async ({
      page,
    }) => {
      const calcPage = new Calculator(page);
      await calcPage.openCalculator();

      await page.keyboard.type('1+');

      await expect(calcPage.getButton('+')).toHaveAttribute(
        'aria-pressed',
        'true',
      );

      await page.keyboard.type('+');

      await expect(calcPage.getButton('+')).not.toHaveAttribute(
        'aria-pressed',
        'true',
      );
    });

    test(`operator button can be cleared by pressing Backspace`, async ({
      page,
    }) => {
      const calcPage = new Calculator(page);
      await calcPage.openCalculator();

      await page.keyboard.type('1+');

      await expect(calcPage.getButton('+')).toHaveAttribute(
        'aria-pressed',
        'true',
      );

      await page.keyboard.press('Backspace');

      await expect(calcPage.getButton('+')).not.toHaveAttribute(
        'aria-pressed',
        'true',
      );
    });

    test('operator button can be changed by pressing another operator', async ({
      page,
    }) => {
      const calcPage = new Calculator(page);
      await calcPage.openCalculator();

      await page.keyboard.type('10+');
      await page.keyboard.type('/');

      await expect(calcPage.getButton('÷')).toHaveAttribute(
        'aria-pressed',
        'true',
      );

      await page.keyboard.type('2');
      await page.keyboard.press('Enter');

      await expect(calcPage.result).toHaveText('5');
    });
  });

  test.describe('supports value input by UI', () => {
    test('number input', async ({ page }) => {
      const calcPage = new Calculator(page);
      await calcPage.openCalculator();

      await calcPage.getButton('1').click();
      await calcPage.getButton('0').click();

      await expect(calcPage.result).toHaveText('10');
    });

    [
      ['+', '12'],
      ['-', '8'],
      ['÷', '5'],
      ['×', '20'],
      ['AC', '2'],
    ].forEach(([operation, expected]) => {
      test(`basic ${operation} operation`, async ({ page }) => {
        const calcPage = new Calculator(page);
        await calcPage.openCalculator();

        await calcPage.getButton('1').click();
        await calcPage.getButton('0').click();
        await calcPage.getButton(operation).click();
        await calcPage.getButton('2').click();
        await calcPage.getButton('=').click();
        await expect(calcPage.result).toHaveText(expected);
      });
    });
    test('complex operation input', async ({ page }) => {
      const calcPage = new Calculator(page);
      await calcPage.openCalculator();

      await calcPage.getButton('1').click();
      await calcPage.getButton('0').click();
      await calcPage.getButton('+').click();

      await expect(calcPage.result).toHaveText('10');

      await calcPage.getButton('5').click();
      await expect(calcPage.result).toHaveText('5');

      await calcPage.getButton('=').click();

      await expect(calcPage.result).toHaveText('15');

      await calcPage.getButton('×').click();
      await calcPage.getButton('2').click();
      await calcPage.getButton('+').click();

      await expect(calcPage.result).toHaveText('30');

      await calcPage.getButton('5').click();
      await calcPage.getButton('=').click();

      await expect(calcPage.result).toHaveText('35');
    });

    test('operator button gets pressed state', async ({ page }) => {
      const calcPage = new Calculator(page);
      await calcPage.openCalculator();

      await calcPage.getButton('1').click();
      await calcPage.getButton('+').click();

      await expect(calcPage.getButton('+')).toHaveAttribute(
        'aria-pressed',
        'true',
      );
    });

    test('operator button can be cleared by re-clicking on it', async ({
      page,
    }) => {
      const calcPage = new Calculator(page);
      await calcPage.openCalculator();

      await calcPage.getButton('1').click();
      await calcPage.getButton('+').click();

      await expect(calcPage.getButton('+')).toHaveAttribute(
        'aria-pressed',
        'true',
      );

      await calcPage.getButton('+').click();

      await expect(calcPage.getButton('+')).not.toHaveAttribute(
        'aria-pressed',
        'true',
      );
    });

    test('operator button can be changed by pressing another operator', async ({
      page,
    }) => {
      const calcPage = new Calculator(page);
      await calcPage.openCalculator();

      await calcPage.getButton('1').click();
      await calcPage.getButton('0').click();
      await calcPage.getButton('+').click();
      await calcPage.getButton('÷').click();

      await expect(calcPage.getButton('÷')).toHaveAttribute(
        'aria-pressed',
        'true',
      );

      await calcPage.getButton('2').click();
      await calcPage.getButton('=').click();

      await expect(calcPage.result).toHaveText('5');
    });
  });
});
