<script lang="ts">
  export let area = '';
  export let theme: 'light' | 'invert' | 'neutral' = 'light';
  export let pressed = false;

  const themes: Record<typeof theme, string> = {
    light:
      'bg-surface text-brand-900 active:bg-brand-100 @dark:(bg-surface-dark text-brand-dark-200 )',
    invert:
      'bg-brand-800 text-surface active:bg-brand-800 @dark:(text-brand-dark-200 bg-brand-dark-700)',
    neutral:
      'bg-brand-100 text-brand-800 active:bg-brand-100 @dark:(text-brand-dark-200 bg-brand-dark-900)',
  };
</script>

<button
  on:click
  type="button"
  style={`--btn-area: ${area}`}
  aria-pressed={pressed}
  class={`${themes[theme]} grid-area-$btn-area aria-pressed:(shadow shadow-brand-600 shadow-inset) ring-brand-200 @dark:(ring-brand-dark-700 active:bg-brand-dark-600) outline-brand focus-visible:(isolate) outline-offset-2 flex items-center justify-center ring-1 text-2xl`}
  ><slot /></button
>
