<script>
  export let space = 0;
  export let alignX = `stretch`;
</script>

<div class={`flex flex-col items-${alignX} justify-start gap-y-${space}`}>
  <slot />
</div>
