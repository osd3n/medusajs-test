
export interface CurrencyConversionParams {
  amount: number;
  from: string;
  to: string;
}

export interface CurrencyConversionResponse {
  amount: number;
  from: string;
  to: string;
  rate: number;
  convertedAmount: number;
  timestamp: number;
}

export interface CurrencyConvertModuleOptions {
  supportedCurrencies: string[];
}
