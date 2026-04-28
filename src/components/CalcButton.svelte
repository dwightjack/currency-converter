<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements';

  interface Props extends Pick<HTMLButtonAttributes, 'onclick' | 'children'> {
    area?: string;
    theme?: 'light' | 'invert' | 'neutral';
    pressed?: boolean;
  }

  const {
    children,
    area = '',
    theme = 'light',
    pressed = false,
    onclick,
  }: Props = $props();

  const themes: Record<typeof theme, string> = {
    neutral:
      'bg-surface-500 text-brand-50 hover:bg-surface-600 active:bg-surface-700 @dark:(bg-surface-dark-800 text-brand-dark-200 hover:bg-surface-dark-900 active:bg-surface-dark-900/50)',
    invert:
      'bg-surface-800 text-brand-50 hover:bg-surface-700 active:bg-surface-900 @dark:(text-brand-dark-200 bg-surface-dark-700 active:bg-surface-dark-800 hover:bg-surface-dark-600)',
    light:
      'bg-surface-100 text-brand-800 hover:bg-surface-200 active:bg-surface-300 @dark:(text-brand-dark-200 bg-surface-dark-900 active:bg-surface-dark-900/70 hover:bg-surface-dark-800)',
  };
</script>

<button
  {onclick}
  type="button"
  style:--btn-area={area}
  aria-pressed={pressed}
  class="{themes[
    theme
  ]} text-2xl outline-brand outline-offset-2 flex ring-1 ring-surface-300 items-center justify-center grid-area-$btn-area aria-pressed:(border-2 border-surface-900/70 inset-ring-1 inset-ring-surface-100) @dark:(ring-surface-dark-700 aria-pressed:border-surface-dark-500) focus-visible:(isolate)"
  >{@render children?.()}</button
>
