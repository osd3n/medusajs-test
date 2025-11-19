import { ConfigModule, logger } from "@medusajs/framework";
import { MedusaService } from '@medusajs/framework/utils';

import axios from "axios";

import { ExchangeServiceUnavailableException, InternalServerErrorException, NotFoundException } from '@common/exceptions';

import { EXCHANGE_MODULE } from './index';
import { ExchangeModuleOptions, ExchangeRateResponse } from "./types";

type InjectedDependencies = {
  configModule: ConfigModule,
}

class ExchangeModuleService extends MedusaService({}) {

  private readonly options: ExchangeModuleOptions;

  constructor({ configModule }: InjectedDependencies) {
    super(...arguments);

    const ref = configModule.modules?.[EXCHANGE_MODULE];

    if (!ref || typeof ref === "boolean" || !ref.options) {
      throw new Error("Exchange module is not defined");
    }

    this.options = ref.options as unknown as ExchangeModuleOptions;
  }
  /**
   * Получает курс валюты из внешнего API
   * 
   */
  async getExchangeRate(from: string, to: string): Promise<number> {
    try {
      logger.info(`Fetching exchange rate for ${from} to ${to}`);

      const response = await axios.get<ExchangeRateResponse>(
        from,
        { baseURL: this.options.baseUrl }
      );

      const { data } = response;

      if (!data.rates || !data.rates[to]) {
        logger.warn(`Exchange rate not found for currency: ${to}`);

        throw new NotFoundException(`Exchange rate not found for currency: ${to}`);
      }

      logger.info(`Fetched exchange rate for ${from} to ${to}: ${data.rates[to]}`);

      return data.rates[to];
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error);
      } else {
        logger.error(JSON.stringify(error));
      }

      // TODO: Далее можно добавить какой-нибудь error filter и больше кастомных ошибок
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new ExchangeServiceUnavailableException(
            `Currency API error: ${error.response.status} ${error.response.statusText}`
          );
        }
        if (error.request) {
          throw new ExchangeServiceUnavailableException();
        }
      }

      throw new InternalServerErrorException();
    }
  }
}

export default ExchangeModuleService;
