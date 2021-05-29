export type Rates = Record<string, number>;

export interface Currency {
  code: string;
  rates: Rates;
  lastUpdate: number;
}
