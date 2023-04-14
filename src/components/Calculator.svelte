<script lang="ts">
  import CalcButton from './CalcButton.svelte';
  import ControlButton from './ControlButton.svelte';

  type Action = (src: number, num: number) => number;

  export let onSubmit = (_n: number) => undefined;

  let input = '0';
  let initial: number = null;
  let lastKeyType = '';
  let action: Action = null;

  $: formattedInput = new Intl.NumberFormat().format(Number(input));

  const operations: Record<'divide' | 'times' | 'minus' | 'plus', Action> = {
    divide: (src, num) => (num === 0 ? src : src / num),
    times: (src, num) => src * num,
    minus: (src, num) => src - num,
    plus: (src, num) => src + num,
  };

  function onInput(v: unknown) {
    if (lastKeyType !== '') {
      input = '';
      lastKeyType = '';
    }
    if (v === '.' && input.includes('.')) {
      return;
    }
    input = (input + String(v)).replace(/^0*(?=\d)/, '');
  }

  function reset() {
    input = '0';
    initial = null;
    lastKeyType = '';
    action = null;
  }

  function update() {
    if (initial === null || !action) {
      initial = parseFloat(input);
      return;
    }
    initial = action(initial, parseFloat(input));
    input = String(initial);
  }

  function eq() {
    if (lastKeyType) {
      return;
    }
    lastKeyType = 'eq';
    update();
    action = null;
  }

  function submit() {
    onSubmit(parseFloat(input));
  }

  const opHandlers = {} as Record<keyof typeof operations, () => void>;
  for (const [key, fn] of Object.entries(operations)) {
    opHandlers[key] = () => {
      if (lastKeyType === 'operator') {
        return;
      }
      lastKeyType = 'operator';
      update();
      action = fn;
    };
  }
</script>

<div class="c-calculator min-block-0 min-inline-0">
  <div class="grid-area-[output] flex items-center">
    <output
      class="text-3xl m-block-2 p-inline-2 text-end border-ie border-brand-200 flex-grow overflow-auto @dark:border-brand-dark-700"
      aria-label="Result">{formattedInput}</output
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
  <CalcButton theme="neutral" area="divide" on:click={opHandlers.divide}>
    &divide;
  </CalcButton>
  <CalcButton theme="neutral" area="times" on:click={opHandlers.times}>
    &times;
  </CalcButton>
  <CalcButton theme="neutral" area="minus" on:click={opHandlers.minus}>
    -
  </CalcButton>
  <CalcButton theme="neutral" area="plus" on:click={opHandlers.plus}>
    +
  </CalcButton>
  <CalcButton area="eq" on:click={eq} theme="invert">=</CalcButton>
</div>

<style>
  .c-calculator {
    display: grid;
    grid-template-columns: repeat(4, minmax(calc(25% - 1px), 4rem));
    grid-template-rows: repeat(6, minmax(calc((100% - 6px) / 6), 4rem));
    grid-template-areas:
      'output output output output'
      'reset reset divide times'
      'b7 b8 b9 minus'
      'b4 b5 b6 plus'
      'b1 b2 b3 eq'
      'b0 b0 dot eq';
    gap: 1px;
  }
</style>
