<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements';

  interface Props extends Pick<
    HTMLButtonAttributes,
    'onclick' | 'children' | 'class'
  > {
    label?: string;
    theme?: 'blue' | 'green';
  }

  const {
    label = '',
    theme = 'blue',
    children,
    onclick,
    class: className = '',
  }: Props = $props();

  const themes: Record<typeof theme, string> = {
    blue: 'text-brand-900 hover:bg-brand-100 active:bg-brand-200 outline-brand @dark:(text-brand-dark-200 hover:bg-brand-dark-700 active:bg-brand-dark-900)',
    green:
      'text-success-700 hover:bg-success-100 active:bg-success-200 focus-visible:outline-success-500 @dark:(text-success hover:bg-success-700/70 active:bg-success-900)',
  };
</script>

<button
  class="{themes[
    theme
  ]} inline-flex items-center p-inline-1 p-block-1 rounded-md border-none {className}"
  type="button"
  {onclick}
>
  {@render children?.()}
  <span class="sr-only">{label}</span>
</button>
