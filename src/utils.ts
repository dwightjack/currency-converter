import { ofetch } from 'ofetch';
import type { Rates, FetchRatesResponse, FetchSymbolsResponse } from './types';
export async function fetchRates(base: string): Promise<Rates> {
  const response = await ofetch<FetchRatesResponse>(
    `/.netlify/functions/rates?base=${base}`,
  );

  if (response.success == false) {
    throw new Error(`Unable to retrieve rates: ${response.message}`);
  }
  return response.rates;
}

export async function fetchSymbols() {
  const response = await ofetch<FetchSymbolsResponse>(
    '/.netlify/functions/symbols',
  );

  if (response.success === false) {
    throw new Error(`Unable to retrieve currencies. ${response.message}`);
  }
  return response.symbols;
}
