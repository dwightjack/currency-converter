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

<div class="@container/select">
  <label for={id} class="sr-only">{label}</label>
  <!-- <Flag currency={current} class="row-start-1 col-start-1" /> -->
  <select
    name={id}
    {onchange}
    {id}
    class="bg-brand-100 rounded rounded-be-0 border-brand-200 border-be-2 @dark:(border-brand-dark-700 bg-brand-dark-900) inline-full p-2 appearance-none cursor-pointer text-brand-900 font-bold outline-brand border-0 @dark:(text-brand-dark-200)"
  >
    <button class="flex inline-full items-center gap-x-2">
      <selectedcontent class="contents"></selectedcontent>
      <span
        aria-hidden="true"
        class="ms-auto i-ion-chevron-down row-start-2 pointer-events-none"
      ></span>
    </button>
    {#each currencyStore.currencyFullList as { code, description }}
      <option selected={current === code || undefined} value={code}>
        <Flag currency={code} />
        <span class="truncate">{description}</span>
      </option>
    {/each}
  </select>
</div>

<style>
  div {
    container-type: inline-size;
  }
  select,
  select::picker(select) {
    appearance: base-select;
  }

  select::picker(select) {
    inline-size: 100cqi;
  }

  select::picker-icon {
    display: none;
  }
</style>
