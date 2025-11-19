import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

import { validateDto } from "@validation";

import { CURRENCY_CONVERT_MODULE } from "@modules/currency-convert";

import { ConvertCurrencyDto } from "./dto/convert-currency.dto";
import { BaseException } from '@common/exceptions';
import { HttpStatusCode } from 'axios';

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
    if (error instanceof BaseException) {
      res.status(error.statusCode).json({
        message: error.message,
        details: error.details,
      });

      return;
    }

    if (error instanceof Error) {
      res.status(HttpStatusCode.InternalServerError).json({
        message: error.message,
      });

      return;
    }

    res.status(HttpStatusCode.InternalServerError).json({
      message: "Internal server error",
    });
  }
}
