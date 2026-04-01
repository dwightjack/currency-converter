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
  class="@container/select flex border-be-2 bg-brand-100 border-brand-200 @dark:(bg-brand-dark-900 border-brand-dark-700) items-center"
>
  <label for={id} class="sr-only">{label}</label>
  <Flag currency={current} class="supports-custom-select:hidden m-is-2" />
  <select
    name={id}
    {onchange}
    {id}
    class="text-brand-900 font-bold min-inline-0 p-2 grow-1 outline-brand border-0 rounded-sm rounded-be-0 cursor-pointer appearance-none appearance-base-select @dark:text-brand-dark-200 picker:(text-brand-900 border-brand-200 bg-brand-50) @dark:(picker:(text-brand-dark-200 border-brand-dark-700 bg-brand-dark-950)) max-sm:(picker:(block-[80vh] [position-anchor:none] m-auto border-8 inset-8 [box-shadow:0_0_0_100vmax_var(--un-shadow-color)] shadow-gray-900/30)) sm:(picker:(border-2 b-bs-0 -m-is-[2px] inline-100cqi box-content max-block-[min(100%,500px)])) picker-icon:(self-center ms-auto shrink-0 grow-0 i-ion-chevron-down) truncate"
  >
    <button class="hidden supports-custom-select:flex min-inline-0">
      <selectedcontent class="flex gap-x-2 inline-full items-center"
      ></selectedcontent>
    </button>
    {#each currencyStore.currencyFullList as { code, description }}
      <option
        selected={current === code || undefined}
        value={code}
        class="[&::checkmark]:i-ion-checkmark-round font-normal p-2 overflow-visible [&::checkmark]:(text-sm line-height-inherit ms-auto grow-0 translate-y-[calc(0.5lh-50%)] self-start order-1) first-of-type:mbs-3 last:mbe-3 checked:bg-brand-100 outline-brand @dark:checked:bg-brand-dark-900"
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
  <span
    class="shrink-0 grow-0 size-5 i-ion-chevron-down m-ie-2 supports-custom-select:hidden"
  ></span>
</div>
