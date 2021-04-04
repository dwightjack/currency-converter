<script>
  import Icon from './Icon.svelte';
  export let icon = '';
  export let label = '';
  export let theme = 'blue';

  const themes = {
    blue: 'text-blue-900 active:bg-blue-100 ring-blue-600',
    green: 'text-green-700 active:bg-green-100 ring-green-500',
  };
</script>

<button
  class={`${themes[theme]} p-1 rounded-md border-none focus:outline-none focus-visible:ring-1 ${$$props.class}`}
  type="button"
  on:click
>
  <Icon name={icon} />
  <span class="sr-only">{label}</span>
</button>
