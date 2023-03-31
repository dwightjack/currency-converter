<script lang="ts">
  export let name: `i-ion-${string}`;
</script>

<span
  {...$$restProps}
  class="w-[1em] h-[1em] inline-block {name} {$$props.class ?? ''}"
/>
