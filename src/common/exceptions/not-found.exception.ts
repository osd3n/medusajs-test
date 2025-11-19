import { HttpStatusCode } from 'axios';

import { BaseException } from './base.exception';

export class NotFoundException extends BaseException {
  public readonly statusCode = HttpStatusCode.NotFound;

  constructor(
    message?: string,
  ) {
    super(message ?? "Not found");
    this.name = NotFoundException.name;
    Object.setPrototypeOf(this, NotFoundException.prototype);
  }
}
