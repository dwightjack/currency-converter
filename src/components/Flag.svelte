<script lang="ts">
  interface Props {
    currency: string;
    class?: string;
  }
  const { currency, class: className = '' }: Props = $props();

  let flagStatus = $state<'loading' | 'success' | 'error'>('loading');

  async function fetchFlag(currency: string): Promise<typeof flagStatus> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve('success');
      img.onerror = () => resolve('error');
      img.src = `/flags/${currency}.png`;
    });
  }

  $effect(() => {
    if (currency) {
      flagStatus = 'loading';
      fetchFlag(currency.toLowerCase()).then((result) => (flagStatus = result));
    }
  });

  const currencyFlag = $derived(
    currency && flagStatus === 'success'
      ? `--flag: url('/flags/${currency.toLowerCase()}.png')`
      : null,
  );
</script>

<span
  class="{flagStatus === 'success'
    ? 'bg-image-$flag'
    : 'border'} border-dashed border-gray-400 bg-contain bg-no-repeat bg-center radius-md rounded-sm aspect-ratio-[48/32] inline-block inline-6 pointer-events-none {className}"
  style={currencyFlag}
></span>
