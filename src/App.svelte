<script lang="ts">
  import CurrencyBox from './components/CurrencyBox.svelte';
  import ControlButton from './components/ControlButton.svelte';
  import ModalDialog from './components/ModalDialog.svelte';
  import Calculator from './components/Calculator.svelte';
  import CurrencySelect from './components/CurrencySelect.svelte';

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
    class="gap-4 max-sm:(flex flex-col justify-center) items-center sm:(grid grid-cols-[1fr_auto_1fr])"
    on:submit|preventDefault={() => undefined}
  >
    <CurrencyBox label="Input" current={currencyStore.currency.input}>
      {#snippet select(current)}
        <CurrencySelect
          label="Input Currency"
          id="from-select"
          {current}
          onchange={(currency) => currencyStore.setCurrency('input', currency)}
        />
      {/snippet}
      {#snippet amount(symbol)}
        <label for="from-amount">
          <span class="sr-only">Amount</span>
          {symbol}
        </label>
        <CurrencyInput
          id="from-amount"
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
      {/snippet}
    </CurrencyBox>
    <ControlButton
      onclick={() => currencyStore.invertCurrency()}
      label="Switch currencies"
      class="text-2xl"
    >
      <span class="i-ion-swap-horizontal"></span>
    </ControlButton>
    <CurrencyBox label="Output" current={currencyStore.currency.output}>
      {#snippet select(current)}
        <CurrencySelect
          label="Output Currency"
          id="to-select"
          {current}
          onchange={(currency) => currencyStore.setCurrency('output', currency)}
        />
      {/snippet}
      {#snippet amount(symbol)}
        <label for="to-amount">
          <span class="sr-only">Converted amount</span>
          {symbol}
        </label>
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
            label="Copy converted amount to clipboard"
            class="text-2xl"
          >
            <span class="i-ion-md-copy"></span>
          </ControlButton>
        {/if}
      {/snippet}
    </CurrencyBox>
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
