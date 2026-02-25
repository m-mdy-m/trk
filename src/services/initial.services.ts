import { TimerService } from "@services/timer.service";
import { LogService } from "@services/log.service";
import { ReportService } from "@services/report.service";
import { ProjectService } from "@services/project.service";
import { GoalService } from "@services/goal.service";
import { ChecklistService } from "@services/checklist.service";
import { MetricsService } from "@services/metrics.service";
import { ExportService } from "@services/export.service";
import { ConfigService } from "@services/config.service";
export function initialServices() {
  new TimerService().init();
  new LogService().init();
  new ReportService().init();
  new ProjectService().init();
  new GoalService().init();
  new ChecklistService().init();
  new MetricsService().init();
  new ExportService().init();
  new ConfigService().init();
}
