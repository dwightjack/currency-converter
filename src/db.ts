import { set, get, createStore } from 'idb-keyval';
import { fetchRates } from './utils';
import type { Rates, Currency } from './types';

const store = createStore('currencyConv', 'currencies');

const ONE_DAY = 1000 * 60 * 60 * 24;

export async function getCurrency(
  currencyCode: string,
): Promise<Currency> | undefined {
  try {
    return await get(currencyCode, store);
  } catch (e) {
    console.warn(e);
  }
  return undefined;
}

export async function setCurrency(currencyCode: string, rates: Rates) {
  const data: Currency = {
    code: currencyCode,
    rates,
    lastUpdate: Date.now(),
  };
  await set(currencyCode, data, store);

  return data;
}

export async function fetchCurrency(
  currencyCode: string,
): Promise<Partial<Currency>> {
  const data = await getCurrency(currencyCode);
  // if it exists and it has been fetch earlier than one day ago
  if (data && Date.now() <= data.lastUpdate + ONE_DAY) {
    return data;
  }

  try {
    const rates = await fetchRates(currencyCode);

    // store the data in the db
    return await setCurrency(currencyCode, rates);
  } catch (e) {
    console.warn(e);
    alert(`unable to retrieve exchange rates for ${currencyCode}`);
    return {};
  }
}
