<script lang="ts">
  export let space = 0;
  export let alignY = `start`;
</script>

<div class={`flex flex-wrap items-${alignY} gap-${space}`}>
  <slot />
</div>
