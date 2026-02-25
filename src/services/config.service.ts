import { loadConfig, setConfigValue } from "@core/config";
import type { ConfigMap } from "@core/events";
import { KEY_ALIASES } from "@common/constant";
import { BaseService } from "./base.service";

export class ConfigService extends BaseService {
  init(): void {
    this.on("config:set", (p) => this.set(p));
    this.on("config:list", () => this.list());
    this.logger.debug("ConfigService registered");
  }

  private set(payload: { key: string; value: string | number }): void {
    const resolved = KEY_ALIASES[payload.key] ?? payload.key;
    setConfigValue(resolved, payload.value);
  }

  private list(): ConfigMap {
    const cfg = loadConfig();
    return {
      "work.daily_hours": cfg.work.daily_hours,
      "work.pomodoro_minutes": cfg.work.pomodoro_minutes,
      "work.break_minutes": cfg.work.break_minutes,
      "work.timezone": cfg.work.timezone,
      "display.date_format": cfg.display.date_format,
      "display.time_format": cfg.display.time_format,
      "display.week_starts_on": cfg.display.week_starts_on,
    };
  }
}
