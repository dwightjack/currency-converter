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
    convertedAmountRaw,
    currencyFullList,
    setCurrency,
  } from './stores/currency';
  import { calculatorOpen, toggleCalculator } from './stores/ui';
  import CurrencyInput from './components/CurrencyInput.svelte';

  function submitCalcValue(input: number) {
    inputAmount.set(input);
    toggleCalculator(false);
  }

  function copyToClipboard() {
    if (!Number.isNaN($convertedAmountRaw)) {
      navigator.clipboard.writeText(
        Number($convertedAmount.replaceAll(',', '')).toString(),
      );
    }
  }
</script>

<main class="container pt-4 pb-4 mx-auto px-4 lg:(max-w-3xl pt-10)">
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
        currencies={$currencyFullList}
      >
        <CurrencyInput bind:value={$inputAmount} currency={$currency.input} />
        <ControlButton
          on:click={() => toggleCalculator(true)}
          icon="i-ion-calculator-outline"
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
        currencies={$currencyFullList}
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
            {Number.isNaN(number) ? 'Error' : number}
          {:catch error}
            conversion error! ({error})
          {/await}
        </output>
        {#if isSecureContext}
          <ControlButton
            on:click={copyToClipboard}
            icon="i-ion-md-copy"
            label="Copy to Clipboard"
            class="text-2xl"
          />
        {/if}
      </CurrencyBox>
    </div>
    <div class="items-center col-start-2 row-start-1 flex justify-center">
      <ControlButton
        on:click={invertCurrency}
        icon="i-ion-swap-horizontal"
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
