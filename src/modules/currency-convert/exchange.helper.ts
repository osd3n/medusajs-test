import { logger } from "@medusajs/framework";

import axios, { HttpStatusCode } from "axios";

import { ExchangeRateResponse } from "./types";

// TODO: Вынести в отдельный модуль
export class ExchangeHelper {
  /**
   * Получает курс валюты из внешнего API
   * 
   */
  async getExchangeRate(from: string, to: string, baseUrl: string): Promise<number> {
    try {
      logger.log(`Fetching exchange rate for ${from} to ${to}`);

      const response = await axios.get<ExchangeRateResponse>(
        `${baseUrl}/${from}`
      );

      if (response.status !== HttpStatusCode.Ok) {
        throw new Error(
          `Failed to fetch exchange rates: ${response.status} ${response.statusText}`
        );
      }

      const { data } = response;

      if (!data.rates || !data.rates[to]) {
        throw new Error(`Exchange rate not found for currency: ${to}`);
      }

      logger.log(`Fetched exchange rate for ${from} to ${to}: ${data.rates[to]}`);

      return data.rates[to];
    } catch (error) {
      logger.error(error as Error);

      // TODO: Далее можно добавить какой-нибудь error filter и больше кастомных ошибок
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new Error(
            `Currency API error: ${error.response.status} ${error.response.statusText}`
          );
        }
        if (error.request) {
          throw new Error("Currency API is unavailable. Please try again later.");
        }
      }

      if (error instanceof Error) {
        throw new Error(`Currency API error: ${error.message}`);
      }

      throw new Error("Unknown error occurred while fetching exchange rate");
    }
  }
}
