<script lang="ts">
  export let value: string | number = 0;
  export let currency: string;

  let selected = false;

  $: formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  });

  function formatNumber(num: unknown) {
    if (Number.isNaN(Number(num))) {
      return num;
    }
    return formatter
      .formatToParts(Number(num))
      .reduce(
        (str, { type, value }) => str + (type !== 'currency' ? value : ''),
        '',
      );
  }

  $: formattedValue = formatNumber(value);

  function onInputFocus(e: Event) {
    const select = (e.target as HTMLInputElement).select;
    if (!(typeof select === 'function')) {
      return;
    }
    selected = true;
    select.call(e.target);
  }
</script>

<div
  class="grid inline-full p-inline-2 p-block-1 rounded-md border border-brand-200 overflow-hidden outline-brand-within @dark:border-brand-dark-700"
>
  <input
    type="text"
    inputmode="numeric"
    id="from-amount"
    name="from-amount"
    pattern="\d+"
    class="border-0 bg-transparent text-transparent selection:(text-transparent) focus:outline-none row-span-full col-span-full"
    bind:value
    on:focus={onInputFocus}
    on:input={() => (selected = false)}
  />
  <span
    aria-hidden="true"
    class="row-span-full col-span-full pointer-events-none"
    ><span class={selected ? 'bg-brand-100 @dark:bg-brand-700' : ''}
      >{formattedValue}</span
    ></span
  >
</div>
