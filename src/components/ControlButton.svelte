<script lang="ts">
  import Icon from './Icon.svelte';
  export let icon: `i-ion-${string}`;
  export let label = '';
  export let theme: 'blue' | 'green' = 'blue';

  const themes: Record<typeof theme, string> = {
    blue: 'text-brand-900 active:bg-brand-100 outline-brand-600',
    green: 'text-success-700 active:bg-success-100 outline-success-500',
  };
</script>

<button
  class={`${themes[theme]} inline-flex items-center p-inline-1 p-block-1 rounded-md border-none focus-visible:outline-1 ${$$props.class}`}
  type="button"
  on:click
>
  <Icon name={icon} />
  <span class="sr-only">{label}</span>
</button>
