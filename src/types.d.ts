export type Rates = Record<string, number>;

export interface Currency {
  code: string;
  rates: Rates;
}

export interface CurrencySymbol {
  code: string;
  description: string;
}
