import { set, get, createStore } from 'idb-keyval';
import { fetchRates } from './utils';

const store = createStore('currencyConv', 'currencies');

const ONE_DAY = 1000 * 60 * 60 * 24;

export async function getCurrency(currencyCode) {
  try {
    return await get(currencyCode, store);
  } catch (e) {
    // console.warn(e)
  }
  return undefined;
}

export async function setCurrency(currencyCode, rates) {
  const data = {
    code: currencyCode,
    rates,
    lastUpdate: Date.now(),
  };
  await set(currencyCode, data, store);

  return data;
}

export async function fetchCurrency(currencyCode) {
  const data = await getCurrency(currencyCode);
  console.log({ currencyCode, data });
  // if it exists and it has been fetch earlier than one day ago
  if (data && Date.now() <= data.lastUpdate + ONE_DAY) {
    return data;
  }

  try {
    const rates = await fetchRates(currencyCode);
    console.log(rates);

    // store the data in the db
    return await setCurrency(currencyCode, rates);
  } catch (e) {
    console.warn(e);
    alert(`unable to retrieve exchange rates for ${currencyCode}`);
    return {};
  }
}
