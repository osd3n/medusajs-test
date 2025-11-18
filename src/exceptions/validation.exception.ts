export class ValidationException extends Error {
  public readonly statusCode: number = 400;
  public readonly details: Array<{
    property: string;
    constraints?: Record<string, string>;
  }>;

  constructor(
    message: string,
    details: Array<{
      property: string;
      constraints?: Record<string, string>;
    }>
  ) {
    super(message);
    this.name = "ValidationException";
    this.details = details;
    Object.setPrototypeOf(this, ValidationException.prototype);
  }
}

