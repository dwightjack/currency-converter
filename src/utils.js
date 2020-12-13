import ky from 'ky';
export async function fetchRates(base) {
  if (fetchRates.$$store.has(base)) {
    return fetchRates.$$store.get(base);
  }

  const call = ky
    .get(`https://api.exchangeratesapi.io/latest?base=${base}`)
    .json()
    .then(({ rates }) => rates);

  fetchRates.$$store.set(base, call);

  const rates = await call;

  fetchRates.$$store.delete(base);

  return rates;
}

fetchRates.$$store = new Map();
