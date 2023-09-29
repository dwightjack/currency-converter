export type Rates = Record<string, number>;

export interface Currency {
  code: string;
  rates: Rates;
}

export interface CurrencySymbol {
  code: string;
  description: string;
}

export type ErrorResponse = { success: false; message: string };
export type FetchRatesResponse =
  | { rates: Rates; success: true }
  | ErrorResponse;
export type FetchSymbolsResponse =
  | {
      success: true;
      symbols: CurrencySymbol[];
    }
  | ErrorResponse;
