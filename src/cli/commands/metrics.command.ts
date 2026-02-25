import { Command } from "commander";
import chalk from "chalk";
import type { Metrics, TrendEntry } from "@core/events";
import { BaseCommand } from "./base.command";
function gauge(pct: number): string {
  if (pct >= 80) return chalk.green('●●●●●');
  if (pct >= 60) return chalk.yellow('●●●●○');
  if (pct >= 40) return chalk.yellow('●●●○○');
  if (pct >= 20) return chalk.red('●●○○○');
  return chalk.red('●○○○○');
}
export class MetricsCommand extends BaseCommand {
  constructor(program: Command) {
    super(program);
  }

  init(): void {
    const metricsCmd = this.addCommand("metrics", "Show productivity metrics (PI, DR, CS)");
    metricsCmd.action(this.action(() => this.showMetrics()));

    const trendsCmd = this.addCommand("trends", "14-day sparkline trend");
    trendsCmd.action(this.action(() => this.showTrends()));

    this.debugRegistered("Metrics");
  }

  private showMetrics() {
    const m = this.call("metrics:get", undefined)
    if (!m) {
      console.log(chalk.yellow("No metrics available."));
      return;
    }

    console.log(chalk.bold.cyan("\n  Productivity Metrics\n"));
    console.log(`  PI (Productivity Index)  : ${gauge(m.pi)} ${m.pi}%`);
    console.log(`  DR (Daily Rate)          : ${chalk.white(`${m.dr}h`)} logged today`);
    console.log(`  CS (Consistency Score)   : ${gauge(m.cs)} ${m.cs}%\n`);
  }

  private showTrends() {
    const entries = this.call("trends:get", undefined) as TrendEntry[];
    if (!entries || entries.length === 0) {
      console.log(chalk.yellow("No trend data available."));
      return;
    }

    console.log(chalk.bold.cyan("\n  14-day Trend\n"));
    const spark = entries.map((e) => e.spark).join("");
    console.log(`  ${chalk.cyan(spark)}\n`);

    const rows = entries.map((e) => [e.date, `${e.hours}h`, e.spark]);
    this.printTable(["Date", "Hours", ""], rows);
  }
}