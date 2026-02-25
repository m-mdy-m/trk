import { CONFIG_PATH, DEFAULT_CONFIG_PATH, TRK_DIR } from "@common/constant";
import fs from "fs";
import yaml from "js-yaml";

export type AppConfig = {
  work: {
    daily_hours: number;
    pomodoro_minutes: number;
    break_minutes: number;
    timezone: string;
  };
  display: {
    date_format: string;
    time_format: string;
    week_starts_on: "monday" | "sunday";
  };
};

let _cache: AppConfig | null = null;

export function loadConfig(): AppConfig {
  if (_cache) return _cache;

  const defaults = yaml.load(fs.readFileSync(DEFAULT_CONFIG_PATH, "utf8")) as {
    work: AppConfig["work"];
    display: AppConfig["display"];
  };

  let user: Partial<AppConfig> = {};
  if (fs.existsSync(CONFIG_PATH)) {
    user = (yaml.load(fs.readFileSync(CONFIG_PATH, "utf8")) as Partial<AppConfig>) ?? {};
  }

  _cache = {
    work: { ...defaults.work, ...(user.work ?? {}) },
    display: { ...defaults.display, ...(user.display ?? {}) },
  };

  return _cache;
}

export function getConfigValue(key: string): string | number | boolean | undefined {
  const cfg = loadConfig() as unknown as Record<string, Record<string, unknown>>;
  const [section, field] = key.split(".");
  if (section && field) return cfg[section]?.[field] as string | number | boolean | undefined;
  return undefined;
}

export function setConfigValue(key: string, value: string | number): void {
  if (!fs.existsSync(TRK_DIR)) fs.mkdirSync(TRK_DIR, { recursive: true });

  let current: Record<string, unknown> = {};
  if (fs.existsSync(CONFIG_PATH)) {
    current = (yaml.load(fs.readFileSync(CONFIG_PATH, "utf8")) as Record<string, unknown>) ?? {};
  }

  const [section, field] = key.split(".");
  if (section && field) {
    if (!current[section]) current[section] = {};
    (current[section] as Record<string, unknown>)[field] = value;
  }

  fs.writeFileSync(CONFIG_PATH, yaml.dump(current), "utf8");
  _cache = null; // invalidate cache
}
