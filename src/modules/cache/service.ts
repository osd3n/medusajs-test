import { MedusaService } from "@medusajs/framework/utils";
import { ConfigModule, logger } from "@medusajs/framework";

import Redis from "ioredis";

import { CachedRate, CacheModuleOptions } from "./types";
import { CACHE_MODULE } from './index';

type InjectedDependencies = {
  configModule: ConfigModule,
}

class CacheModuleService extends MedusaService({}) {
  private readonly redis: Redis;

  private readonly options: CacheModuleOptions;

  constructor({ configModule }: InjectedDependencies) {
    super(...arguments);

    const ref = configModule.modules?.[CACHE_MODULE];

    if (!ref || typeof ref === "boolean" || !ref.options) {
    throw new Error("Cache module is not defined");
    }

    this.options = ref.options as unknown as CacheModuleOptions;

    this.redis = new Redis(this.options.redisUrl);
  }

  /**
   * Получает значение из кеша
   */
  async get<T>(key: string, prefix?: string): Promise<T | null> {
    try {
      const prefixedKey = this.getPrefixedKey(key, prefix);

      const cached = await this.redis.get(prefixedKey);
      if (!cached) {
        return null;
      }

      return JSON.parse(cached) as T;
    } catch (error) {
      logger.error(`Cache get error for key ${key}:`, error as Error);

      return null;
    }
  }

  /**
   * Сохраняет значение в кеш с TTL
   */
  async set(key: string, value: unknown, prefix?: string): Promise<void> {
    try {
      const prefixedKey = this.getPrefixedKey(key, prefix);

      await this.redis.setex(
        prefixedKey,
        this.options.cacheTTLSeconds,
        JSON.stringify(value),
      );
    } catch (error) {
      logger.error(`Cache set error for key ${key}:`, error as Error);
    }
  }

  /**
   * Генерирует ключ кеша для пары валют
   */
  private getPrefixedKey(key: string, prefix?: string): string {
    return `${prefix ?? this.options.prefix}:${key}`;
  }

  /**
   * Правильная очистка кеша
   */
  async clear(pattern?: string): Promise<void> {
    try {
      const keys = await this.redis.keys(`${pattern ?? this.options.prefix}:*`);

      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch (error) {
      logger.error("Cache clear error:", error as Error);
    }
  }
}

export default CacheModuleService;
