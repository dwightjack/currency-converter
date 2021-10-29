<script lang="ts">
  // Icons from https://heroicons.com/
  import CalculatorIcon from '../icons/calculator.svelte';
  import SwitchIcon from '../icons/switch.svelte';
  import CloseIcon from '../icons/close.svelte';
  import CheckIcon from '../icons/check.svelte';
  import ChevronDown from '../icons/chevron-down.svelte';
  export let name = '';
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  focusable="false"
  aria-hidden="true"
  fill="none"
  viewBox="0 0 24 24"
  stroke="currentColor"
  class="w-1em h-1em"
  {...$$restProps}
>
  {#if name === 'switch'}
    <SwitchIcon />
  {:else if name === 'calculator'}
    <CalculatorIcon />
  {:else if name === 'close'}
    <CloseIcon />
  {:else if name === 'check'}
    <CheckIcon />
  {:else if name === 'chevron-down'}
    <ChevronDown />
  {:else}
    <!-- icon not found -->
  {/if}
</svg>
