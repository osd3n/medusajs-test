export interface ExchangeRateResponse {
  rates: Record<string, number>;
  base: string;
  date: string;
}

export interface ExchangeModuleOptions {
  baseUrl: string;
}
