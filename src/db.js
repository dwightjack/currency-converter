import { openDB } from 'idb';
import { fetchRates } from './utils';

/** @type ReturnType<openDB> */
let dbPromise;

const ONE_DAY = 1000 * 60 * 60 * 24;

function open() {
  if (!dbPromise) {
    dbPromise = openDB('currencyConv', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('currencies')) {
          const currencies = db.createObjectStore('currencies', {
            keyPath: 'code',
          });
        }
      },
    });
  }
  return dbPromise;
}

export async function getCurrency(currencyCode) {
  // get it from the store
  const db = await open();
  try {
    return await db.get('currencies', currencyCode);
  } catch (e) {
    // console.warn(e)
  }
  return undefined;
}

export async function setCurrency(currencyCode, rates) {
  // get it from the store
  const db = await open();
  const tx = db.transaction('currencies', 'readwrite');
  const store = tx.objectStore('currencies');
  const data = {
    code: currencyCode,
    rates,
    lastUpdate: Date.now(),
  };
  const prev = await store.get(currencyCode);
  store[prev ? 'put' : 'add'](data);
  await tx.done;
  return data;
}

export async function fetchCurrency(currencyCode) {
  const data = await getCurrency(currencyCode);
  // if it exists and it has been earlier than one day ago
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
