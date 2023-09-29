import { ofetch } from 'ofetch';
import type { Rates, FetchRatesResponse, FetchSymbolsResponse } from './types';

const apiFetch = ofetch.create({
  parseResponse: JSON.parse,
  baseURL: '/.netlify/functions',
  async onResponseError({ request, response }) {
    // Log error
    console.log(
      '[fetch response error]',
      request,
      response.status,
      response.body,
    );
  },
});

export async function fetchRates(base: string): Promise<Rates> {
  const response = await apiFetch<FetchRatesResponse>(`/rates`, {
    query: { base },
  });

  if (response.success == false) {
    throw new Error(`Unable to retrieve rates: ${response.message}`);
  }
  return response.rates;
}

export async function fetchSymbols() {
  const response = await apiFetch<FetchSymbolsResponse>('/symbols');

  if (response.success === false) {
    throw new Error(`Unable to retrieve currencies. ${response.message}`);
  }
  return response.symbols;
}
