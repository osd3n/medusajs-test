import { loadEnv, defineConfig } from '@medusajs/framework/utils';

import { CACHE_MODULE } from './src/modules/cache';

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
        cacheTTLSeconds: 60 * 60,
        prefix: "medusa",
      }
    },
    {
      resolve: "./src/modules/currency-convert",
      dependencies: [CACHE_MODULE],
      options: {
        exchangeRateApiUrl: process.env.EXCHANGE_RATE_API_URL ?? "https://api.exchangerate-api.com/v4/latest",
        supportedCurrencies: [
          "USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY", "SEK", "NZD",
          "MXN", "SGD", "HKD", "NOK", "KRW", "TRY", "RUB", "INR", "BRL", "ZAR",
          "DKK", "PLN", "TWD", "THB", "MYR", "IDR", "CZK", "HUF", "ILS", "CLP",
          "PHP", "AED", "SAR", "ARS", "COP", "PEN", "VND", "PKR", "BGN", "RON",
          "HRK", "UAH", "KZT", "EGP", "QAR", "KWD", "BHD", "OMR", "JOD", "LBP",
        ],
      }
    },
  ],
})
