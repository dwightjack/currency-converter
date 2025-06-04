<script lang="ts">
  import type { Snippet } from 'svelte';
  import { getCurrencyStore } from '../stores/currency.svelte';
  import Flag from './Flag.svelte';
  import type { CurrencySymbol } from 'src/types';

  interface Props {
    label?: string;
    id?: string;
    current?: string;
    currencies: CurrencySymbol[];
    children?: Snippet<[]>;
    oncurrencychange?: (currency: string) => void;
  }

  const store = getCurrencyStore();

  const {
    label = '',
    id = '',
    current = '',
    currencies = [],
    oncurrencychange,
    children,
  }: Props = $props();

  const inputSymbol = $derived(current && store.getCurrencySymbol(current));

  function onChange(e: Event) {
    oncurrencychange?.((e.target as HTMLSelectElement).value);
  }
</script>

<fieldset
  class="p-block-0 p-inline-0 border-2 border-brand-200 text-xl rounded-md min-inline-0 @dark:(border-brand-dark-700)"
>
  <legend class="sr-only">{label}</legend>
  <div
    class="bg-brand-100 p-block-2 p-inline-2 grid grid-cols-[auto_1fr_auto] grid-rows-[auto] items-center border-brand-200 border-be-2 @dark:(border-brand-dark-700 bg-brand-dark-900)"
  >
    <label for={id + '-select'} class="col-start-1 sr-only">Currency</label>
    <Flag currency={current} class="row-start-1 col-start-1" />
    <select
      name={id + '-select'}
      onchange={onChange}
      id={id + '-select'}
      class="truncate appearance-none cursor-pointer p-inline-8 col-span-full row-start-1 inline-full text-brand-900 font-bold bg-transparent outline-brand border-0 @dark:(text-brand-dark-200)"
    >
      {#each currencies as { code, description }}
        <option selected={current === code || undefined} value={code}>
          {description}
        </option>
      {/each}
    </select>
    <span class="i-ion-chevron-down row-start-1 col-start-3 pointer-events-none"
    ></span>
  </div>

  <div class="flex gap-x-2 items-center p-inline-2 p-block-2">
    <label for={id + '-amount'}>
      <span class="sr-only">Amount</span>
      {inputSymbol}
    </label>
    {@render children?.()}
  </div>
</fieldset>
