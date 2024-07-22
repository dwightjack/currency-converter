<script lang="ts">
  export let currency: string;

  let flagStatus: 'loading' | 'success' | 'error' = 'loading';

  async function fetchFlag(currency: string): Promise<typeof flagStatus> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve('success');
      img.onerror = () => resolve('error');
      img.src = `/flags/${currency}.png`;
    });
  }

  $: {
    flagStatus = 'loading';

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    currency &&
      fetchFlag(currency.toLowerCase()).then((result) => (flagStatus = result));
  }

  $: currencyFlag =
    currency && flagStatus === 'success'
      ? `--flag: url('/flags/${currency.toLowerCase()}.png')`
      : null;
</script>

<span
  class="{flagStatus === 'success'
    ? 'bg-image-$flag'
    : 'border'} border-dashed border-gray-400 bg-contain bg-no-repeat bg-center radius-md rounded-sm aspect-ratio-[48/32] inline-block inline-6 pointer-events-none {$$props.class}"
  style={currencyFlag}
/>
