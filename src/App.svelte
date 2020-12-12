<script>
  import Tailwind from './Tailwind.svelte';
  import CurrencyBox from './components/CurrencyBox.svelte';
  import SwitchButton from './components/SwitchButton.svelte';
  import {
    currency,
    invertCurrency,
    inputAmount,
    convertedAmount,
  } from './store';
</script>

<style>
  .l-container {
    display: flex;
    flex-direction: column;
  }

  @media (min-width: 640px) {
    .l-container {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
    }
  }
</style>

<Tailwind />
<main class="container mx-auto px-4">
  <form class="l-container gap-4">
    <div class="min-w-0">
      <CurrencyBox
        label="Source Currency"
        id="from"
        current={$currency.input}
        currencies={[$currency.input]}>
        <input
          type="text"
          inputmode="numeric"
          id="from-amount"
          name="from-amount"
          class="px-2 py-1 w-full rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
          bind:value={$inputAmount} />
      </CurrencyBox>
    </div>
    <div class="min-w-0 md:col-start-3 order-last">
      <CurrencyBox
        label="Output Currency"
        id="to"
        current={$currency.output}
        currencies={[$currency.output]}>
        <output
          name="to-amount"
          id="to-amount"
          for="from-select to-select from-amount"
          class="pr-1 pt-1 pb-1 w-full truncate">
          {#await $convertedAmount}
            ...converting
          {:then number}
            {number}
          {:catch error}
            conversion error! ({error})
          {/await}
        </output>
      </CurrencyBox>
    </div>
    <div class="items-center col-start-2 row-start-1 flex justify-center">
      <SwitchButton onClick={invertCurrency} />
    </div>
  </form>
</main>
