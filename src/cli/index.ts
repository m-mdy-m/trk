import { Command } from "commander";
import { TimerCommand } from "./commands/timer.command";
import { ChecklistCommand } from "./commands/checklist.command";
import { ConfigCommand } from "./commands/config.command";
import { ExportCommand } from "./commands/export.command";
import { GoalCommand } from "./commands/goal.command";
import { LogCommand } from "./commands/log.command";
import { MetricsCommand } from "./commands/metrics.command";
import { ProjectCommand } from "./commands/project.command";
import { ReportCommand } from "./commands/report.command";

export function buildCli(version: string): Command {
  const program = new Command();

  program.name("trk").version(version).description("Minimal CLI time tracker — local-first, event-driven");

  new TimerCommand(program).init();
  new ChecklistCommand(program).init();
  new ConfigCommand(program).init();
  new ExportCommand(program).init();
  new GoalCommand(program).init();
  new LogCommand(program).init();
  new MetricsCommand(program).init();
  new ProjectCommand(program).init();
  new ReportCommand(program).init();

  return program;
}
