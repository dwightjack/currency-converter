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
  class="p-block-0 p-inline-0 border-2 border-brand-200 text-xl rounded-md min-inline-0 @dark:(border-brand-dark-700)"
>
  <legend class="sr-only">{label}</legend>
  <div
    class="bg-brand-100 p-block-2 p-inline-2 grid grid-cols-[auto_1fr_auto] grid-rows-[auto] items-center border-brand-200 border-be-2 bg-left bg-no-repeat @dark:(border-brand-dark-700 bg-brand-dark-900)"
  >
    <label for={id + '-select'} class="col-start-1 sr-only">Currency</label>
    <Flag currency={current} class="row-start-1 col-start-1" />
    <select
      name={id + '-select'}
      on:change={onChange}
      id={id + '-select'}
      class="truncate appearance-none p-inline-8 col-span-full row-start-1 inline-full text-brand-900 font-bold bg-transparent outline-brand border-0 @dark:(text-brand-dark-200)"
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

  <div class="flex gap-x-2 items-baseline p-inline-2 p-block-2">
    <label for={id + '-amount'}>
      <span class="sr-only">Amount</span>
      {inputSymbol}
    </label>
    <slot />
  </div>
</fieldset>
