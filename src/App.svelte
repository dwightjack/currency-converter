<script>
  import Tailwind from './Tailwind.svelte';
  import {
    currency,
    invertCurrency,
    inputAmount,
    convertedAmount,
    getCurrencySymbol,
  } from './store';

  $: inputSymbol = getCurrencySymbol($currency.input);
</script>

<Tailwind />
<main>
  <fieldset>
    <legend>Currencies</legend>
    <label for="currency-from">From</label>
    <select name="currency-from" id="currency-from" disabled>
      <option selected value={$currency.input}>{$currency.input}</option>
    </select>
    <label for="currency-to">To</label>
    <select name="currency-to" id="currency-to" disabled>
      <option selected value={$currency.output}>{$currency.output}</option>
    </select>
    <button type="button" on:click={invertCurrency}>Switch</button>
  </fieldset>
  <div>
    <label for="input-amount">Amount {inputSymbol}</label>
    <input
      type="text"
      inputmode="numeric"
      id="input-amount"
      name="input-amount"
      bind:value={$inputAmount} />
  </div>
  <div>
    <label for="result">Result</label>
    <output
      name="result"
      id="result"
      for="currency-from currency-to input-amount">{$convertedAmount}</output>
  </div>
</main>
