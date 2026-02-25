import type { Goal, GoalProgress } from "@core/events";
import { uid, now, weekRange, monthRange, today } from "@utils/date";
import { BaseService } from "./base.service";

export class GoalService extends BaseService {
  init(): void {
    this.on("goal:set:weekly", (p) => this.setWeekly(p));
    this.on("goal:set:monthly", (p) => this.setMonthly(p));
    this.on("goal:list", () => this.list());
    this.on("goal:progress", () => this.progress());
    this.logger.debug("GoalService registered");
  }

  private setWeekly(payload: { label: string; hours: number; deadline?: string }): Goal {
    return this.setGoal({ ...payload, period: "weekly" });
  }

  private setMonthly(payload: { label: string; hours: number; deadline?: string }): Goal {
    return this.setGoal({ ...payload, period: "monthly" });
  }

  private setGoal(payload: { label: string; hours: number; period: "weekly" | "monthly"; deadline?: string }): Goal {
    const goal: Goal = {
      id: uid(),
      label: payload.label,
      period: payload.period,
      targetHours: payload.hours,
      deadline: payload.deadline ?? null,
      createdAt: now(),
    };

    this.execute(
      `
        INSERT INTO goals (id, label, period, target_hours, deadline, created_at)
        VALUES (@id, @label, @period, @targetHours, @deadline, @createdAt)
      `,
      goal,
    );

    this.logger.info(`Goal set: ${goal.label} (${goal.period}, ${goal.targetHours}h)`);
    return goal;
  }

  private list(): Goal[] {
    return this.query<Goal>(`
        SELECT id, label, period, target_hours as targetHours, deadline, created_at as createdAt
        FROM goals ORDER BY created_at DESC
      `);
  }

  private progress(): GoalProgress[] {
    const goals = this.list();
    return goals.map((goal) => {
      const range = goal.period === "weekly" ? weekRange(today()) : monthRange(today());

      const row = this.get<GoalProgress>(
        `
          SELECT COALESCE(SUM(duration), 0) AS total
          FROM log_entries
          WHERE date BETWEEN ? AND ?
        `,
        [range.from, range.to],
      ) as { total: number } | null;

      const loggedSeconds = row!.total;
      const targetSeconds = goal.targetHours * 3600;
      const percentComplete = Math.min(100, Math.round((loggedSeconds / targetSeconds) * 100));

      return { goal, loggedSeconds, percentComplete };
    });
  }
}
