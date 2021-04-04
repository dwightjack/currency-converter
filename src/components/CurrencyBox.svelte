<script lang="ts">
  import { getCurrencySymbol } from '../stores/currency';
  export let label = '';
  export let id = '';
  export let current = '';
  export let currencies = [];

  $: inputSymbol = current && getCurrencySymbol(current);
  $: currencyFlag = current && `/flags/${current.toLowerCase()}.png`;
</script>

<fieldset
  class="p-0 border-2 border-blue-200 text-xl rounded-md min-w-0 text-gray-800"
>
  <legend class="sr-only">{label}</legend>
  <div
    class="bg-blue-100 p-2 flex gap-2 items-center border-blue-200 border-b-2"
  >
    <label for={id + '-select'} class="sr-only">Currency</label>
    <img src={currencyFlag} alt="" class="w-6" loading="lazy" />
    <select
      name={id + '-select'}
      id={id + '-select'}
      style={currencyFlag}
      class="appearance-none w-full text-blue-900 font-bold bg-transparent border-0"
    >
      {#each currencies as currency}
        <option selected={current === currency || undefined} value={currency}>
          {currency}
        </option>
      {/each}
    </select>
  </div>

  <div class="flex gap-x-2 items-baseline p-2">
    <label for={id + '-amount'}>
      <span class="sr-only">Amount</span>
      {inputSymbol}
    </label>
    <slot />
  </div>
</fieldset>
