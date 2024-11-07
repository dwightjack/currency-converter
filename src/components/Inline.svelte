<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    space?: number;
    alignY?: 'center' | 'stretch' | 'baseline' | 'start' | 'end';
    children?: Snippet<[]>;
  }
  const { space = 0, alignY = 'start', children }: Props = $props();
</script>

<div class="flex flex-wrap items-{alignY} gap-{space}">
  {@render children?.()}
</div>
