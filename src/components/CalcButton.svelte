<script lang="ts">
  export let area = '';
  export let theme = 'light';

  const themes = {
    light: 'bg-white text-blue-900 active:bg-blue-100 ',
    negative: 'bg-blue-700 text-white active:bg-blue-800',
    neutral: 'bg-blue-50 text-blue-800 active:bg-blue-100',
  };
</script>

<button
  on:click
  type="button"
  style={`--btn-area: ${area}`}
  class={`${themes[theme]} ring-blue-100 focus-visible:ring-blue-400 flex items-center justify-center ring-1 text-2xl focus:outline-none`}
  ><slot /></button
>

<style>
  button {
    grid-area: var(--btn-area);
  }
</style>
