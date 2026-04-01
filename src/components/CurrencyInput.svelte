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
  class="p-block-1 p-inline-2 outline-brand-within border border-brand-200 rounded-md grid inline-full overflow-hidden @dark:border-brand-dark-700"
>
  <input
    type="text"
    inputmode="numeric"
    {id}
    name={id}
    class="border-0 bg-transparent col-span-full row-span-full min-inline-0 focus:outline-hidden"
    value={formattedValue}
    onfocus={onInputFocus}
    oninput={onInput}
  />
</div>
