<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    space?: number;
    alignX?: 'center' | 'stretch' | 'baseline' | 'start' | 'end';
    children?: Snippet<[]>;
  }
  const { space = 0, alignX = 'stretch', children }: Props = $props();
</script>

<div class="flex flex-col items-{alignX} justify-start gap-y-{space}">
  {@render children?.()}
</div>
