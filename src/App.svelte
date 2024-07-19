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
    inputAmountNumber,
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

<main
  class="container p-block-4 p-inline-4 m-inline-auto lg:(max-inline-3xl pbs-10)"
>
  <form
    class="flex flex-col gap-4 sm:(grid grid-cols-[1fr_auto_1fr])"
    on:submit|preventDefault={() => undefined}
  >
    <div class="min-inline-0">
      <CurrencyBox
        label="Source Currency"
        id="from"
        on:currencyChange={({ detail }) => setCurrency('input', detail)}
        current={$currency.input}
        currencies={$currencyFullList}
      >
        <CurrencyInput
          value={$inputAmount}
          on:input={({ detail }) => ($inputAmount = detail)}
        />
        <ControlButton
          on:click={() => toggleCalculator(true)}
          label="Calculate"
          class="text-2xl self-center"
        >
          <span class="i-ion-calculator-outline"></span>
        </ControlButton>
      </CurrencyBox>
    </div>
    <div class="items-center col-start-2 row-start-1 flex justify-center">
      <ControlButton on:click={invertCurrency} label="Switch" class="text-2xl">
        <span class="i-ion-swap-horizontal"></span>
      </ControlButton>
    </div>
    <div class="min-inline-0 md:col-start-3">
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
          class="pie-1 p-block-1 inline-full truncate"
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
            label="Copy to Clipboard"
            class="text-2xl"
          >
            <span class="i-ion-md-copy"></span>
          </ControlButton>
        {/if}
      </CurrencyBox>
    </div>
  </form>
  {#if $calculatorOpen}
    <ModalDialog name="Calculator" on:close={() => toggleCalculator(false)}>
      <Calculator initial={$inputAmountNumber} onSubmit={submitCalcValue} />
    </ModalDialog>
  {/if}
</main>
