<script>
  import CalculatorIcon from '../icons/calculator.svelte';
  import SwitchIcon from '../icons/switch.svelte';
  import CloseIcon from '../icons/close.svelte';
  import CheckIcon from '../icons/check.svelte';
  export let name = '';
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  focusable="false"
  aria-hidden="true"
  fill="none"
  viewBox="0 0 24 24"
  stroke="currentColor"
  style="width: 1em; height: 1em">
  {#if name === 'switch'}
    <SwitchIcon />
  {:else if name === 'calculator'}
    <CalculatorIcon />
  {:else if name === 'close'}
    <CloseIcon />
  {:else if name === 'check'}
    <CheckIcon />
  {:else}
    <!-- icon not found -->
  {/if}
</svg>
