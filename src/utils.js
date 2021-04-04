import ky from 'ky';
export async function fetchRates(base) {
  return ky
    .get(`https://api.exchangerate.host/latest?base=${base}`)
    .json()
    .then(({ rates, success }) => {
      if (success === true) {
        return rates;
      }
      throw new Error('Unable to retrieve rates.');
    });
}
