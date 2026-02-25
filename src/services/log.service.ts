import type { LogEntry } from "@core/events";
import { uid, now, today, hoursToSeconds } from "@utils/date";
import { BaseService } from "./base.service";

export class LogService extends BaseService {
  init(): void {
    this.on("log:add", (p) => this.add(p));
    this.on("log:list", (p) => this.list(p));
    this.logger.debug("LogService registered");
  }

  private add(payload: { label: string; hours: number; note?: string; date?: string }): LogEntry {
    const entry: LogEntry = {
      id: uid(),
      label: payload.label,
      projectId: null,
      date: payload.date ?? today(),
      duration: hoursToSeconds(payload.hours),
      note: payload.note,
      source: "manual",
      createdAt: now(),
    };

    this.execute(
      `
      INSERT INTO log_entries (id, label, project_id, date, duration, note, source, created_at)
      VALUES (@id, @label, @projectId, @date, @duration, @note, @source, @createdAt)
    `,
      entry,
    );

    this.logger.info(`Manual log added: ${entry.label} — ${payload.hours}h`);
    return entry;
  }

  private list(payload: { date?: string }): LogEntry[] {
    const date = payload.date ?? today();

    return this.query<LogEntry>(
      `
      SELECT 
        id, 
        label, 
        project_id as projectId, 
        date, 
        duration, 
        note, 
        source, 
        created_at as createdAt
      FROM log_entries
      WHERE date = ?
      ORDER BY created_at ASC
    `,
      [date],
    );
  }
}
