export abstract class BaseException<T=unknown> extends Error {
  public readonly statusCode: number;

  public readonly message: string;

  public readonly details?: T;
}
