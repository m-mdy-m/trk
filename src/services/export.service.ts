import type { ExportResult, ReportRow } from "@core/events";
import { today, weekRange, formatDuration } from "@utils/date";
import { BaseService } from "./base.service";

export class ExportService extends BaseService {
  init(): void {
    this.on("export:run", (p) => this.run(p));
    this.logger.debug("ExportService registered");
  }

  private run(payload: { format: "md" | "json" | "csv"; from?: string; to?: string }): ExportResult {
    const { from, to } = payload.from && payload.to ? { from: payload.from, to: payload.to } : weekRange(today());

    const rows = this.query<ReportRow>(
      `
        SELECT le.date, le.label, p.name AS project, le.duration, le.note
        FROM log_entries le
        LEFT JOIN projects p ON p.id = le.project_id
        WHERE le.date BETWEEN ? AND ?
        ORDER BY le.date ASC
      `,
      [from, to],
    );

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    const filename = `trk-export-${from}-${to}-${timestamp}.${payload.format}`;

    let content: string;
    switch (payload.format) {
      case "json":
        content = JSON.stringify({ from, to, rows }, null, 2);
        break;
      case "csv":
        content = this.toCsv(rows);
        break;
      default:
        content = this.toMarkdown(from, to, rows);
    }

    this.logger.info(`Export generated: ${filename}`);
    return { format: payload.format, content, filename };
  }

  private toCsv(rows: ReportRow[]): string {
    const header = "Date,Label,Project,Duration (h),Note";
    const lines = rows.map((r) => [r.date, `"${r.label}"`, r.project ?? "", +(r.duration / 3600).toFixed(2), r.note ?? ""].join(","));
    return [header, ...lines].join("\n");
  }

  private toMarkdown(from: string, to: string, rows: ReportRow[]): string {
    const total = rows.reduce((a, r) => a + r.duration, 0);
    const lines = [
      `# TRK Export: ${from} → ${to}`,
      `**Total:** ${formatDuration(total)}`,
      "",
      "| Date | Label | Project | Duration | Note |",
      "|------|-------|---------|----------|------|",
      ...rows.map((r) => `| ${r.date} | ${r.label} | ${r.project ?? "—"} | ${formatDuration(r.duration)} | ${r.note ?? ""} |`),
    ];
    return lines.join("\n");
  }
}
