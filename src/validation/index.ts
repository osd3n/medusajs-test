import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

import { ValidationException } from "../exceptions/validation.exception";

export async function validateDto<T extends object>(
  dtoClass: new () => T,
  payload: any
): Promise<T> {
  const instance = plainToInstance(dtoClass, payload);

  const errors = await validate(instance, {
    whitelist: true,
    forbidNonWhitelisted: true,
  });

  if (errors.length > 0) {
    const formatted = errors.map((e) => {
      const result: { property: string; constraints?: Record<string, string> } = {
        property: e.property,
      };
      if (e.constraints) {
        result.constraints = e.constraints;
      }
      return result;
    });

    throw new ValidationException("Validation failed", formatted);
  }

  return instance;
}
