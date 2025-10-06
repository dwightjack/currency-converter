<script lang="ts">
  interface Props {
    value: string | number;
    id: string;
    oninput: (value: string) => void;
  }

  const { value = 0, oninput, id }: Props = $props();

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
    oninput?.((e.target as HTMLInputElement).value.replaceAll(',', ''));
  };

  const formattedValue = $derived(
    value
      ? formatter.format(
          typeof value === 'number' ? value : Number.parseFloat(value),
        )
      : '',
  );
</script>

<div
  class="grid inline-full p-inline-2 p-block-1 rounded-md border border-brand-200 overflow-hidden outline-brand-within @dark:border-brand-dark-700"
>
  <input
    type="text"
    inputmode="numeric"
    {id}
    name={id}
    class="border-0 min-inline-0 bg-transparent focus:outline-none row-span-full col-span-full"
    value={formattedValue}
    onfocus={onInputFocus}
    oninput={onInput}
  />
</div>
