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

  function sanitizeValue(str: string) {
    return (
      str
        // remove all decimal points, except the first one
        .replace(/\./g, (match, offset, fullText) =>
          fullText.indexOf('.') === offset ? match : '',
        )
        .replaceAll(/[^0-9.]+/g, '')
    );
  }

  const onInput = (e: Event) => {
    const inputValue = sanitizeValue((e.target as HTMLInputElement).value);

    (e.target as HTMLInputElement).value = inputValue;
    oninput?.(inputValue);
  };

  const formattedValue = $derived.by(() => {
    if (!value) {
      return '';
    }
    if (typeof value === 'number') {
      return formatter.format(value);
    }

    const cleanedValue = sanitizeValue(value);
    return formatter.format(Number.parseFloat(cleanedValue));
  });
</script>

<input
  type="text"
  inputmode="numeric"
  {id}
  name={id}
  class="border-0 rounded-none border-be border-brand-400 -m-be-[1px] bg-transparent leading-normal p-block-1 p-is-1 min-inline-0 outline-brand w-full"
  value={formattedValue}
  onfocus={onInputFocus}
  oninput={onInput}
/>
