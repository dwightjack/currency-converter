import { writable, derived } from 'svelte/store';
import { fetchCurrency } from '../db';

export const inputAmount = writable(0);

export const currency = writable({
  input: 'JPY',
  output: 'EUR',
});

export const exchangeRate = derived(
  currency,
  async ($currency) => {
    let { rates = {} } = await fetchCurrency($currency.input);
    return rates[$currency.output] || 0;
  },
  0,
);

export const convertedAmount = derived(
  [inputAmount, exchangeRate, currency],
  async ([$inputAmount, $exchangeRate, $currency]) => {
    const converted =
      (Number.parseFloat($inputAmount) || 0) * (await $exchangeRate);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: $currency.output,
    })
      .formatToParts(converted)
      .filter(({ type }) => type !== 'currency')
      .map(({ value }) => value)
      .join('');
  },
  0,
);

export function invertCurrency() {
  currency.update(({ input, output }) => ({
    input: output,
    output: input,
  }));
}

export function getCurrencySymbol(currency) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  })
    .formatToParts(0)
    .find(({ type }) => type === 'currency').value;
}
