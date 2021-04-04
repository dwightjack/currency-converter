<script>
  import Tailwind from './Tailwind.svelte';
  import CurrencyBox from './components/CurrencyBox.svelte';
  import ControlButton from './components/ControlButton.svelte';
  import ModalDialog from './components/ModalDialog.svelte';
  import Calculator from './components/Calculator.svelte';

  import {
    currency,
    invertCurrency,
    inputAmount,
    convertedAmount,
  } from './stores/currency';
  import { calculatorOpen, toggleCalculator } from './stores/ui';

  function submitCalcValue(input) {
    inputAmount.set(input);
    toggleCalculator(false);
  }
</script>

<Tailwind />
<main class="container lg:max-w-3xl lg:pt-10 pt-4 pb-4 mx-auto px-4">
  <form class="l-container gap-4" on:submit|preventDefault={() => {}}>
    <div class="min-w-0">
      <CurrencyBox
        label="Source Currency"
        id="from"
        current={$currency.input}
        currencies={[$currency.input]}
      >
        <input
          type="text"
          inputmode="numeric"
          id="from-amount"
          name="from-amount"
          class="px-2 py-1 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-600"
          bind:value={$inputAmount}
        />
        <ControlButton
          on:click={toggleCalculator}
          icon="calculator"
          label="Calculate"
          class="text-2xl self-center"
        />
      </CurrencyBox>
    </div>
    <div class="min-w-0 md:col-start-3 order-last">
      <CurrencyBox
        label="Output Currency"
        id="to"
        current={$currency.output}
        currencies={[$currency.output]}
      >
        <output
          name="to-amount"
          id="to-amount"
          for="from-select to-select from-amount"
          class="pr-1 pt-1 pb-1 w-full truncate"
        >
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
      <ControlButton
        on:click={invertCurrency}
        icon="switch"
        label="Switch"
        class="text-2xl"
      />
    </div>
  </form>
  <ModalDialog
    visible={$calculatorOpen}
    on:close={() => toggleCalculator(false)}
  >
    <Calculator onSubmit={submitCalcValue} />
  </ModalDialog>
</main>

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
