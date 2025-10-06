<script lang="ts">
  import type { Snippet } from 'svelte';
  import Flag from './Flag.svelte';
  import { setCurrencyStore } from '../stores/currency.svelte';

  const currencyStore = setCurrencyStore();

  interface Props {
    label?: string;
    id?: string;
    current?: string;
    children?: Snippet<[]>;
    onchange?: (currency: string) => void;
  }

  const {
    label = 'Currency',
    id = '',
    current = '',
    onchange: onChangeProp,
  }: Props = $props();

  function onchange(e: Event) {
    onChangeProp?.((e.target as HTMLSelectElement).value);
  }
</script>

<div
  class="bg-brand-100 p-block-2 p-inline-2 grid grid-cols-[auto_1fr_auto] grid-rows-[auto] items-center border-brand-200 border-be-2 @dark:(border-brand-dark-700 bg-brand-dark-900)"
>
  <label for={id} class="col-start-1 sr-only">{label}</label>
  <Flag currency={current} class="row-start-1 col-start-1" />
  <select
    name={id}
    {onchange}
    {id}
    class="truncate appearance-none cursor-pointer p-inline-8 col-span-full row-start-1 inline-full text-brand-900 font-bold bg-transparent outline-brand border-0 @dark:(text-brand-dark-200)"
  >
    {#each currencyStore.currencyFullList as { code, description }}
      <option selected={current === code || undefined} value={code}>
        {description}
      </option>
    {/each}
  </select>
  <span class="i-ion-chevron-down row-start-1 col-start-3 pointer-events-none"
  ></span>
</div>
