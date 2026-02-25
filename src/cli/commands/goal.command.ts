import { Command } from "commander";
import chalk from "chalk";
import { formatDuration } from "@utils/date";
import type { Goal, GoalProgress } from "@core/events";
import { BaseCommand } from "./base.command";

export class GoalCommand extends BaseCommand {
  constructor(program: Command) {
    super(program);
  }

  init(): void {
    const goal = this.addCommand("goal", "Manage goals");

    goal
      .command("set <period> <label>")
      .description("Set a goal (period: weekly | monthly)")
      .option("--hours <n>", "Target hours", parseFloat)
      .option("--deadline <YYYY-MM-DD>", "Optional deadline")
      .action(
        this.action((period: string, label: string, opts: any) =>
          this.initSet(period, label, opts)
        )
      );

    goal
      .command("list")
      .description("List all goals")
      .action(this.action(() => this.initList()));

    goal
      .command("progress")
      .description("Show progress toward each goal")
      .action(this.action(() => this.initProgress()));

    this.debugRegistered("Goal");
  }

  private initSet(period: string, label: string, opts: any) {
    if (!["weekly", "monthly"].includes(period)) {
      this.exitWithError('Period must be "weekly" or "monthly"');
    }

    const hours = this.requireArg<number>(
      opts.hours,
      "--hours is required (e.g. --hours 20)"
    );

    const event =
      period === "weekly" ? "goal:set:weekly" : "goal:set:monthly";

    const g = this.call(event, {
      label,
      hours,
      deadline: opts.deadline,
    });

    if (!g) {
      this.logger.warn("Goal creation failed.");
      return;
    }

    console.log(
      chalk.green(
        `✔  Goal set: "${g.label}" — ${g.targetHours}h (${g.period})`
      )
    );
  }

  private initList() {
    const goals = this.call("goal:list", undefined) 

    if (!goals || goals.length === 0) {
      console.log(chalk.gray("No goals set yet."));
      return;
    }

    const rows = goals.map((g) => [
      g.label,
      g.period,
      g.targetHours,
      g.deadline ?? "—",
    ]);

    this.printTable(
      ["Label", "Period", "Target (h)", "Deadline"],
      rows
    );
  }
  private initProgress() {
    const items = this.call("goal:progress", undefined) as
      | GoalProgress[]
      | null;

    if (!items || items.length === 0) {
      console.log(chalk.gray("No goals to track."));
      return;
    }

    for (const { goal: g, loggedSeconds, percentComplete } of items) {
      const bar = this.progressBar(percentComplete);

      console.log(`\n  ${chalk.bold(g.label)} [${g.period}]`);
      console.log(`  ${bar} ${percentComplete}%`);
      console.log(
        `  Logged ${formatDuration(loggedSeconds)} of ${g.targetHours}h target`
      );
    }
  }
}
