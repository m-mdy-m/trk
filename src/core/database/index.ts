import Database from "better-sqlite3";
import fs from "fs";
import { logger } from "@utils/logger";
import { runMigrations } from "./schema";
import { DatabaseConnectionException, DatabaseMigrationException, DatabaseNotInitializedException } from "@utils/exception";
import { DB_PATH, TRK_DIR } from "@common/constant";

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!_db) throw new DatabaseNotInitializedException();
  return _db;
}

export function initDb(): Database.Database {
  if (_db) return _db;

  try {
    if (!fs.existsSync(TRK_DIR)) {
      fs.mkdirSync(TRK_DIR, { recursive: true });
    }
  } catch (err) {
    throw new DatabaseConnectionException(err, { meta: { path: TRK_DIR } });
  }

  _db = new Database(DB_PATH);
  _db.pragma("journal_mode = WAL");
  _db.pragma("foreign_keys = ON");

  try {
    runMigrations(_db);
  } catch (err) {
    throw new DatabaseMigrationException(err);
  }

  logger.debug(`Database ready at ${DB_PATH}`);
  return _db;
}

export function closeDb(): void {
  _db?.close();
  _db = null;
}
