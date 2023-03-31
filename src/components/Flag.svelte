<script lang="ts">
  export let currency: string = null;
  $: currencyFlag =
    currency && `--flag: url('/flags/${currency.toLowerCase()}.png')`;
</script>

<span
  class="aspect-48/32 bg-surface bg-image-$flag bg-contain bg-no-repeat bg-center inline-block w-6 pointer-events-none {$$props.class}"
  style={currencyFlag}
/>
