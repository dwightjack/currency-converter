import { writable } from 'svelte/store';

export const calculatorOpen = writable(true);

export function toggleCalculator(toggle) {
  calculatorOpen.update(
    (opened) => (opened = typeof toggle === 'boolean' ? toggle : !opened)
  );
}
