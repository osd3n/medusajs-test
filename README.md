# medusajs-test

MedusaJS v2 проект с API для конвертации валют.

# Установка и настройка проекта

## Для запуска проекта необходимы запущенная БД PostgreSQL и Redis

### Для установки зависимостей используем yarn
```bash
yarn
```

### После установки зависимостей необходимо запустить скрипт `medusa:setup` для инициализации базы данных
```bash
yarn medusa:setup
```

## Запуск

### Запуск в режиме разработчика
```bash
yarn dev
```

### Продакшн
```bash
yarn build
yarn start
```

## Получение доступа к API

### Для взаимодействия с проектом необходимо создать суперадмина
```bash
npx medusa user -e admin@example.com -p supersecret
```

Для получения доступа к API необходимо после старта проекта зайти в админку `http://localhost:9000/app`

Авторизоваться там под пользователем `admin@example.com` и паролем `supersecret`

Зайти в Settings -> Publishable API Keys и создать ключ для API

## API Endpoints

### Конвертация валют

**GET** `/store/currency/convert`

Конвертирует сумму из одной валюты в другую с использованием актуальных курсов валют.

#### Параметры запроса

- `amount` (required) - сумма для конвертации (положительное число)
- `from` (required) - код исходной валюты (ISO 4217, например: USD, EUR, GBP)
- `to` (required) - код целевой валюты (ISO 4217, например: USD, EUR, GBP)

#### Примеры использования

**Пример 1: Конвертация 100 USD в EUR**

```bash
curl "http://localhost:9000/store/currency/convert?amount=100&from=USD&to=EUR" -H "x-publishable-api-key: pk_test_..."
```

**Ответ:**
```json
{
  "amount": 100,
  "from": "USD",
  "to": "EUR",
  "rate": 0.92,
  "convertedAmount": 92.00,
  "timestamp": 1703123456789
}
```

**Пример 2: Конвертация 500 GBP в JPY**

```bash
curl "http://localhost:9000/store/currency/convert?amount=500&from=GBP&to=JPY" -H "x-publishable-api-key: pk_test_..."
```


#### Коды ошибок

- `400 Bad Request` - неверные параметры запроса (неверный формат суммы, неверный код валюты, отсутствующие параметры)
- `500 Internal Server Error` - ошибка при обращении к внешнему API курсов валют

#### Примеры ошибок

**Неверный код валюты:**
```bash
curl "http://localhost:9000/store/currency/convert?amount=100&from=XXX&to=EUR" -H "x-publishable-api-key: pk_test_..."
```

**Ответ:**
```json
{
  "error": "Invalid currency code: XXX"
}
```

**Отсутствующий параметр:**
```bash
curl "http://localhost:9000/store/currency/convert?amount=100&from=USD" -H "x-publishable-api-key: pk_test_..."
```

**Ответ:**
```json
{
  "error": "Parameter 'to' is required"
}
```

**Неверный формат суммы:**
```bash
curl "http://localhost:9000/store/currency/convert?amount=abc&from=USD&to=EUR" -H "x-publishable-api-key: pk_test_..."
```

**Ответ:**
```json
{
  "error": "Amount must be a number"
}
```

## Особенности реализации

- **Кеширование**: Курсы валют кешируются в памяти на 1 час для оптимизации производительности
- **Валидация**: Строгая валидация всех входных параметров
- **Обработка ошибок**: Корректная обработка ошибок при недоступности внешнего API
- **TypeScript**: Полная типизация всех данных и функций
- **Внешний API**: Используется exchangerate-api.com для получения актуальных курсов валют
- **Модульность**: Проект разделен на отдельные модули, что упрощает его поддержку и тестирование

## Поддерживаемые валюты

USD, EUR, GBP, JPY, AUD, CAD, CHF, CNY, SEK, NZD, MXN, SGD, HKD, NOK, KRW, TRY, RUB, INR, BRL, ZAR, DKK, PLN, TWD, THB, MYR, IDR, CZK, HUF, ILS, CLP, PHP, AED, SAR, ARS, COP, PEN, VND, PKR, BGN, RON, HRK, UAH, KZT, EGP, QAR, KWD, BHD, OMR, JOD, LBP
