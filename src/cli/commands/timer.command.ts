import { Command } from "commander";
import chalk from "chalk";
import { formatDuration } from "@utils/date";
import type { TimerBlock, TimerStatus } from "@core/events";
import { BaseCommand } from "./base.command";

export class TimerCommand extends BaseCommand {
  constructor(program: Command) {
    super(program);
  }

  init(): void {
    const startCmd = this.addCommand("start [label]", "Start a new timer block");
    startCmd.action(this.action((label: string | undefined, opts: any) => this.initStart(label, opts)));

    const stopCmd = this.addCommand("stop", "Stop the current timer and save the block");
    stopCmd.action(this.action(() => this.initStop()));

    const pauseCmd = this.addCommand("pause", "Pause the current timer");
    pauseCmd.action(this.action(() => this.initPause()));

    const resumeCmd = this.addCommand("resume", "Resume a paused timer");
    resumeCmd.action(this.action(() => this.initResume()));

    const cancelCmd = this.addCommand("cancel", "Cancel the current timer without saving");
    cancelCmd.action(this.action(() => this.initCancel()));

    const statusCmd = this.addCommand("status", "Show the current timer status");
    statusCmd.action(this.action(() => this.initStatus()));

    this.debugRegistered("Timer");
  }

  private initStart(label: string | undefined, opts: { project?: string } = {}) {
    const l = this.requireArg<string>(label, 'Error: label is required — e.g. trk start "ProjectX - Feature X"');

    const block = this.call("timer:start", { label: l, project: opts.project });
    if (!block) {
      this.logger.warn("Timer start failed or returned no block.");
      return;
    }

    console.log(chalk.green(`▶  Timer started`));
    console.log(`   ${chalk.bold(block.label)}`);
    if (block.projectId) console.log(`   Project: ${opts.project}`);
    console.log(`   Started at ${new Date(block.startedAt).toLocaleTimeString()}`);
  }

  private initStop() {
    const block = this.call("timer:stop", undefined) ;
    if (!block) {
      console.log(chalk.yellow("No active timer to stop."));
      return;
    }
    console.log(chalk.cyan(`■  Timer stopped`));
    console.log(`   ${chalk.bold(block.label)}`);
    console.log(`   Duration: ${chalk.white(formatDuration(block.duration ?? 0))}`);
  }

  private initPause() {
    const block = this.call("timer:pause", undefined) ;
    if (!block) {
      console.log(chalk.yellow("No running timer to pause."));
      return;
    }
    console.log(chalk.yellow(`⏸  Timer paused — ${chalk.bold(block.label)}`));
    console.log(`   Elapsed so far: ${formatDuration(block.duration ?? 0)}`);
  }

  private initResume() {
    const block = this.call("timer:resume", undefined) ;
    if (!block) {
      console.log(chalk.yellow("Nothing to resume. No paused timer found."));
      return;
    }
    console.log(chalk.green(`▶  Timer resumed — ${chalk.bold(block.label)}`));
  }

  private initCancel() {
    const ok = this.call("timer:cancel", undefined) ;
    if (!ok) {
      console.log(chalk.yellow("No active timer to cancel."));
      return;
    }
    console.log(chalk.red(`✖  Timer cancelled`));
  }

  private initStatus() {
    const s = this.call("timer:status", undefined);
    if (!s || !s.active || !s.block) {
      console.log(chalk.gray("No active timer."));
      return;
    }
    const { block, elapsed } = s;
    console.log(chalk.green("● Running"));
    console.log(`  Label  : ${chalk.bold(block.label)}`);
    console.log(`  Since  : ${new Date(block.startedAt).toLocaleTimeString()}`);
    console.log(`  Elapsed: ${chalk.cyan(formatDuration(elapsed ?? 0))}`);
    console.log(`  Status : ${block.status}`);
  }
}
