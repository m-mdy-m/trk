import path from "path";
import os from "os";
export const TRK_DIR = path.join(os.homedir(), ".trk");
export const LOG_FILE = path.join(TRK_DIR, "trk.log");
export const DB_PATH = path.join(TRK_DIR, "trk.db");
export const BUILT_IN_CHECK_LIST: Record<string, string[]> = {
  daily: ["Review today's schedule", "Log planned work sessions", "Check goal progress", "Reflect on yesterday"],
  weekly: ["Set weekly goals", "Review last week's logs", "Plan project milestones", "Update checklist templates"],
  monthly: ["Review monthly metrics", "Evaluate goal completion", "Archive old logs", "Set next month goals"],
};

export const KEY_ALIASES: Record<string, string> = {
  "work-hours": "work.daily_hours",
  pomodoro: "work.pomodoro_minutes",
  break: "work.break_minutes",
  timezone: "work.timezone",
  "date-format": "display.date_format",
  "week-starts": "display.week_starts_on",
};
