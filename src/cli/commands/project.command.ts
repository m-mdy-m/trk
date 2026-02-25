import { Command } from "commander";
import chalk from "chalk";
import { formatDuration, secondsToHours } from "@utils/date";
import type { Project, ProjectProgress } from "@core/events/events";
import { BaseCommand } from "./base.command";

export class ProjectCommand extends BaseCommand {
  constructor(program: Command) {
    super(program);
  }

  init(): void {
    const addCmd = this.addCommand("add <name>", "Add a new project");
    addCmd
      .option("--goal <hours>", "Target hours for the project")
      .option("--priority <level>", "Priority: low | medium | high")
      .action(this.action((name: string, opts: any) => this.initAdd(name, opts)));

    const listCmd = this.addCommand("list", "List all projects");
    listCmd.action(this.action(() => this.initList()));

    const progressCmd = this.addCommand("progress <name>", "Show progress for a project");
    progressCmd.action(this.action((name: string) => this.initProgress(name)));

    this.debugRegistered("Project");
  }

  private initAdd(name: string, opts: { goal?: string; priority?: string }) {
    const projectName = this.requireArg<string>(name, 'Error: project name is required — e.g. trk project add "ProjectX"');

    const project = this.call("project:add", {
      name: projectName,
      goalHours: opts.goal ? parseFloat(opts.goal) : undefined,
      priority: opts.priority,
    }) as Project | null;

    if (!project) {
      this.logger.warn("Project creation failed.");
      return;
    }

    console.log(chalk.green(`✔  Project "${project.name}" created`));
    if (project.goalHours) console.log(`   Goal: ${project.goalHours}h`);
    if (project.priority) console.log(`   Priority: ${project.priority}`);
  }

  private initList() {
    const projects = this.call("project:list", undefined);

    if (!projects || projects.length === 0) {
      console.log(chalk.gray("No projects yet. Use: trk project add <name>"));
      return;
    }

    const rows = projects.map((p) => [p.name, p.goalHours ?? "—", p.priority ?? "—", p.createdAt.slice(0, 10)]);

    this.printTable(["Name", "Goal (h)", "Priority", "Created"], rows);
  }

  private initProgress(name: string) {
    const projectName = this.requireArg<string>(name, "Error: project name is required — e.g. trk project progress ProjectX");

    const result = this.call("project:progress", { name: projectName });

    if (!result) {
      this.exitWithError(`Project "${projectName}" not found.`);
    }

    const { project, loggedSeconds, percentComplete } = result;
    const p = project;

    console.log(chalk.bold.cyan(`\n  ${p.name}\n`));
    console.log(`  Logged : ${chalk.white(formatDuration(loggedSeconds))} (${secondsToHours(loggedSeconds)}h)`);

    if (p.goalHours) {
      const bar = this.progressBar(percentComplete!);
      console.log(`  Goal   : ${p.goalHours}h`);
      console.log(`  ${bar} ${percentComplete}%`);
    }
  }
}
