<script lang="ts">
  export let name: `i-ion-${string}`;
</script>

<span
  {...$$restProps}
  class="inline-[1em] aspect-ratio-[1/1] inline-block {name} {$$props.class ??
    ''}"
/>
