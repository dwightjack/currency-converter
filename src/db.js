import { set, get, createStore } from 'idb-keyval';
import { fetchRates, fetchSymbols } from './utils';

const store = createStore('currencyConv', 'currencies');

const ONE_DAY = 1000 * 60 * 60 * 24;

export async function getKey(currencyCode, def = undefined) {
  try {
    return await get(currencyCode, store);
  } catch (e) {
    console.warn(e);
  }
  return def;
}

export async function setKey(currencyCode, data) {
  await set(currencyCode, { ...data, lastUpdate: Date.now() }, store);

  return data;
}

export async function fetchCurrency(currencyCode) {
  const data = await getKey(currencyCode);
  // if it exists and it has been fetch earlier than one day ago
  if (data && Date.now() <= data.lastUpdate + ONE_DAY) {
    return data;
  }

  try {
    const rates = await fetchRates(currencyCode);

    // store the data in the db
    return await setKey(currencyCode, { code: currencyCode, rates });
  } catch (e) {
    console.warn(e);
    alert(`unable to retrieve exchange rates for ${currencyCode}`);
    return {};
  }
}

export async function fetchCurrencyList() {
  const data = await getKey('symbols');
  // if it exists and it has been fetch earlier than one day ago
  if (data && Date.now() <= data.lastUpdate + ONE_DAY) {
    return data;
  }

  try {
    const symbols = await fetchSymbols();

    // store the data in the db
    return await setKey('symbols', { symbols });
  } catch (e) {
    console.warn(e);
    alert(`unable to retrieve exchange rates currencies`);
    return { symbols: [] };
  }
}
