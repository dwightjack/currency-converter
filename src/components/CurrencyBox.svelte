<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { getCurrencySymbol } from '../stores/currency';
  import Icon from './Icon.svelte';
  import Flag from './Flag.svelte';
  import type { CurrencySymbol } from 'src/types';

  export let label = '';
  export let id = '';
  export let current = '';
  export let currencies: CurrencySymbol[] = [];

  $: inputSymbol = current && getCurrencySymbol(current);

  const dispatch = createEventDispatcher();

  function onChange(e: Event) {
    dispatch('currencyChange', (e.target as HTMLSelectElement).value);
  }
</script>

<fieldset
  class="p-0 border-2 border-brand-200 text-xl rounded-md min-w-0 text-gray-800"
>
  <legend class="sr-only">{label}</legend>
  <div
    class="bg-brand-100 p-2 grid grid-cols-[auto_1fr_auto] grid-rows-[auto] items-center border-brand-200 border-b-2 bg-left bg-no-repeat"
  >
    <label for={id + '-select'} class="col-start-1 sr-only">Currency</label>
    <Flag currency={current} class="row-start-1 col-start-1" />
    <select
      name={id + '-select'}
      on:change={onChange}
      id={id + '-select'}
      class="focus-visible:outline-brand-600 truncate appearance-none px-8 col-span-full row-start-1 w-full text-brand-900 font-bold bg-transparent border-0"
    >
      {#each currencies as { code, description }}
        <option selected={current === code || undefined} value={code}>
          {description}
        </option>
      {/each}
    </select>
    <Icon
      name="i-ion-chevron-down"
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
