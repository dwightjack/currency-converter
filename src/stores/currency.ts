import { writable, derived, readable } from 'svelte/store';
import { fetchCurrency, fetchCurrencyList } from '../db';

export const inputAmount = writable(0);

export const currency = writable({
  input: 'JPY',
  output: 'EUR',
});

export const exchangeRate = derived(
  currency,
  ($currency, set) => {
    fetchCurrency($currency.input).then(({ rates = {} }) => {
      set(rates[$currency.output] || 0);
    });
  },
  0,
);

export const currencyList = readable(['JPY', 'EUR'], (set) => {
  fetchCurrencyList().then(({ symbols }) => set(symbols));
  return () => {};
});

export const convertedAmount = derived(
  [inputAmount, exchangeRate, currency],
  ([$inputAmount, $exchangeRate, $currency]) => {
    const converted = ($inputAmount || 0) * $exchangeRate;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: $currency.output,
    })
      .formatToParts(converted)
      .filter(({ type }) => type !== 'currency')
      .map(({ value }) => value)
      .join('');
  },
  '0',
);

export function invertCurrency() {
  currency.update(({ input, output }) => ({
    input: output,
    output: input,
  }));
}

export function setCurrency(key: 'input' | 'output', value: string) {
  currency.update((val) => ({
    ...val,
    [key]: value,
  }));
}

export function getCurrencySymbol(currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  })
    .formatToParts(0)
    .find(({ type }) => type === 'currency').value;
}
