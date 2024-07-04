<script lang="ts">
  import { onMount, tick } from 'svelte';
  import CalcButton from './CalcButton.svelte';
  import ControlButton from './ControlButton.svelte';

  const OPS_REGEXP = /[*+-/]$/;
  const HAS_DECIMAL_REGEXP = /\d+\.\d*$/;

  export let onSubmit = (_n: number) => undefined;

  export let initial: number | null = null;
  let root: HTMLElement | undefined;

  let result: number = Number.isNaN(initial) ? 0 : initial;
  let input = String(result);

  // https://stackoverflow.com/questions/2901102/how-to-format-a-number-with-commas-as-thousands-separators
  // match and extract trailing digits (positive and negative)
  // add thousands separator
  // keep max 3 decimal numbers
  $: output = (input.match(/((^-|)[0-9.]+)[.\D]?$/)?.[1] ?? '0')
    .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
    .replace(/(\.\d{3})\d*$/, '$1');

  $: pressed = OPS_REGEXP.test(input) ? input.at(-1) : null;
  function onInput(v: string | number) {
    if (v === '.' && HAS_DECIMAL_REGEXP.test(input)) {
      return;
    }
    if (typeof v === 'string' && OPS_REGEXP.test(v)) {
      if (OPS_REGEXP.test(input)) {
        input = input.replace(OPS_REGEXP, (op) => (op === v ? '' : v));
        return;
      }
      input = calc(input) + v;
      return;
    }
    input = (input + String(v)).replace(/^0*(?=\d)/, '');
  }

  function calc(value: string | number) {
    const result = Number.parseFloat(Function(`return ${value}`)());
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
    onSubmit(parseFloat(input));
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
    if (keyboardMap[key]) {
      keyboardMap[key]();
    }
  }

  onMount(async () => {
    await tick();
    root?.focus();
  });
</script>

<svelte:window on:keyup={handleKeyUp} />
<div
  class="grid grid-calc min-block-0 min-inline-0 outline-none select-none"
  role="group"
  aria-label="Calculator"
  tabindex="-1"
  bind:this={root}
>
  <div class="grid-area-[output] flex items-center">
    <output
      class="text-3xl m-block-2 p-inline-2 text-end border-ie border-brand-200 flex-grow overflow-auto @dark:border-brand-dark-700"
      aria-label="Result">{output}</output
    >
    <ControlButton
      class="text-2xl p-block-2 p-inline-2 ms-1"
      theme="green"
      icon="i-ion-checkmark"
      on:click={submit}
      label="Submit"
    />
  </div>
  <CalcButton theme="neutral" area="reset" on:click={reset}>AC</CalcButton>
  {#each Array(10) as _, i}
    <CalcButton on:click={() => onInput(9 - i)} area={'b' + (9 - i)}>
      {9 - i}
    </CalcButton>
  {/each}
  <CalcButton area="dot" on:click={() => onInput('.')}>.</CalcButton>
  <CalcButton
    theme="neutral"
    pressed={pressed === '/'}
    area="divide"
    on:click={() => onInput('/')}
  >
    &divide;
  </CalcButton>
  <CalcButton
    theme="neutral"
    pressed={pressed === '*'}
    area="times"
    on:click={() => onInput('*')}
  >
    &times;
  </CalcButton>
  <CalcButton
    theme="neutral"
    pressed={pressed === '-'}
    area="minus"
    on:click={() => onInput('-')}
  >
    -
  </CalcButton>
  <CalcButton
    theme="neutral"
    pressed={pressed === '+'}
    area="plus"
    on:click={() => onInput('+')}
  >
    +
  </CalcButton>
  <CalcButton area="eq" on:click={eq} theme="invert">=</CalcButton>
</div>
