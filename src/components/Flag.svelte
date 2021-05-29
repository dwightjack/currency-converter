<script lang="ts">
  export let currency: string = null;
  $: currencyFlag =
    currency && `--flag: url('/flags/${currency.toLowerCase()}.png')`;
</script>

<span
  class="flag inline-block w-6 pointer-events-none {$$props.class}"
  style={currencyFlag}
/>

<style>
  .flag::after {
    content: '';
    display: block;
    padding-top: calc(32 / 48 * 100%);
    background: #fff var(--flag) center center / contain no-repeat;
  }
</style>
