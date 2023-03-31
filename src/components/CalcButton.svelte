<script lang="ts">
  export let area = '';
  export let theme = 'light';

  const themes = {
    light: 'bg-surface text-brand-900 active:bg-brand-100 ',
    invert: 'bg-brand-800 text-surface active:bg-brand-800',
    neutral: 'bg-brand-100 text-brand-800 active:bg-brand-100',
  };
</script>

<button
  on:click
  type="button"
  style={`--btn-area: ${area}`}
  class={`${themes[theme]} grid-area-$btn-area ring-brand-200 focus-visible:(outline-brand-600 isolate) outline-offset-2 flex items-center justify-center ring-1 text-2xl`}
  ><slot /></button
>
