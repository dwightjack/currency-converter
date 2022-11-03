<script lang="ts">
  import CalcButton from './CalcButton.svelte';
  import ControlButton from './ControlButton.svelte';

  type Action = (src: number, num: number) => number;

  export let onSubmit = (_n: number) => undefined;

  let input = '0';
  let initial: number = null;
  let lastKeyType = '';
  let action: Action = null;

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

<div class="c-calculator min-h-0 min-w-0">
  <div class="c-calculator__top flex items-center">
    <output
      class="c-calculator__output text-3xl my-2 px-2 text-right border-r border-blue-200 flex-grow overflow-auto"
      ><span>{input}</span></output
    >
    <ControlButton
      class="text-2xl p-2 ml-1"
      theme="green"
      icon="check"
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
  <CalcButton area="eq" on:click={eq} theme="negative">=</CalcButton>
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

  .c-calculator__top {
    grid-area: output;
  }

  .c-calculator__output {
    direction: rtl;
  }

  .c-calculator__output > * {
    direction: ltr;
    unicode-bidi: embed;
  }
</style>
