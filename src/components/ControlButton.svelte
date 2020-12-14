<script>
  import Icon from './Icon.svelte';
  export let icon = '';
  export let label = '';
</script>

<button
  class={`text-blue-900 active:bg-blue-100 p-1 rounded-md border-none focus:outline-none focus-visible:ring-1 ring-blue-600 ${$$props.class}`}
  type="button"
  on:click>
  <Icon name={icon} />
  <span class="sr-only">{label}</span>
</button>
