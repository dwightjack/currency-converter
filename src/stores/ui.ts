import { writable } from 'svelte/store';

export const calculatorOpen = writable(false);

export function toggleCalculator(toggle?: boolean) {
  calculatorOpen.update(
    (opened) => (opened = typeof toggle === 'boolean' ? toggle : !opened),
  );
}
