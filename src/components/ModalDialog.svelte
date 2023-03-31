<script lang="ts">
  import { onMount, afterUpdate } from 'svelte';
  import ControlButton from './ControlButton.svelte';
  export let visible = false;

  let dialogElement: HTMLDialogElement | undefined;

  function toggleDialog() {
    if (!dialogElement) {
      return;
    }
    if (visible === true) {
      !dialogElement.open && dialogElement.showModal();
      return;
    }
    dialogElement.close();
  }

  function close() {
    dialogElement && dialogElement.close();
  }

  onMount(toggleDialog);
  afterUpdate(toggleDialog);
</script>

<dialog
  class={`${
    visible ? 'flex flex-col' : ''
  } max-w-100vw max-h-100vh border-2 border-brand-200 overflow-hidden p-0 shadow-md md:rounded`}
  on:close
  bind:this={dialogElement}
>
  <header class="text-right p-1">
    <ControlButton
      label="Close"
      icon="close"
      on:click={close}
      class="text-2xl col-start-3"
    />
  </header>
  <div class="pt-1 p-3 flex flex-grow min-h-0">
    <slot />
  </div>
</dialog>
