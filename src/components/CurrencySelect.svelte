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
    class="[&::picker-icon]:i-ion-chevron-down text-brand-900 font-bold p-2 outline-brand border-0 border-be-2 border-brand-200 rounded-sm rounded-be-0 bg-brand-100 inline-full cursor-pointer appearance-base-select @dark:(text-brand-dark-200 border-brand-dark-700 bg-brand-dark-900) picker:(text-brand-900 border-2 b-bs-0 border-brand-200 bg-brand-50 inline-[calc(100cqi+4px)] -m-is-[2px]) [&::picker-icon]:(ms-auto shrink-0 grow-0 self-center)"
  >
    <button class="flex min-inline-0">
      <selectedcontent class="flex gap-x-2 inline-full items-center"
      ></selectedcontent>
    </button>
    {#each currencyStore.currencyFullList as { code, description }}
      <option
        selected={current === code || undefined}
        value={code}
        class="[&::checkmark]:i-ion-checkmark-round font-normal p-2 overflow-visible [&::checkmark]:(text-sm line-height-inherit ms-auto grow-0 translate-y-[calc(0.5lh-50%)] self-start order-1) first-of-type:mbs-3 last:mbe-3 checked:bg-brand-100"
      >
        <Flag
          currency={code}
          class="translate-y-[calc(0.5lh-50%)] self-start"
        />
        <span class="whitespace-normal [selectedcontent>&]:truncate"
          >{description}</span
        >
      </option>
    {/each}
  </select>
</div>
