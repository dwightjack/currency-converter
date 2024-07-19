<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let value: string | number = 0;

  const dispatch = createEventDispatcher();

  const formatter = new Intl.NumberFormat('en', {
    maximumFractionDigits: 3,
    roundingMode: 'trunc',
  });

  function onInputFocus(e: Event) {
    const select = (e.target as HTMLInputElement).select;
    if (!(typeof select === 'function')) {
      return;
    }
    select.call(e.target);
  }

  const onInput = (e: Event) => {
    dispatch('input', (e.target as HTMLInputElement).value.replaceAll(',', ''));
  };

  $: formattedValue = value
    ? formatter.format(
        typeof value === 'number' ? value : Number.parseFloat(value),
      )
    : '';
</script>

<div
  class="grid inline-full p-inline-2 p-block-1 rounded-md border border-brand-200 overflow-hidden outline-brand-within @dark:border-brand-dark-700"
>
  <input
    type="text"
    inputmode="numeric"
    id="from-amount"
    name="from-amount"
    class="border-0 bg-transparent focus:outline-none row-span-full col-span-full"
    value={formattedValue}
    on:focus={onInputFocus}
    on:input={onInput}
  />
</div>
