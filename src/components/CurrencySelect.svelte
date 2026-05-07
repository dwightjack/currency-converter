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
    symbol?: string;
    onchange?: (currency: string) => void;
  }

  const {
    label = 'Currency',
    id = '',
    current = '',
    symbol = '',
    onchange: onChangeProp,
  }: Props = $props();

  function onchange(e: Event) {
    onChangeProp?.((e.target as HTMLSelectElement).value);
  }
</script>

<div
  class="grid items-center p-ie-2 border-ie-2 border-brand-500 grid-cols-[calc(var(--spacing)*5)_4ch]"
>
  <span
    class="col-1 row-1 size-5 i-ion-chevron-down m-ie-2 pointer-events-none supports-custom-select:hidden"
  ></span>
  <label for={id} class="sr-only">{label}</label>
  <select
    name={id}
    {onchange}
    {id}
    class="supports-custom-select:grid grid-cols-subgrid grid-rows-1 opacity-1 col-[1/-1] items-center row-1 min-inline-0 cursor-pointer appearance-none appearance-base-select leading-normal gap-x-0 rounded-md outline-brand truncate supports-custom-select:opacity-100 picker:(text-brand-800 border-3 border-brand-300 bg-surface-100) @dark:(picker:(text-brand-100 border-brand-500 bg-surface-900)) max-sm:(picker:(rounded-2xl block-[80vh] [position-anchor:none] m-auto inset-8 [box-shadow:0_0_0_100vmax_var(--un-shadow-color)] shadow-gray-900/30)) picker-icon:(translate-y-[0.1em] -order-1 i-ion-chevron-down) [&:open]:(picker-icon:(rotate-180))"
  >
    <button class="text-end">
      <span class="row-1 col-2">{symbol}</span>
      <selectedcontent class="row-1 col-2"></selectedcontent>
    </button>
    {#each currencyStore.currencyFullList as { code, description }}
      <option
        selected={current === code || undefined}
        value={code}
        class="[&::checkmark]:i-ion-checkmark-round font-normal p-2 overflow-visible [&::checkmark]:(text-sm line-height-inherit ms-auto grow-0 translate-y-[calc(0.5lh-50%)] self-start order-1) first-of-type:mbs-3 last:mbe-3 checked:bg-surface-200 outline-brand hover:bg-surface-300 @dark:(checked:bg-surface-600 hover:bg-surface-700)"
      >
        <Flag
          currency={code}
          class="translate-y-[calc(0.5lh-50%)] self-start [selectedcontent>&]:hidden"
        />

        <span class="whitespace-normal [selectedcontent>&]:sr-only"
          >{description}</span
        >
      </option>
    {/each}
  </select>
  <span class="col-2 text-end row-1 supports-custom-select:hidden"
    >{symbol}</span
  >
</div>
