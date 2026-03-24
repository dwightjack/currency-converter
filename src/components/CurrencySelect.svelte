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
    class="bg-brand-100 rounded-sm rounded-be-0 appearance-base-select border-brand-200 border-be-2 picker:(inline-[calc(100cqi+4px)] text-brand-900 b-bs-0 -m-is-[2px] border-2 bg-brand-50 border-brand-200) @dark:(border-brand-dark-700 bg-brand-dark-900) inline-full p-2 appearance-none cursor-pointer text-brand-900 font-bold outline-brand border-0 @dark:(text-brand-dark-200) [&::picker-icon]:(ms-auto grow-0 shrink-0 i-ion-chevron-down self-center)"
  >
    <button class="flex min-inline-0">
      <selectedcontent class="flex inline-full items-center gap-x-2"
      ></selectedcontent>
    </button>
    {#each currencyStore.currencyFullList as { code, description }}
      <option
        selected={current === code || undefined}
        value={code}
        class="p-2 first-of-type:mbs-3 last:mbe-3 font-normal overflow-visible [&::checkmark]:(ms-auto order-1 grow-0 text-sm i-ion-checkmark-round line-height-inherit self-start translate-y-[calc(0.5lh-50%)]) checked:bg-brand-100"
      >
        <Flag
          currency={code}
          class="self-start translate-y-[calc(0.5lh-50%)] "
        />
        <span class="whitespace-normal [selectedcontent>&]:truncate"
          >{description}</span
        >
      </option>
    {/each}
  </select>
</div>
