import { Command } from "commander";
import chalk from "chalk";
import type { ChecklistItem } from "@core/events";
import { BaseCommand } from "./base.command";

export class ChecklistCommand extends BaseCommand {
  constructor(program: Command) {
    super(program);
  }

  init(): void {
    const checklistCmd = this.addCommand(
      "checklist",
      "Daily / weekly / monthly checklists"
    );

    checklistCmd
      .command("daily")
      .description("Today's checklist")
      .action(this.action(() => this.initDaily()));

    checklistCmd
      .command("weekly")
      .description("This week's checklist")
      .action(this.action(() => this.initWeekly()));

    checklistCmd
      .command("monthly")
      .description("This month's checklist")
      .action(this.action(() => this.initMonthly()));

    checklistCmd
      .command("custom <name>")
      .description("Show / create a named custom checklist")
      .action(this.action((name: string) => this.initCustom(name)));

    this.debugRegistered("Checklist");
  }

  private initDaily() {
    const items = this.call("checklist:daily", undefined)

    if (!items || items.length === 0) {
      console.log(chalk.gray("\n  No daily checklist items found.\n"));
      return;
    }

    console.log(chalk.bold.cyan("\n  Daily Checklist\n"));
    this.printList(items);
  }

  private initWeekly() {
    const items = this.call("checklist:weekly", undefined)

    if (!items || items.length === 0) {
      console.log(chalk.gray("\n  No weekly checklist items found.\n"));
      return;
    }

    console.log(chalk.bold.cyan("\n  Weekly Checklist\n"));
    this.printList(items);
  }

  private initMonthly() {
    const items = this.call("checklist:monthly", undefined)

    if (!items || items.length === 0) {
      console.log(chalk.gray("\n  No monthly checklist items found.\n"));
      return;
    }

    console.log(chalk.bold.cyan("\n  Monthly Checklist\n"));
    this.printList(items);
  }

  private initCustom(name: string) {
    const n = this.requireArg<string>(name, "Error: checklist name is required.");

    const items = this.call("checklist:custom", { name: n })

    if (!items || items.length === 0) {
      console.log(chalk.gray(`\n  No items found for checklist "${n}".\n`));
      return;
    }

    console.log(chalk.bold.cyan(`\n  Checklist: ${n}\n`));
    this.printList(items);
  }

  // ------------------------
  // Helpers
  // ------------------------

  private printList(items: ChecklistItem[]) {
    for (const item of items) {
      const mark = item.done ? chalk.green("✔") : chalk.gray("○");
      const text = item.done ? chalk.gray(item.text) : item.text;
      const id = chalk.gray(`[${item.id.slice(0, 6)}]`);

      console.log(`  ${mark}  ${text}  ${id}`);
    }
  }
}