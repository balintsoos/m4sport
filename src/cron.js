import cron from "node-cron";
import { CRON_SCHEDULE, TZ } from "./config.js";

cron.schedule(CRON_SCHEDULE, "./task.js", {
  timezone: TZ,
  noOverlap: true,
});
