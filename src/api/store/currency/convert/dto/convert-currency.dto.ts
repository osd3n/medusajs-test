import { IsIn, IsNotEmpty, Length, IsPositive, IsNumber } from "class-validator";
import { Transform } from "class-transformer";

import { SUPPORTED_CURRENCIES } from "@common/constants";

export class ConvertCurrencyDto {
  @Transform(({ value }) => Number(value))
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  readonly amount: number;

  @Transform(({ value }) => String(value).toUpperCase())
  @IsNotEmpty()
  @Length(3, 3)
  @IsIn(Array.from(SUPPORTED_CURRENCIES), {
    message(validationArguments) {
      return `Unsupported currency: ${validationArguments.value}`;
    },
  })
  readonly from: string;

  @Transform(({ value }) => String(value).toUpperCase())
  @IsNotEmpty()
  @Length(3, 3)
  @IsIn(Array.from(SUPPORTED_CURRENCIES), {
    message(validationArguments) {
      return `Unsupported currency: ${validationArguments.value}`;
    },
  })
  readonly to: string;
}
