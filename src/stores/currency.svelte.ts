import { fetchCurrency, fetchCurrencyList } from '../db';
import type { CurrencySymbol } from 'src/types';

class CurrencyStore {
  inputAmount = $state<number | string>(0);

  currency = $state({
    input: 'JPY',
    output: 'EUR',
  });

  loading = $state(false);

  exchangeRate = $state(0);

  currencyFullList = $state<CurrencySymbol[]>([
    { code: 'JPY', description: '' },
    { code: 'EUR', description: '' },
  ]);

  currencyList = $derived(this.currencyFullList.map(({ code }) => code));

  inputAmountNumber = $derived.by(() => {
    if (
      typeof this.inputAmount === 'string' &&
      !/^[0-9.]*$/.test(this.inputAmount)
    ) {
      return NaN;
    }
    return Number(this.inputAmount) || 0;
  });

  convertedAmountRaw = $derived(this.inputAmountNumber * this.exchangeRate);

  convertedAmount = $derived.by(() => {
    if (Number.isNaN(this.convertedAmountRaw)) {
      return '';
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: this.currency.output,
    })
      .formatToParts(this.convertedAmountRaw)
      .reduce(
        (str, { type, value }) => str + (type !== 'currency' ? value : ''),
        '',
      );
  });

  constructor() {
    fetchCurrencyList().then(
      ({ symbols }) => (this.currencyFullList = symbols),
    );
    $effect.root(() => {
      $effect(() => {
        this.loading = true;
        fetchCurrency(this.currency.input)
          .then(({ rates = {} }) => {
            this.exchangeRate = rates[this.currency.output] || 0;
          })
          .finally(() => (this.loading = false));
      });
    });
  }

  invertCurrency() {
    const { input, output } = $state.snapshot(this.currency);
    this.currency = {
      input: output,
      output: input,
    };
  }

  setCurrency(key: 'input' | 'output', value: string) {
    this.currency[key] = value;
  }

  getCurrencySymbol(currency: string) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    })
      .formatToParts(0)
      .find(({ type }) => type === 'currency')!.value;
  }
}

export default new CurrencyStore();
