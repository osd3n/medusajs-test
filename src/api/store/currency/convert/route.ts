import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

import { validateDto } from "@validation";
import { ValidationException } from "@exceptions/validation.exception";

import { CURRENCY_CONVERT_MODULE } from "@modules/currency-convert";
import { CurrencyConversionResponse } from "@modules/currency-convert/types";

import { ConvertCurrencyDto } from "./dto/convert-currency.dto";

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    // Валидация
    const { amount, from, to } = await validateDto(
      ConvertCurrencyDto,
      req.query
    );

    // Получаем сервис модуля из контейнера
    const currencyModuleService = req.scope.resolve(
      CURRENCY_CONVERT_MODULE
    );

    // Конвертация
    const response = await currencyModuleService.processCurrencyConversion({
      amount,
      from,
      to,
    });

    res.json(response);
  } catch (error) {
    if (error instanceof ValidationException) {
      res.status(error.statusCode).json({
        error: error.message,
        details: error.details,
      });
      return;
    }

    if (error instanceof Error) {
      res.status(500).json({
        error: error.message,
      });
      return;
    }

    res.status(500).json({
      error: "Internal server error",
    });
  }
}
