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
  class={[
    currencyFlag
      ? 'bg-[position:0_$offset] bg-[url(/flags.png)]'
      : 'border border-gray-400 border-dashed',
    'rounded-xs bg-[size:100%_auto] shrink-0 grow-0 inline-6 aspect-ratio-[48/32] inline-block bg-no-repeat',
    className,
  ]}
  style={currencyFlag}
></span>
