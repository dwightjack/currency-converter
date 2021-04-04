import ky from 'ky';
export async function fetchRates(base) {
  const { rates, success } = await ky
    .get(`https://api.exchangerate.host/latest?base=${base}`)
    .json();

  if (!success) {
    throw new Error('Unable to retrieve rates.');
  }
  return rates;
}

export async function fetchSymbols() {
  const { symbols, success } = await ky
    .get('https://api.exchangerate.host/symbols')
    .json();

  if (!success) {
    throw new Error('Unable to retrieve currencies.');
  }
  return Object.keys(symbols);
}
