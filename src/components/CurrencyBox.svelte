<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { getCurrencySymbol } from '../stores/currency';
  import Icon from './Icon.svelte';
  import Flag from './Flag.svelte';

  export let label = '';
  export let id = '';
  export let current = '';
  export let currencies = [];

  $: inputSymbol = current && getCurrencySymbol(current);

  const dispatch = createEventDispatcher();

  function onChange(e: Event) {
    dispatch('currencyChange', (e.target as HTMLSelectElement).value);
  }
</script>

<fieldset
  class="p-0 border-2 border-blue-200 text-xl rounded-md min-w-0 text-gray-800"
>
  <legend class="sr-only">{label}</legend>
  <div
    class="bg-blue-100 p-2 grid currency-box__head items-center border-blue-200 border-b-2 bg-left bg-no-repeat"
  >
    <label for={id + '-select'} class="sr-only">Currency</label>
    <Flag currency={current} class="row-start-1 col-start-1" />
    <!-- svelte-ignore a11y-no-onchange -->
    <select
      name={id + '-select'}
      on:change={onChange}
      id={id + '-select'}
      class="focus:outline-black appearance-none px-8 col-span-full row-start-1 w-full text-blue-900 font-bold bg-transparent border-0"
    >
      {#each currencies as currency}
        <option selected={current === currency || undefined} value={currency}>
          {currency}
        </option>
      {/each}
    </select>
    <Icon
      name="chevron-down"
      class="row-start-1 col-start-3 pointer-events-none"
    />
  </div>

  <div class="flex gap-x-2 items-baseline p-2">
    <label for={id + '-amount'}>
      <span class="sr-only">Amount</span>
      {inputSymbol}
    </label>
    <slot />
  </div>
</fieldset>

<style>
  .currency-box__head {
    grid-template-columns: auto 1fr auto;
    grid-template-rows: auto;
  }
</style>
