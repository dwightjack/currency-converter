class UiStore {
  calculatorOpen = $state(false);

  toggleCalculator(toggle?: boolean) {
    this.calculatorOpen =
      typeof toggle === 'boolean' ? toggle : !this.calculatorOpen;
  }
}

export default new UiStore();
