<script>
  import CalcButton from './CalcButton.svelte';

  let input = '';

  function onInput(v) {
    if (v === '.' && input.includes('.')) {
      return;
    }
    if (v === 0 && /^0+$/.test(input)) {
      return;
    }
    if (input === '0' && v !== '.') {
      input = '';
    }
    input += String(v);
  }

  function reset() {
    input = '';
  }
</script>

<style>
  .c-calculator {
    display: grid;
    grid-template-columns: repeat(4, minmax(25%, 4rem));
    grid-template-rows: repeat(6, 4rem);
    grid-template-areas:
      'output output output output'
      'reset reset div mult'
      'b7 b8 b9 min'
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
  <CalcButton area="div">&divide;</CalcButton>
  <CalcButton area="mult">&times;</CalcButton>
  <CalcButton area="min">-</CalcButton>
  <CalcButton area="plus">+</CalcButton>
  <CalcButton area="eq">=</CalcButton>
</div>
