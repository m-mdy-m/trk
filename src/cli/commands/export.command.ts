import { Command } from "commander";
import chalk from "chalk";
import fs from "fs";
import path from "path";
import type { ExportResult } from "@core/events";
import { BaseCommand } from "./base.command";

export class ExportCommand extends BaseCommand {
  constructor(program: Command) {
    super(program);
  }

  init(): void {
    const cmd = this.addCommand("export", "Export logs to file");

    cmd
      .option("--format <fmt>", "md | json | csv", "md")
      .option("--from <YYYY-MM-DD>", "Start date")
      .option("--to <YYYY-MM-DD>", "End date")
      .option("-o, --out <dir>", "Output directory (default: current dir)", ".")
      .action(
        this.action((opts: {
          format: "md" | "json" | "csv";
          from?: string;
          to?: string;
          out?: string;
        }) => this.initExport(opts))
      );

    this.debugRegistered("Export");
  }

  private initExport(opts: {
    format: "md" | "json" | "csv";
    from?: string;
    to?: string;
    out?: string;
  }) {
    const format = opts.format ?? "md";

    const result = this.call("export:run", {
      format,
      from: opts.from,
      to: opts.to,
    }) as ExportResult | null;

    if (!result) {
      this.logger.warn("Export failed or returned no result.");
      return;
    }

    const outDir = opts.out ?? ".";
    const outPath = path.resolve(outDir, result.filename);

    try {
      fs.writeFileSync(outPath, result.content, "utf8");
    } catch (err) {
      this.exitWithError(`Failed to write file to ${outPath}`);
    }

    console.log(chalk.green(`✔  Exported successfully`));
    console.log(`   File   : ${chalk.bold(result.filename)}`);
    console.log(`   Path   : ${chalk.cyan(outPath)}`);
    if (opts.from || opts.to) {
      console.log(
        `   Range  : ${opts.from ?? "..."} → ${opts.to ?? "..."}`
      );
    }
    console.log(`   Format : ${format}`);
  }
}