<script lang="ts">
  import CurrencyBox from './components/CurrencyBox.svelte';
  import ControlButton from './components/ControlButton.svelte';
  import ModalDialog from './components/ModalDialog.svelte';
  import Calculator from './components/Calculator.svelte';

  import {
    currency,
    invertCurrency,
    inputAmount,
    convertedAmount,
    currencyList,
    setCurrency,
  } from './stores/currency';
  import { calculatorOpen, toggleCalculator } from './stores/ui';

  function onInputFocus(e: Event) {
    const select = (e.target as HTMLInputElement).select;
    if (!(typeof select === 'function')) {
      return;
    }
    select.call(e.target);
  }

  function submitCalcValue(input: number) {
    inputAmount.set(input);
    toggleCalculator(false);
  }
</script>

<main class="container pt-4 pb-4 mx-auto px-4 lg:(max-w-3xl pt-10) ">
  <form
    class="flex flex-col gap-4 sm:(grid grid-cols-[1fr_auto_1fr])"
    on:submit|preventDefault={() => undefined}
  >
    <div class="min-w-0">
      <CurrencyBox
        label="Source Currency"
        id="from"
        on:currencyChange={({ detail }) => setCurrency('input', detail)}
        current={$currency.input}
        currencies={$currencyList}
      >
        <input
          type="text"
          inputmode="numeric"
          id="from-amount"
          name="from-amount"
          class="px-2 py-1 w-full rounded-md border border-gray-300 focus:(outline-none ring-1 ring-blue-600)"
          bind:value={$inputAmount}
          on:focus={onInputFocus}
        />
        <ControlButton
          on:click={() => toggleCalculator(true)}
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
        on:currencyChange={({ detail }) => setCurrency('output', detail)}
        currencies={$currencyList}
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
