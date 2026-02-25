import { Command } from "commander";
import { TimerCommand } from "./commands/timer.command";

export function buildCli(version: string): Command {
  const program = new Command();

  program.name("trk").version(version).description("Minimal CLI time tracker — local-first, event-driven");

  new TimerCommand(program).init();

  return program;
}
