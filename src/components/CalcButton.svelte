<script>
  export let area = '';
</script>

<style>
  button {
    grid-area: var(--btn-area);
  }
</style>

<button
  on:click
  type="button"
  style={`--btn-area: ${area}`}
  class="flex bg-white items-center justify-center ring-1 ring-blue-200 text-2xl text-blue-900 focus:outline-none focus-visible:ring-blue-400 active:bg-blue-100"><slot /></button>
