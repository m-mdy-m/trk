import type { Project, ProjectProgress } from "@core/events";
import { uid, now } from "@utils/date";
import { BaseService } from "./base.service";

export class ProjectService extends BaseService {
  init(): void {
    this.on("project:add", (p) => this.add(p));
    this.on("project:list", () => this.list());
    this.on("project:progress", (p) => this.progress(p));
    this.logger.debug("ProjectService registered");
  }

  private add(payload: { name: string; goalHours?: number; priority?: string }): Project {
    const project: Project = {
      id: uid(),
      name: payload.name,
      goalHours: payload.goalHours ?? null,
      priority: (payload.priority as Project["priority"]) ?? null,
      createdAt: now(),
    };

    this.execute(
      `
      INSERT INTO projects (id, name, goal_hours, priority, created_at)
      VALUES (@id, @name, @goalHours, @priority, @createdAt)
    `,
      project,
    );

    this.logger.info(`Project added: ${project.name}`);
    return project;
  }

  private list(): Project[] {
    return this.query(`
        SELECT id, name, goal_hours as goalHours, priority, created_at as createdAt
        FROM projects ORDER BY created_at DESC
      `);
  }

  private progress(payload: { name: string }): ProjectProgress {
    const project = this.get(
      `
        SELECT id, name, goal_hours as goalHours, priority, created_at as createdAt
        FROM projects WHERE name = ? COLLATE NOCASE
      `,
      [payload.name],
    ) as Project | null;

    if (!project) throw new Error(`Project not found: "${payload.name}"`);

    const row = this.get(`SELECT COALESCE(SUM(duration), 0) AS total FROM log_entries WHERE project_id = ?`, [project.id]) as { total: number };

    const loggedSeconds = row.total;
    const goalSeconds = project.goalHours ? project.goalHours * 3600 : null;
    const percentComplete = goalSeconds && goalSeconds > 0 ? Math.round((loggedSeconds / goalSeconds) * 100) : null;

    return { project, loggedSeconds, percentComplete: percentComplete ?? 0 };
  }
}
