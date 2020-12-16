<script>
  import { onMount, afterUpdate } from 'svelte';
  import ControlButton from './ControlButton.svelte';
  export let visible = false;
  /**
   * @type HTMLDialogElement
   */
  let dialogElement;

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

<style>
  .c-modal-dialog {
    max-width: 100vw;
    max-height: 100vh;
  }
</style>

<dialog
  class={`${visible ? 'flex flex-col ' : ''}c-modal-dialog border-2 border-blue-200 overflow-hidden p-0 shadow-md md:rounded`}
  on:close
  bind:this={dialogElement}>
  <header class="text-right p-1">
    <ControlButton
      label="Close"
      icon="close"
      on:click={close}
      class="text-2xl col-start-3" />
  </header>
  <div class="pt-1 p-3 flex flex-grow min-h-0">
    <slot />
  </div>
</dialog>
