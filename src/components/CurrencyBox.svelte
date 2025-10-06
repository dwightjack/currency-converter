<script lang="ts">
  import type { Snippet } from 'svelte';
  import { getCurrencyStore } from '../stores/currency.svelte';

  interface Props {
    label?: string;
    current?: string;
    select: Snippet<[string]>;
    amount: Snippet<[string]>;
  }

  const store = getCurrencyStore();

  const { label = '', amount, current = '', select }: Props = $props();

  const inputSymbol = $derived(current && store.getCurrencySymbol(current));
</script>

<fieldset
  class="p-block-0 p-inline-0 border-2 border-brand-200 text-xl rounded-md min-inline-0 @dark:(border-brand-dark-700)"
>
  <legend class="sr-only">{label}</legend>
  {@render select(current)}

  <div class="flex gap-x-2 items-center p-inline-2 p-block-2">
    {@render amount(inputSymbol)}
  </div>
</fieldset>
