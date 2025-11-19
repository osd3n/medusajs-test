import { HttpStatusCode } from 'axios';
import { BaseException } from './base.exception';

export class ExchangeServiceUnavailableException extends BaseException {
  public readonly statusCode: number = HttpStatusCode.ServiceUnavailable;

  constructor(
    message?: string,
  ) {
    super(message ?? "Exchange service unavailable");
    this.name = ExchangeServiceUnavailableException.name;
    Object.setPrototypeOf(this, ExchangeServiceUnavailableException.prototype);
  }
}
