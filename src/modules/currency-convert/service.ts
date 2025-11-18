import { MedusaService } from "@medusajs/framework/utils";
import { ConfigModule } from '@medusajs/framework/types';

import { CACHE_MODULE } from "@modules/cache";
import CacheModuleService from '@modules/cache/service';

import { CurrencyConversionParams, CurrencyConversionResponse, CurrencyConvertModuleOptions } from "./types";
import { ExchangeHelper } from "./exchange.helper";
import { CURRENCY_CONVERT_MODULE } from './index';

type InjectedDependencies = {
  [CACHE_MODULE]: CacheModuleService,
  configModule: ConfigModule,
}

class CurrencyConvertModuleService extends MedusaService({}) {
  private readonly cacheService: CacheModuleService;
  
  private readonly exchangeHelper = new ExchangeHelper();

  private readonly options: CurrencyConvertModuleOptions;

  constructor(deps: InjectedDependencies) {
    super(...arguments)

    this.cacheService = deps[CACHE_MODULE];

    const ref = deps.configModule.modules?.[CURRENCY_CONVERT_MODULE];

    if (!ref || typeof ref === "boolean" || !ref.options) {
      throw new Error("Currency module is not defined");
    }

    this.options = ref.options as unknown as CurrencyConvertModuleOptions;
  }

  /**
   * Получает курс валюты из кеша или внешнего API
   */
  async getExchangeRate(from: string, to: string): Promise<number> {
    // Проверяем кеш
    const cacheKey = `${from}:${to}`;
    const cachedRate = await this.cacheService.get<number>(cacheKey, "exchange_rate");

    if (cachedRate) {
      return cachedRate;
    }

    // Получаем курс из внешнего API
    const rate = await this.exchangeHelper.getExchangeRate(
      from,
      to,
      this.options.exchangeRateApiUrl,
    );

    // Сохраняем в кеш
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

    return response;
  }
}

export default CurrencyConvertModuleService;
