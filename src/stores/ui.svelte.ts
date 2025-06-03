import { getContext, setContext } from 'svelte';

class UiStore {
  calculatorOpen = $state(false);

  toggleCalculator(toggle?: boolean) {
    this.calculatorOpen =
      typeof toggle === 'boolean' ? toggle : !this.calculatorOpen;
  }
}

const storeKey = Symbol('uiStore');

export function setUiStore() {
  return setContext(storeKey, new UiStore());
}

export function getUiStore(): UiStore {
  return getContext(storeKey);
}
