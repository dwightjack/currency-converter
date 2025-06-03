<script lang="ts">
  import CurrencyBox from './components/CurrencyBox.svelte';
  import ControlButton from './components/ControlButton.svelte';
  import ModalDialog from './components/ModalDialog.svelte';
  import Calculator from './components/Calculator.svelte';

  import { setCurrencyStore } from './stores/currency.svelte';
  import { setUiStore } from './stores/ui.svelte';
  import CurrencyInput from './components/CurrencyInput.svelte';

  const currencyStore = setCurrencyStore();
  const uiStore = setUiStore();

  function submitCalcValue(input: number) {
    currencyStore.inputAmount = input;
    uiStore.toggleCalculator(false);
  }

  function copyToClipboard() {
    if (!Number.isNaN(currencyStore.convertedAmountRaw)) {
      navigator.clipboard.writeText(
        Number(currencyStore.convertedAmount.replaceAll(',', '')).toString(),
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
        oncurrencychange={(currency) =>
          currencyStore.setCurrency('input', currency)}
        current={currencyStore.currency.input}
        currencies={currencyStore.currencyFullList}
      >
        <CurrencyInput
          value={currencyStore.inputAmount}
          oninput={(value) => (currencyStore.inputAmount = value)}
        />
        <ControlButton
          onclick={() => uiStore.toggleCalculator(true)}
          label="Calculate"
          class="text-2xl self-center"
        >
          <span class="i-ion-calculator-outline"></span>
        </ControlButton>
      </CurrencyBox>
    </div>
    <div class="items-center col-start-2 row-start-1 flex justify-center">
      <ControlButton
        onclick={() => currencyStore.invertCurrency()}
        label="Switch"
        class="text-2xl"
      >
        <span class="i-ion-swap-horizontal"></span>
      </ControlButton>
    </div>
    <div class="min-inline-0 md:col-start-3">
      <CurrencyBox
        label="Output Currency"
        id="to"
        current={currencyStore.currency.output}
        oncurrencychange={(currency) =>
          currencyStore.setCurrency('output', currency)}
        currencies={currencyStore.currencyFullList}
      >
        <output
          name="to-amount"
          id="to-amount"
          for="from-select to-select from-amount"
          class="pie-1 p-block-1 inline-full truncate"
        >
          {#if currencyStore.loading}
            ...converting
          {:else if currencyStore.convertedAmount === ''}
            conversion error!
          {:else}
            {currencyStore.convertedAmount}
          {/if}
        </output>
        {#if isSecureContext}
          <ControlButton
            onclick={copyToClipboard}
            label="Copy to Clipboard"
            class="text-2xl"
          >
            <span class="i-ion-md-copy"></span>
          </ControlButton>
        {/if}
      </CurrencyBox>
    </div>
  </form>
  {#if uiStore.calculatorOpen}
    <ModalDialog
      name="Calculator"
      onclose={() => uiStore.toggleCalculator(false)}
    >
      <Calculator
        initial={currencyStore.inputAmountNumber}
        onsubmit={submitCalcValue}
      />
    </ModalDialog>
  {/if}
</main>
