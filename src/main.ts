#!/usr/bin/env node
import { initDb, closeDb } from "@core/database";
import { logger } from "@utils/logger";
import { bus } from "@core/events";
import { buildCli } from "@cli";
import { initialServices } from "@services/initial.services";

async function bootstrap(): Promise<void> {
  initDb();
  bus.emit("db:ready", undefined);
  initialServices();
  logger.info("TRK bootstrap complete");
  const { version } = require("../package.json");
  const program = buildCli(version);
  if (process.argv.length < 3) {
    program.outputHelp();
    process.exit(0);
  }

  await program.parseAsync(process.argv);
  bus.emit("app:shutdown", undefined);
  closeDb();
}

bootstrap().catch((err) => {
  console.error("Fatal:", (err as Error).message);
  logger.error("Fatal error", { error: err });
  closeDb();
  process.exit(1);
});
