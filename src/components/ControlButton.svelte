<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements';

  interface Props extends Pick<
    HTMLButtonAttributes,
    'onclick' | 'children' | 'class'
  > {
    label?: string;
    theme?: 'primary' | 'success';
    size?: 'normal' | 'large';
  }

  const {
    label = '',
    theme = 'primary',
    size = 'normal',
    children,
    onclick,
    class: className = '',
  }: Props = $props();

  const themes: Record<typeof theme, string> = {
    primary:
      'text-brand-500 hover:bg-surface-900/10 active:bg-surface-900/10 outline-brand @dark:(text-brand-200 hover:bg-surface-700  active:bg-surface-700)',
    success:
      'text-success-700 hover:bg-success-100 active:bg-success-200 focus-visible:outline-success-500 @dark:(text-success hover:bg-success-700/70 active:bg-success-900)',
  };
</script>

<button
  class={[
    themes[theme],
    'cursor-pointer rounded-md inline-flex items-center',
    {
      'p-1 text-2xl': size === 'normal',
      'p-2 text-3xl': size === 'large',
    },
    className,
  ]}
  type="button"
  {onclick}
>
  {@render children?.()}
  <span class="sr-only">{label}</span>
</button>
