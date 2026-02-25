import { Command } from "commander";
import chalk from "chalk";
import type { ConfigMap } from "@core/events";
import { BaseCommand } from "./base.command";

export class ConfigCommand extends BaseCommand {
  constructor(program: Command) {
    super(program);
  }

  init(): void {
    const cfg = this.addCommand("config", "Read / write configuration");

    const setCmd = cfg.command("set <key> <value>").description("Set a config key (e.g. work-hours, pomodoro, break)");

    setCmd.action(this.action((key: string, value: string) => this.initSet(key, value)));

    const listCmd = cfg.command("list").description("Show all configuration values");

    listCmd.action(this.action(() => this.initList()));

    this.debugRegistered("Config");
  }

  private initSet(key: string, value: string) {
    const k = this.requireArg<string>(key, "Error: config key is required — e.g. trk config set work-hours 8");

    const parsed = isNaN(Number(value)) ? value : Number(value);

    const ok = this.call("config:set", { key: k, value: parsed });

    if (!ok) {
      this.logger.warn("Config update failed.");
      return;
    }

    console.log(chalk.green(`✔  Config updated: ${chalk.bold(k)} = ${chalk.white(String(parsed))}`));
  }

  private initList() {
    const map = this.call("config:list", undefined) as ConfigMap | null;

    if (!map || Object.keys(map).length === 0) {
      console.log(chalk.gray("No configuration values found."));
      return;
    }

    const rows = Object.entries(map).map(([k, v]) => [k, String(v)]);

    this.printTable(["Key", "Value"], rows);
  }
}
