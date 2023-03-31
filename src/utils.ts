import ky from 'ky';
import type { CurrencySymbol, Rates } from './types';
export async function fetchRates(base: string): Promise<Rates> {
  const { rates, success } = await ky
    .get(`https://api.exchangerate.host/latest?base=${base}`)
    .json<{ rates: Rates; success: boolean }>();

  if (!success) {
    throw new Error('Unable to retrieve rates.');
  }
  return rates;
}

export async function fetchSymbols() {
  const { symbols, success } = await ky
    .get('https://api.exchangerate.host/symbols')
    .json<{ success: boolean; symbols: Record<string, CurrencySymbol> }>();

  if (!success) {
    throw new Error('Unable to retrieve currencies.');
  }
  return Object.values(symbols);
}
