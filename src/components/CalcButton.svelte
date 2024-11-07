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
    light:
      'bg-surface text-brand-900 hover:bg-brand-100/40 active:bg-brand-200 @dark:(bg-surface-dark text-brand-dark-200 hover:bg-brand-dark-900 active:bg-brand-dark-900/50)',
    invert:
      'bg-brand-800 text-surface hover:bg-brand-700 active:bg-brand-900 @dark:(text-brand-dark-200 bg-brand-dark-700 active:bg-brand-dark-800 hover:bg-brand-dark-600)',
    neutral:
      'bg-brand-100 text-brand-800 hover:bg-brand-100/80 active:bg-brand-200 @dark:(text-brand-dark-200 bg-brand-dark-900 active:bg-brand-dark-900/70 hover:bg-brand-dark-800)',
  };
</script>

<button
  {onclick}
  type="button"
  style={`--btn-area: ${area}`}
  aria-pressed={pressed}
  class="{themes[
    theme
  ]} grid-area-$btn-area aria-pressed:(border-2 border-brand-900/70) ring-brand-200 @dark:(ring-brand-dark-700 aria-pressed:border-brand-dark-500) outline-brand focus-visible:(isolate) outline-offset-2 flex items-center justify-center ring-1 text-2xl"
  >{@render children?.()}</button
>
