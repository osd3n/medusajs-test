import { HttpStatusCode } from 'axios';

import { BaseException } from './base.exception';

export class InternalServerErrorException extends BaseException {
  public readonly statusCode = HttpStatusCode.InternalServerError;

  constructor(
    message?: string,
  ) {
    super(message ?? "Internal server error");
    this.name = InternalServerErrorException.name;
    Object.setPrototypeOf(this, InternalServerErrorException.prototype);
  }
}
