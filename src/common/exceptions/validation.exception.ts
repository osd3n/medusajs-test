import { HttpStatusCode } from 'axios';
import { BaseException } from './base.exception';

type ValidationExceptionDetails = Array<{
  property: string;
  constraints?: Record<string, string>;
}>;

export class ValidationException extends BaseException<ValidationExceptionDetails> {
  public readonly statusCode = HttpStatusCode.BadRequest;
  public readonly details: ValidationExceptionDetails;

  constructor(
    message: string,
    details: ValidationExceptionDetails,
  ) {
    super(message);
    this.name = ValidationException.name;
    this.details = details;
    Object.setPrototypeOf(this, ValidationException.prototype);
  }
}
