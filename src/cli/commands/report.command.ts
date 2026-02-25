import { Command } from "commander";
import chalk from "chalk";
import type { Report } from "@core/events/events";
import { formatDuration } from "@utils/date";
import { BaseCommand } from "./base.command";

export class ReportCommand extends BaseCommand {
  constructor(program: Command) {
    super(program);
  }

  init(): void {
    const reportCmd = this.addCommand("report", "Generate time reports");

    const daily = reportCmd
      .command("daily")
      .description("Today's report")
      .option("-d, --date <YYYY-MM-DD>", "Date to report (default: today)");

    daily.action(
      this.action((opts: { date?: string }) => this.initDaily(opts))
    );

    const weekly = reportCmd
      .command("weekly")
      .description("This week's report")
      .option("-d, --date <YYYY-MM-DD>", "Any date within the target week");

    weekly.action(
      this.action((opts: { date?: string }) => this.initWeekly(opts))
    );

    const monthly = reportCmd
      .command("monthly")
      .description("This month's report")
      .option("-d, --date <YYYY-MM-DD>", "Any date within the target month");

    monthly.action(
      this.action((opts: { date?: string }) => this.initMonthly(opts))
    );

    this.debugRegistered("Report");
  }

  private initDaily(opts: { date?: string }) {
    const report = this.call("report:daily", { date: opts.date })
    if (!report) {
      console.log(chalk.yellow("Could not generate daily report."));
      return;
    }
    this.printReport(report);
  }

  private initWeekly(opts: { date?: string }) {
    const report = this.call("report:weekly", { date: opts.date })
    if (!report) {
      console.log(chalk.yellow("Could not generate weekly report."));
      return;
    }
    this.printReport(report);
  }

  private initMonthly(opts: { date?: string }) {
    const report = this.call("report:monthly", { date: opts.date })
    if (!report) {
      console.log(chalk.yellow("Could not generate monthly report."));
      return;
    }
    this.printReport(report);
  }

  private printReport(report: Report): void {
    const { period, from, to, totalSeconds, rows } = report;

    console.log(
      chalk.bold.cyan(`\n  ${period.toUpperCase()} REPORT  ${from} → ${to}\n`)
    );

    if (!rows.length) {
      console.log(chalk.gray("  No entries for this period."));
      return;
    }

    const formattedRows = rows.map((r) => [
      r.date,
      r.label,
      r.project ?? "—",
      formatDuration(r.duration),
      r.note ?? "",
    ]);

    this.printTable(
      ["Date", "Label", "Project", "Duration", "Note"],
      formattedRows
    );

    console.log(
      chalk.bold(
        `  Total: ${chalk.white(formatDuration(totalSeconds))}\n`
      )
    );
  }
}