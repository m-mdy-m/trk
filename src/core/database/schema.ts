import Database from "better-sqlite3";
export function runMigrations(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS schema_version (
      version INTEGER PRIMARY KEY
    );

    CREATE TABLE IF NOT EXISTS timer_blocks (
      id          TEXT    PRIMARY KEY,
      label       TEXT    NOT NULL,
      project_id  TEXT,
      started_at  TEXT    NOT NULL,
      stopped_at  TEXT,
      duration    INTEGER,
      note        TEXT,
      status      TEXT    NOT NULL DEFAULT 'running'
    );

    CREATE TABLE IF NOT EXISTS log_entries (
      id          TEXT    PRIMARY KEY,
      label       TEXT    NOT NULL,
      project_id  TEXT,
      date        TEXT    NOT NULL,
      duration    INTEGER NOT NULL,
      note        TEXT,
      source      TEXT    NOT NULL DEFAULT 'manual',
      created_at  TEXT    NOT NULL
    );

    CREATE TABLE IF NOT EXISTS projects (
      id           TEXT    PRIMARY KEY,
      name         TEXT    NOT NULL UNIQUE,
      goal_hours   REAL,
      priority     TEXT,
      created_at   TEXT    NOT NULL
    );

    CREATE TABLE IF NOT EXISTS goals (
      id           TEXT    PRIMARY KEY,
      label        TEXT    NOT NULL,
      period       TEXT    NOT NULL,
      target_hours REAL    NOT NULL,
      deadline     TEXT,
      created_at   TEXT    NOT NULL
    );

    CREATE TABLE IF NOT EXISTS checklist_items (
      id         TEXT    PRIMARY KEY,
      text       TEXT    NOT NULL,
      done       INTEGER NOT NULL DEFAULT 0,
      list_name  TEXT    NOT NULL,
      date       TEXT    NOT NULL
    );

    CREATE TABLE IF NOT EXISTS config (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);
}