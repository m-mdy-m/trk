import { Command } from "commander";
import { SharedCommand } from "@common/shared.common";
import { EventPayload, Events } from "@glandjs/events";
import { TrkEvents } from "@core/events";
import Table from "cli-table3";
export abstract class BaseCommand extends SharedCommand {
  protected program: Command;
  abstract init(): void;

  constructor(program: Command) {
    super();
    this.program = program;
  }

  protected addCommand(name: string, description: string): Command {
    return this.program.command(name).description(description);
  }
  protected call<T extends Events<TrkEvents>>(event: T, payload: EventPayload<TrkEvents, T>) {
    try {
      return this.bus.call(event, payload);
    } catch (err) {
      this.logger.error(`Failed to call event: ${event}`, { err, payload });
      return null;
    }
  }
  protected debugRegistered(name: string) {
    super.debugRegistered(`${name} command`);
  }
  protected action(handler: (...args: any[]) => any | Promise<any>) {
    return async (...args: any[]) => {
      try {
        const ret = handler(...args);
        if (ret && typeof ret.then === "function") {
          await ret;
        }
      } catch (err) {
        this.logger.error("Command execution failed", err);
        process.exit(1);
      }
    };
  }
  protected exitWithError(message: string, code = 1): never {
    this.logger.error(message);
    process.exit(code);
  }

  protected requireArg<T>(value: T | undefined | null, hint: string): T {
    if (value === undefined || value === null || (typeof value === "string" && value.trim() === "")) {
      this.exitWithError(hint);
    }
    return value as T;
  }
  protected printTable(head: string[], rows: any[][]) {
    const table = new Table({
      head,
      style: { head: ["cyan"] },
    });
    for (const r of rows) table.push(r);
    this.logger.info(table.toString());
  }
}
