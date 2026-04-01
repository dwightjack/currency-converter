<script lang="ts">
  import { onMount, type Snippet } from 'svelte';
  import ControlButton from './ControlButton.svelte';
  import type { HTMLDialogAttributes } from 'svelte/elements';

  interface Props {
    name?: string;
    children?: Snippet<[]>;
    onclose: HTMLDialogAttributes['onclose'];
  }
  const { name = '', children, onclose }: Props = $props();

  let dialogElement: HTMLDialogElement | undefined;

  function toggleDialog() {
    if (!dialogElement) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    !dialogElement.open && dialogElement.showModal();
  }

  function close() {
    dialogElement?.close();
  }

  onMount(toggleDialog);
</script>

<dialog
  aria-label={name}
  class="m-auto p-block-0 p-inline-0 border-2 border-brand-200 flex flex-col max-block-100vh max-inline-100vw shadow-md overflow-hidden @dark:(text-gray-200 border-brand-dark-700 bg-surface-dark-800 shadow-md) md:rounded"
  {onclose}
  bind:this={dialogElement}
>
  <header class="p-block-1 p-inline-1 text-right">
    <ControlButton label="Close" onclick={close} class="text-2xl col-start-3">
      <span class="i-ion-close"></span>
    </ControlButton>
  </header>
  <div class="p-inline-3 p-be-3 pbs-1 flex flex-grow min-block-0">
    {@render children?.()}
  </div>
</dialog>
