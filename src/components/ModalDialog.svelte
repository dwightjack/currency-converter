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
  class="flex flex-col max-inline-100vw max-block-100vh border-2 border-brand-200 overflow-hidden p-inline-0 p-block-0 shadow-md md:rounded @dark:(bg-surface-dark shadow-md border-brand-dark-700 text-typo-dark)"
  {onclose}
  bind:this={dialogElement}
>
  <header class="text-right p-block-1 p-inline-1">
    <ControlButton label="Close" onclick={close} class="text-2xl col-start-3">
      <span class="i-ion-close"></span>
    </ControlButton>
  </header>
  <div class="pbs-1 p-inline-3 p-be-3 flex flex-grow min-block-0">
    {@render children?.()}
  </div>
</dialog>
