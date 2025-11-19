import { MedusaService } from "@medusajs/framework/utils";
import { ConfigModule } from '@medusajs/framework/types';
import { logger } from '@medusajs/framework';

import { CACHE_MODULE } from "@modules/cache";
import CacheModuleService from '@modules/cache/service';
import { EXCHANGE_MODULE } from "@modules/exchange";
import ExchangeModuleService from "@modules/exchange/service";

import { CurrencyConversionParams, CurrencyConversionResponse } from "./types";

type InjectedDependencies = {
  [CACHE_MODULE]: CacheModuleService,
  [EXCHANGE_MODULE]: ExchangeModuleService,
}

class CurrencyConvertModuleService extends MedusaService({}) {
  private readonly cacheService: CacheModuleService;
  
  private readonly exchangeService: ExchangeModuleService;

  constructor(deps: InjectedDependencies) {
    super(...arguments)

    this.cacheService = deps[CACHE_MODULE];
    this.exchangeService = deps[EXCHANGE_MODULE];
  }

  /**
   * Получает курс валюты из кеша или внешнего API
   */
  async getExchangeRate(from: string, to: string): Promise<number> {
    const cacheKey = `${from}:${to}`;
    const cachedRate = await this.cacheService.get<number>(cacheKey, "exchange_rate");

    if (cachedRate) {
      return cachedRate;
    }

    const rate = await this.exchangeService.getExchangeRate(
      from,
      to,
    );

    await this.cacheService.set(cacheKey, rate, "exchange_rate");

    return rate;
  }

  /**
   * Конвертирует сумму из одной валюты в другую
   */
  async processCurrencyConversion(
    params: CurrencyConversionParams,
  ): Promise<CurrencyConversionResponse> {
    const { amount, from, to } = params;

    logger.info(`Processing currency conversion for ${amount} ${from} to ${to}`);

    const now = Date.now();

    // Для оптимизации, отдельно проверяем случай, когда исходная и целевая валюты совпадают
    if (from === to) {
      return {
        amount,
        from,
        to,
        rate: 1,
        convertedAmount: amount,
        timestamp: now
      }  
    }

    const rate = await this.getExchangeRate(from, to);

    const convertedAmount = amount * rate;

    const response: CurrencyConversionResponse = {
      amount,
      from,
      to,
      rate,
      convertedAmount: Math.round(convertedAmount * 100) / 100,
      timestamp: now,
    };

    logger.info(`Currency conversion response: ${JSON.stringify(response)}`);

    return response;
  }
}

export default CurrencyConvertModuleService;
