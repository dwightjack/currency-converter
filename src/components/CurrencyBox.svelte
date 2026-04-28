<script lang="ts">
  import type { Snippet } from 'svelte';
  import { getCurrencyStore } from '../stores/currency.svelte';

  interface Props {
    label?: string;
    current?: string;
    select: Snippet<[string, string]>;
    field: Snippet<[string]>;
    command: Snippet<[]>;
  }

  const store = getCurrencyStore();

  const { label = '', field, command, current = '', select }: Props = $props();

  const inputSymbol = $derived(current && store.getCurrencySymbol(current));
</script>

<fieldset
  class="
    text-xl p-block-5 p-ie-5 p-is-16 min-inline-0 rounded-2xl border-3 border-brand-500 bg-surface-100 bg-[image:var(--flag)] bg-contain bg-no-repeat min-inline-0 @dark:(border-brand-900 bg-surface-500)"
  style:--flag={`url(/flags.svg#code-${current.toLowerCase()})`}
>
  <legend class="sr-only">{label}</legend>
  <div
    class="flex rounded-2xl p-block-1.5 p-inline-2 gap-x-1 items-stretch border-3 border-brand-500 ring-3 ring-surface-100 bg-white/95 @dark:(border-brand-900 ring-surface-500 bg-surface-900/90)"
  >
    {@render select(current, inputSymbol)}

    {@render field(inputSymbol)}
    {@render command()}
  </div>
</fieldset>
