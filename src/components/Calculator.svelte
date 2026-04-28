<script lang="ts">
  import { onMount, tick } from 'svelte';
  import CalcButton from './CalcButton.svelte';
  import ControlButton from './ControlButton.svelte';

  const OPS_REGEXP = /[×+\-÷]/;
  const HAS_DECIMAL_REGEXP = /\d+\.\d*$/;

  interface Props {
    onsubmit?: (_n: number) => void;
    initial?: number;
  }

  const { onsubmit, initial }: Props = $props();

  let root: HTMLElement | undefined;

  let input = $state('');

  $effect(() => {
    input = String(!initial || Number.isNaN(initial) ? 0 : initial);
  });

  // // https://stackoverflow.com/questions/2901102/how-to-format-a-number-with-commas-as-thousands-separators
  // // match and extract trailing digits (positive and negative)
  // // add thousands separator
  // // keep max 3 decimal numbers
  // const output = $derived(
  //   (input.match(/((^-|)[0-9.]+)[.\D]?$/)?.[1] ?? '0')
  //     .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
  //     .replace(/(\.\d{3})\d*$/, '$1'),
  // );

  function onInput(v: string | number) {
    const last = input.split(OPS_REGEXP).pop() ?? '';

    console.log({ v, input, last });

    if (!last) {
      input = input + String(v);
      return;
    }

    const lastIndex = input.lastIndexOf(last);
    if (v === '.' && HAS_DECIMAL_REGEXP.test(last)) {
      return;
    }
    input =
      input.slice(0, lastIndex) + (last + String(v)).replace(/^0*(?=\d)/, '');
  }

  function calc(value: string | number) {
    const formatted = `${value}`.replaceAll('×', '*').replaceAll('÷', '/');
    const result = Number.parseFloat(Function(`return ${formatted}`)());
    if (Number.isFinite(result)) {
      return String(result);
    }
    return 'Error!';
  }

  function eq() {
    input = calc(input);
  }

  function reset() {
    input = '0';
  }

  function submit() {
    onsubmit?.(parseFloat(input));
  }

  const keyboardMap = {
    Backspace: () => (input = input.slice(0, -1)),
    Delete: reset,
    Return: eq,
    Enter: eq,
  };

  function handleKeyUp(event: KeyboardEvent) {
    const { key } = event;
    if (key === 'Escape') {
      return;
    }
    event.preventDefault();
    if (/^[0-9.+-/*]$/.test(key)) {
      onInput(key);
      return;
    }
    if (Object.hasOwn(keyboardMap, key)) {
      keyboardMap[key as keyof typeof keyboardMap]();
    }
  }

  onMount(async () => {
    await tick();
    root?.focus();
  });
</script>

<svelte:window onkeyup={handleKeyUp} />
<div
  class="outline-hidden grid-calc grid min-block-0 min-inline-0 select-none"
  role="group"
  aria-label="Calculator"
  tabindex="-1"
  bind:this={root}
>
  <div class="flex items-center grid-area-[output]">
    <output
      class="text-3xl m-block-2 p-inline-2 text-start border-is border-brand-200 flex-grow overflow-auto @dark:border-brand-dark-700"
      dir="rtl"><span dir="ltr">{input}</span></output
    >
    <ControlButton
      class="text-2xl ms-1 p-block-2 p-inline-2"
      theme="success"
      onclick={submit}
      label="Submit"
    >
      <span class="i-ion-checkmark"></span>
    </ControlButton>
  </div>
  <CalcButton theme="neutral" area="reset" onclick={reset}>AC</CalcButton>
  {#each Array(10) as _, i}
    <CalcButton onclick={() => onInput(9 - i)} area={'b' + (9 - i)}>
      {9 - i}
    </CalcButton>
  {/each}
  <CalcButton area="dot" onclick={() => onInput('.')}>.</CalcButton>
  <CalcButton theme="neutral" area="divide" onclick={() => onInput('÷')}>
    &divide;
  </CalcButton>
  <CalcButton theme="neutral" area="times" onclick={() => onInput('×')}>
    &times;
  </CalcButton>
  <CalcButton theme="neutral" area="minus" onclick={() => onInput('-')}>
    -
  </CalcButton>
  <CalcButton theme="neutral" area="plus" onclick={() => onInput('+')}>
    +
  </CalcButton>
  <CalcButton area="eq" onclick={eq} theme="invert">=</CalcButton>
</div>
