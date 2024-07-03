<script lang="ts">
  import { onMount } from 'svelte';
  import ControlButton from './ControlButton.svelte';
  export let name: string;

  let dialogElement: HTMLDialogElement | undefined;

  function toggleDialog() {
    if (!dialogElement) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    !dialogElement.open && dialogElement.showModal();
  }

  function close() {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    dialogElement && dialogElement.close();
  }

  onMount(toggleDialog);
</script>

<dialog
  aria-label={name}
  class="flex flex-col max-inline-100vw max-block-100vh border-2 border-brand-200 overflow-hidden p-inline-0 p-block-0 shadow-md md:rounded @dark:(bg-surface-dark shadow-md border-brand-dark-700 text-typo-dark)"
  on:close
  bind:this={dialogElement}
>
  <header class="text-right p-block-1 p-inline-1">
    <ControlButton
      label="Close"
      icon="i-ion-close"
      on:click={close}
      class="text-2xl col-start-3"
    />
  </header>
  <div class="pbs-1 p-inline-3 p-be-3 flex flex-grow min-block-0">
    <slot />
  </div>
</dialog>
