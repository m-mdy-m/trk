export interface BaseExceptionOptions {
  code?: string; // machine-readable error code
  cause?: unknown; // original error/cause
  meta?: Record<string, unknown>; // any extra data
}

export class BaseException extends Error {
  public readonly code: string;
  public readonly cause?: unknown;
  public readonly meta?: Record<string, unknown>;
  public readonly name: string;

  constructor(message: string, options: BaseExceptionOptions = {}) {
    super(message);
    this.name = this.constructor.name;
    this.code = options.code ?? "ERROR";
    this.cause = options.cause;
    this.meta = options.meta;

    // capture stack trace (V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  public toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      ...(this.meta && { meta: this.meta }),
      ...(this.cause instanceof Error ? { cause: { name: this.cause.name, message: this.cause.message } } : { cause: this.cause }),
      stack: this.stack,
    };
  }
}
