import { loadEnv, defineConfig } from '@medusajs/framework/utils';

import { CACHE_MODULE } from './src/modules/cache';
import { EXCHANGE_MODULE } from './src/modules/exchange';
import { SUPPORTED_CURRENCIES } from './src/common/constants';

loadEnv(process.env.NODE_ENV ?? 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET ?? "supersecret",
      cookieSecret: process.env.COOKIE_SECRET ?? "supersecret",
    }
  },
  modules: [
    {
      resolve: "./src/modules/cache",
      options: {
        redisUrl: process.env.REDIS_URL,
        cacheTTLSeconds: process.env.CACHE_TTL_SECONDS ? parseInt(process.env.CACHE_TTL_SECONDS) : 60 * 60,
        prefix: process.env.REDIS_PREFIX ?? "medusa",
      }
    },
    {
      resolve: "./src/modules/exchange",
      options: {
        baseUrl: process.env.EXCHANGE_RATE_API_URL ?? "https://api.exchangerate-api.com/v4/latest",
      }
    },
    {
      resolve: "./src/modules/currency-convert",
      dependencies: [CACHE_MODULE, EXCHANGE_MODULE],
      options: {
        supportedCurrencies: SUPPORTED_CURRENCIES,
      }
    },
  ],
})
