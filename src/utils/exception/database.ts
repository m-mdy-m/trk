import { BaseException, BaseExceptionOptions } from './exception';

export interface DatabaseExceptionOptions extends BaseExceptionOptions {
  sql?: string;
  params?: unknown[];
}

export class DatabaseException extends BaseException {
  public readonly sql?: string;
  public readonly params?: unknown[];

  constructor(message: string, options: DatabaseExceptionOptions = {}) {
    super(message, options);
    this.sql = options.sql;
    this.params = options.params;
  }

  public override toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      ...(this.sql && { sql: this.sql }),
      ...(this.params && { params: this.params }),
    };
  }
}

export class DatabaseNotInitializedException extends DatabaseException {
  constructor(options: DatabaseExceptionOptions = {}) {
    super('Database not initialised. Call initDb() first.', {
      code: 'DB_NOT_INITIALIZED',
      ...options,
    });
  }
}
export class DatabaseConnectionException extends DatabaseException {
  constructor(cause?: unknown, options: DatabaseExceptionOptions = {}) {
    super('Failed to open/connect to database.', {
      code: 'DB_CONNECTION_FAILED',
      cause,
      ...options,
    });
  }
}
export class DatabaseMigrationException extends DatabaseException {
  constructor(cause?: unknown, options: DatabaseExceptionOptions = {}) {
    super('Database migration failed.', {
      code: 'DB_MIGRATION_FAILED',
      cause,
      ...options,
    });
  }
}