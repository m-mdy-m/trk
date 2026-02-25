import { getDb } from "@core/database";
import { logger } from "@utils/logger";
import type { Report, ReportRow } from "@core/events";
import { today, weekRange, monthRange } from "@utils/date";
import { BaseService } from "./base.service";

export class ReportService extends BaseService {
  init(): void {
    this.on("report:daily", (p) => this.daily(p));
    this.on("report:weekly", (p) => this.weekly(p));
    this.on("report:monthly", (p) => this.monthly(p));
    logger.debug("ReportService registered");
  }

  private daily(payload: { date?: string }): Report {
    const date = payload.date ?? today();
    return this.buildReport("daily", date, date);
  }

  private weekly(payload: { date?: string }): Report {
    const { from, to } = weekRange(payload.date);
    return this.buildReport("weekly", from, to);
  }

  private monthly(payload: { date?: string }): Report {
    const { from, to } = monthRange(payload.date);
    return this.buildReport("monthly", from, to);
  }

  private buildReport(period: Report["period"], from: string, to: string): Report {
    const rows = this.query<ReportRow>(
      `
        SELECT
          le.date,
          le.label,
          p.name  AS project,
          le.duration,
          le.note
        FROM log_entries le
        LEFT JOIN projects p ON p.id = le.project_id
        WHERE le.date BETWEEN ? AND ?
        ORDER BY le.date ASC, le.created_at ASC
      `,
      [from, to],
    );

    const totalSeconds = rows.reduce((acc, r) => acc + r.duration, 0);

    return { period, from, to, totalSeconds, rows };
  }
}
