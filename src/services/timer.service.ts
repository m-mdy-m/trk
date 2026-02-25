import type { TimerBlock, TimerStatus } from "@core/events";
import { uid, now, today } from "@utils/date";
import { BaseService } from "./base.service";

export class TimerService extends BaseService {
  init(): void {
    this.on("timer:start", (payload) => this.start(payload));
    this.on("timer:stop", () => this.stop());
    this.on("timer:pause", () => this.pause());
    this.on("timer:resume", () => this.resume());
    this.on("timer:cancel", () => this.cancel());
    this.on("timer:status", () => this.status());
    this.logger.debug("TimerService registered");
  }

  private start(payload: { label: string; project?: string }): TimerBlock {
    const running = this.activeBlock();
    if (running) {
      this.stopBlock(running);
    }

    const block: TimerBlock = {
      id: uid(),
      label: payload.label,
      projectId: this.resolveProjectId(payload.project),
      startedAt: now(),
      status: "running",
    };

    this.execute(
      `
      INSERT INTO timer_blocks (id, label, project_id, started_at, status)
      VALUES (@id, @label, @projectId, @startedAt, @status)
    `,
      block,
    );

    this.logger.info(`Timer started: ${block.label}`);
    return block;
  }

  private stop(): TimerBlock | null {
    const block = this.activeBlock();
    if (!block) {
      this.logger.warn("stop called but no active timer");
      return null;
    }
    const stopped = this.stopBlock(block);
    this.persistToLog(stopped);
    return stopped;
  }

  private pause(): TimerBlock | null {
    const block = this.activeBlock();
    if (!block || block.status !== "running") return null;

    const elapsed = this.elapsedSeconds(block);
    this.execute(
      `
      UPDATE timer_blocks
      SET status = 'paused', duration = @elapsed
      WHERE id = @id
    `,
      { id: block.id, elapsed },
    );

    return { ...block, status: "paused", duration: elapsed };
  }

  private resume(): TimerBlock | null {
    const block = this.activeBlock();
    if (!block || block.status !== "paused") return null;

    // restart clock — update startedAt to now, keep accumulated duration
    this.execute(
      `
      UPDATE timer_blocks
      SET status = 'running', started_at = @startedAt
      WHERE id = @id
    `,
      { id: block.id, startedAt: now() },
    );

    return { ...block, status: "running", startedAt: now() };
  }

  private cancel(): boolean {
    const block = this.activeBlock();
    if (!block) return false;

    this.execute(
      `
      UPDATE timer_blocks SET status = 'cancelled' WHERE id = @id
    `,
      { id: block.id },
    );

    this.logger.info(`Timer cancelled: ${block.label}`);
    return true;
  }

  private status(): TimerStatus {
    const block = this.activeBlock();
    if (!block) return { active: false };

    return {
      active: true,
      block,
      elapsed: this.elapsedSeconds(block),
    };
  }

  // ── helpers ────────────────────────────────────────────────────────────────

  private activeBlock(): TimerBlock | null {
    const row = this.db
      .prepare(
        `
        SELECT id, label, project_id as projectId, started_at as startedAt,
               stopped_at as stoppedAt, duration, note, status
        FROM timer_blocks
        WHERE status IN ('running','paused')
        ORDER BY started_at DESC LIMIT 1
      `,
      )
      .get() as TimerBlock | undefined;

    return row ?? null;
  }

  private stopBlock(block: TimerBlock): TimerBlock {
    const stoppedAt = now();
    const duration = this.elapsedSeconds(block) + (block.duration ?? 0);

    this.execute(
      `
      UPDATE timer_blocks
      SET status = 'stopped', stopped_at = @stoppedAt, duration = @duration
      WHERE id = @id
    `,
      { id: block.id, stoppedAt, duration },
    );

    return { ...block, status: "stopped", stoppedAt, duration };
  }

  private persistToLog(block: TimerBlock): void {
    if (!block.duration || block.duration < 60) return;

    this.execute(
      `INSERT INTO log_entries (id, label, project_id, date, duration, note, source, created_at)
      VALUES (@id, @label, @projectId, @date, @duration, @note, @source, @createdAt)`,
      {
        id: uid(),
        label: block.label,
        projectId: block.projectId,
        date: today(),
        duration: block.duration,
        note: block.note ?? null,
        source: "timer",
        createdAt: now(),
      }
    );
  }

  private elapsedSeconds(block: TimerBlock): number {
    if (block.status === "paused") return block.duration ?? 0;
    const start = new Date(block.startedAt).getTime();
    return Math.floor((Date.now() - start) / 1000) + (block.duration ?? 0);
  }

  private resolveProjectId(name?: string): string | null {
    if (!name) return null;
    const row = this.db.prepare("SELECT id FROM projects WHERE name = ? COLLATE NOCASE").get(name) as { id: string } | undefined;
    return row?.id ?? null;
  }
}
