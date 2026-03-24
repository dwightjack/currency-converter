<script lang="ts">
  import { FLAG_LIST } from '../constants';

  interface Props {
    currency: string;
    class?: string;
  }
  const { currency, class: className = '' }: Props = $props();

  const currencyFlag = $derived(
    currency && FLAG_LIST.includes(currency.toLowerCase())
      ? `--offset: ${(FLAG_LIST.indexOf(currency.toLowerCase()) * 100) / (FLAG_LIST.length - 1)}%`
      : null,
  );
</script>

<span
  class="{currencyFlag
    ? 'bg-[url(/flags.png)] bg-[position:0_$offset]'
    : 'border border-dashed border-gray-400'} grow-0 shrink-0 bg-[size:100%_auto] bg-no-repeat rounded-xs aspect-ratio-[48/32] inline-block inline-6 {className}"
  style={currencyFlag}
></span>
