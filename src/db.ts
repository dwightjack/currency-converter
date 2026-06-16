import { set, get, createStore } from 'idb-keyval';
import { fetchRates, fetchSymbols } from './utils';
import type { Currency, CurrencySymbol } from './types';

const store = createStore('currencyConv', 'currencies');
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cache = new Map<string, Promise<any>>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function cacheGet<R extends Promise<any>>(key: string, fallback: () => R): R {
  if (!cache.has(key)) {
    cache.set(key, fallback());
  }
  return cache.get(key) as R;
}

const ONE_DAY = 1000 * 60 * 60 * 24;
const STORAGE_DAYS = ONE_DAY * 7;

const SYMBOL_LIST_KEY = 'symbol_list';

export async function getKey<T>(
  currencyCode: string,
): Promise<(T & { lastUpdate: number }) | undefined> {
  try {
    return await get(currencyCode, store);
  } catch (e) {
    console.warn(e);
  }
  return undefined;
}

export async function setKey<T>(currencyCode: string, data: T) {
  if (import.meta.env.VITE_IS_TEST) {
    return data;
  }
  await set(currencyCode, { ...data, lastUpdate: Date.now() }, store);

  return data;
}

export async function fetchCurrency(
  currencyCode: string,
): Promise<Partial<Currency>> {
  const data = await getKey<Currency>(currencyCode);
  // if it exists and it has been fetch earlier than 7 day ago
  if (data && Date.now() <= data.lastUpdate + STORAGE_DAYS) {
    return data;
  }

  try {
    const fethCall = cacheGet(currencyCode, () => fetchRates(currencyCode));
    const rates = await fethCall;

    // store the data in the db
    return await setKey<Currency>(currencyCode, { code: currencyCode, rates });
  } catch (e) {
    console.warn(e);
    alert(
      `Unable to retrieve exchange rates for ${currencyCode}. ${(e as Error).message}`,
    );
    return {};
  } finally {
    cache.delete(currencyCode);
  }
}

export async function fetchCurrencyList() {
  const data = await getKey<{ symbols: CurrencySymbol[] }>('symbols');
  // if it exists and it has been fetch earlier than 7 day ago
  if (data && Date.now() <= data.lastUpdate + STORAGE_DAYS) {
    return data;
  }

  try {
    const symbols = (await cacheGet(SYMBOL_LIST_KEY, fetchSymbols)).sort(
      (a, b) => {
        const nameA = a.description.toUpperCase();
        const nameB = b.description.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      },
    );

    // store the data in the db
    return await setKey('symbols', { symbols });
  } catch (e) {
    console.warn(e);
    alert(
      `Unable to retrieve exchange rates currencies. ${(e as Error).message}`,
    );
    return { symbols: [] };
  } finally {
    cache.delete(SYMBOL_LIST_KEY);
  }
}
