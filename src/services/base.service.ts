import { SharedCommand } from "@common/shared.common";
import { getDb } from "@core/database";
import { DatabaseException } from "@utils/exception";
import { Database } from "better-sqlite3";
export abstract class BaseService extends SharedCommand {
  abstract init(): void;
  protected get db(): Database {
    return getDb();
  }
  protected query<T>(sql: string, params?: unknown[] | Record<string, unknown>): T[] {
    try {
      const stmt = this.db.prepare(sql);
      return Array.isArray(params) ? (stmt.all(...params) as T[]) : (stmt.all(params) as T[]);
    } catch (err) {
      this.logger.error("DB QUERY FAILED", { sql, params, err });
      throw new DatabaseException("Database query failed", {
        code: "DB_QUERY_FAILED",
        cause: err,
        sql,
        params: Array.isArray(params) ? params : undefined,
        meta: { namedParams: !Array.isArray(params) ? params : undefined },
      });
    }
  }
  protected get<T = unknown>(sql: string, params?: unknown[] | Record<string, unknown>): T | null {
    try {
      const stmt = this.db.prepare(sql);
      const row = Array.isArray(params) ? stmt.get(...params) : stmt.get(params);
      // explicit null for no row
      return row === undefined ? null : (row as T);
    } catch (err) {
      this.logger.error("DB GET FAILED", { sql, params, err });
      throw new DatabaseException("Database get failed", {
        code: "DB_GET_FAILED",
        cause: err,
        sql,
        params: Array.isArray(params) ? params : undefined,
        meta: { namedParams: !Array.isArray(params) ? params : undefined },
      });
    }
  }

  protected execute(sql: string, params?: unknown[] | Record<string, unknown>) {
    try {
      const stmt = this.db.prepare(sql);
      return Array.isArray(params) ? stmt.run(...params) : stmt.run(params);
    } catch (err) {
      this.logger.error("DB EXECUTE FAILED", { sql, params, err });
      throw new DatabaseException("Database execution failed", {
        code: "DB_EXECUTION_FAILED",
        cause: err,
        sql,
        params: Array.isArray(params) ? params : undefined,
        meta: { namedParams: !Array.isArray(params) ? params : undefined },
      });
    }
  }
  protected transaction<TArgs extends any[], R>(fn: (...args: TArgs) => R) {
    // create a transactional wrapper from the underlying db
    const tx = this.db.transaction(fn as any);
    return (...args: TArgs): R => {
      try {
        return tx(...args);
      } catch (err) {
        this.logger.error("DB TRANSACTION FAILED", { err });
        throw new DatabaseException("Database transaction failed", {
          code: "DB_TRANSACTION_FAILED",
          cause: err,
        });
      }
    };
  }
}
