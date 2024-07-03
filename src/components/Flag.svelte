<script lang="ts">
  export let currency: string;

  let flagStatus: 'loading' | 'success' | 'error' = 'loading';

  async function fetchFlag(currency: string): Promise<typeof flagStatus> {
    try {
      const res = await fetch(`/flags/${currency}.png`, { method: 'HEAD' });
      return res.ok ? 'success' : 'error';
    } catch {
      return 'error';
    }
  }

  $: {
    flagStatus = 'loading';

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    currency &&
      fetchFlag(currency.toLowerCase()).then((result) => (flagStatus = result));
  }

  $: currencyFlag = currency
    ? `--flag: url('/flags/${currency.toLowerCase()}.png')`
    : null;
</script>

{#if flagStatus === 'success'}
  <span
    class="aspect-ratio-[48/32] bg-image-$flag bg-contain bg-no-repeat bg-center inline-block inline-6 pointer-events-none {$$props.class}"
    style={currencyFlag}
  />{/if}
