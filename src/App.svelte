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
  class="m-inline-auto min-inline-0 p-bs-[10dvb] p-be-4 p-inline-4 container max-inline-lg lg:(max-inline-4xl p-bs-4) box-content"
>
  <form
    class=" gap-8 flex flex-col justify-center items-stretch lg:(grid grid-cols-[1fr_auto_1fr] gap-4 items-center)"
    on:submit|preventDefault={() => undefined}
  >
    <CurrencyBox label="Input" current={currencyStore.currency.input}>
      {#snippet select(current, symbol)}
        <CurrencySelect
          label="Input Currency"
          id="from-select"
          {current}
          {symbol}
          onchange={(currency) => currencyStore.setCurrency('input', currency)}
        />
      {/snippet}
      {#snippet field(symbol)}
        <label for="from-amount" class="sr-only">Amount {symbol}</label>
        <CurrencyInput
          id="from-amount"
          value={currencyStore.inputAmount}
          oninput={(value) => (currencyStore.inputAmount = value)}
        />
      {/snippet}
      {#snippet command()}
        <ControlButton
          onclick={() => uiStore.toggleCalculator(true)}
          label="Calculate"
          class="self-center"
        >
          <span class="i-ion-calculator-outline"></span>
        </ControlButton>
      {/snippet}
    </CurrencyBox>
    <ControlButton
      onclick={() => currencyStore.invertCurrency()}
      label="Switch currencies"
      size="large"
      class="self-center"
    >
      <span class="i-ion-swap-horizontal"></span>
    </ControlButton>
    <CurrencyBox label="Output" current={currencyStore.currency.output}>
      {#snippet select(current, symbol)}
        <CurrencySelect
          label="Output Currency"
          id="to-select"
          {current}
          {symbol}
          onchange={(currency) => currencyStore.setCurrency('output', currency)}
        />
      {/snippet}
      {#snippet field(symbol)}
        <label for="to-amount" class="sr-only">Converted amount {symbol}</label>
        <output
          name="to-amount"
          id="to-amount"
          for="from-select to-select from-amount"
          class="p-block-1 pie-1 truncate grow-1 leading-normal content-center min-inline-0"
        >
          {#if currencyStore.loading}
            converting...
          {:else if currencyStore.convertedAmount === ''}
            conversion error!
          {:else}
            {currencyStore.convertedAmount}
          {/if}
        </output>
      {/snippet}
      {#snippet command()}
        {#if isSecureContext}
          <ControlButton
            onclick={copyToClipboard}
            label="Copy converted amount to clipboard"
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
