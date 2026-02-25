import type { Metrics, TrendEntry } from "@core/events";
import { loadConfig } from "@core/config";
import { today, dayjs, sparkChar, secondsToHours } from "@utils/date";
import { BaseService } from "./base.service";

export class MetricsService extends BaseService {
  init(): void {
    this.on("metrics:get", () => this.getMetrics());
    this.on("trends:get", () => this.getTrends());
    this.logger.debug("MetricsService registered");
  }

  private getMetrics(): Metrics {
    const cfg = loadConfig();
    const dailyTarget = cfg.work.daily_hours * 3600;

    const drRow = this.get(`SELECT COALESCE(SUM(duration), 0) AS total FROM log_entries WHERE date = ?`, [today()]) as { total: number } | null;
    const dr = secondsToHours(drRow!.total);
    const past14 = Array.from({ length: 14 }, (_, i) => dayjs().subtract(i, "day").format("YYYY-MM-DD"));
    const rows = this.query(
      `
        SELECT date, SUM(duration) AS total
        FROM log_entries
        WHERE date IN (${past14.map(() => "?").join(",")})
        GROUP BY date
      `,
      [...past14],
    ) as Array<{ date: string; total: number }>;

    const activeDays = rows.filter((r) => r.total >= 3600).length;
    const cs = Math.round((activeDays / 14) * 100);
    const pi = dailyTarget > 0 ? Math.min(100, Math.round((drRow!.total / dailyTarget) * 100)) : 0;

    return { pi, dr, cs };
  }

  private getTrends(): TrendEntry[] {
    const days = Array.from({ length: 14 }, (_, i) =>
      dayjs()
        .subtract(13 - i, "day")
        .format("YYYY-MM-DD"),
    );

    const rows = this.query(
      `
        SELECT date, SUM(duration) AS total
        FROM log_entries
        WHERE date IN (${days.map(() => "?").join(",")})
        GROUP BY date
      `,
      [...days],
    ) as Array<{ date: string; total: number }>;

    const byDate = new Map(rows.map((r) => [r.date, r.total]));
    const maxSeconds = Math.max(...rows.map((r) => r.total), 1);

    return days.map((date) => {
      const seconds = byDate.get(date) ?? 0;
      return {
        date,
        hours: secondsToHours(seconds),
        spark: sparkChar(seconds, maxSeconds),
      };
    });
  }
}
