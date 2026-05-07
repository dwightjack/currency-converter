<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements';

  interface Props extends Pick<HTMLButtonAttributes, 'onclick' | 'children'> {
    area?: string;
    theme?: 'light' | 'accent' | 'neutral';
  }

  const { children, area = '', theme = 'light', onclick }: Props = $props();

  const themes: Record<typeof theme, string> = {
    neutral:
      'bg-surface-500 text-brand-50 hover:bg-surface-600 active:bg-surface-700 @dark:(text-brand-100 bg-surface-700 text-brand-50 hover:bg-surface-600 active:bg-surface-500)',
    accent:
      'bg-sky-600 text-brand-50 hover:bg-sky-700 active:bg-sky-900 @dark:(bg-sky-800 text-brand-50 hover:bg-sky-700 active:bg-sky-600)',
    light:
      'bg-surface-100 text-brand-800 hover:bg-surface-200 active:bg-surface-300 @dark:(text-brand-100  bg-surface-900 active:bg-surface-700 hover:bg-surface-800)',
  };
</script>

<button
  {onclick}
  type="button"
  style:--btn-area={area}
  class="{themes[
    theme
  ]} text-2xl outline-brand outline-offset-2 flex ring-1 ring-surface-300 items-center justify-center grid-area-$btn-area @dark:ring-surface-600 focus-visible:isolate"
  >{@render children?.()}</button
>
