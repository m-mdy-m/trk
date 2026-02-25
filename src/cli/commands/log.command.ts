import { Command } from 'commander';
import chalk from 'chalk';
import { formatDuration } from '@utils/date';
import type { LogEntry } from '@core/events/events';
import { BaseCommand } from './base.command';

export class LogCommand extends BaseCommand {
  constructor(program: Command) {
    super(program);
  }

  init(): void {
    // top-level `trk log` command
    const logCmd = this.addCommand('log', "Show today's time log");
    logCmd.option('-d, --date <YYYY-MM-DD>', 'Show log for a specific date');
    logCmd.action(
      this.action((opts: { date?: string }) => this.initList(opts))
    );

    // `trk log add <label> <hours> [note]`
    const addCmd = logCmd
      .command('add <label> <hours> [note]')
      .description('Manually add a time log entry');
    addCmd.option('-d, --date <YYYY-MM-DD>', 'Override date (defaults to today)');
    addCmd.action(
      this.action((label: string, hoursStr: string, note: string | undefined, opts: { date?: string }) =>
        this.initAdd(label, hoursStr, note, opts)
      )
    );

    this.debugRegistered('Log');
  }

  private initList(opts: { date?: string } = {}) {
    const entries = (this.call('log:list', { date: opts.date }) as LogEntry[] | null) ?? [];

    if (entries.length === 0) {
      console.log(chalk.gray('No entries for this date.'));
      return;
    }

    const rows = entries.map((e) => [
      e.label,
      formatDuration(e.duration),
      e.note ?? '',
      e.source,
    ]);

    this.printTable(['Label', 'Duration', 'Note', 'Source'], rows);

    const total = entries.reduce((acc, e) => acc + (e.duration ?? 0), 0);
    console.log(chalk.bold(`Total: ${formatDuration(total)}`));
  }

  private initAdd(label: string, hoursStr: string, note: string | undefined, opts: { date?: string } = {}) {
    const l = this.requireArg<string>(label, 'Error: label is required — e.g. trk log add "ProjectX - Feature X" 2.5');
    const hours = parseFloat(hoursStr);
    if (isNaN(hours) || hours <= 0) {
      this.exitWithError('Error: hours must be a positive number (e.g. 2.5)');
    }

    const entry = this.call('log:add', { label: l, hours, note, date: opts.date }) as LogEntry | null;
    if (!entry) {
      this.logger.warn('log:add returned no entry.');
      console.log(chalk.yellow('Failed to add log entry.'));
      return;
    }

    console.log(chalk.green(`✔  Logged ${hours}h for "${entry.label}"`));
  }
}