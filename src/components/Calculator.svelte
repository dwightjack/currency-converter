<script>
  import CalcButton from './CalcButton.svelte';

  let input = '0';
  let initial = null;
  let lastKeyType = '';
  let action = null;

  const operations = {
    divide: (src, num) => (num === 0 ? src : src / num),
    times: (src, num) => src * num,
    minus: (src, num) => src - num,
    plus: (src, num) => src + num,
  };

  function onInput(v) {
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

  const opHandlers = {};
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

<style>
  .c-calculator {
    display: grid;
    grid-template-columns: repeat(4, minmax(25%, 4rem));
    grid-template-rows: repeat(6, 4rem);
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

<div class="py-1 px-3 c-calculator">
  <output
    class="col-start-1 col-span-4 text-3xl text-right p-2 overflow-ellipsis overflow-hidden"><span
      class="align-middle">{input}</span></output>
  <CalcButton area="reset" on:click={reset}>AC</CalcButton>
  {#each Array(10) as _, i}
    <CalcButton on:click={() => onInput(9 - i)} area={'b' + (9 - i)}>
      {9 - i}
    </CalcButton>
  {/each}
  <CalcButton area="dot" on:click={() => onInput('.')}>.</CalcButton>
  <CalcButton area="divide" on:click={opHandlers.divide}>&divide;</CalcButton>
  <CalcButton area="times" on:click={opHandlers.times}>&times;</CalcButton>
  <CalcButton area="minus" on:click={opHandlers.minus}>-</CalcButton>
  <CalcButton area="plus" on:click={opHandlers.plus}>+</CalcButton>
  <CalcButton area="eq" on:click={eq}>=</CalcButton>
</div>
