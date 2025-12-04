import cron from "node-cron";

const CRON_SCHEDULE = process.env.CRON_SCHEDULE || "0 0 * * *"; // https://cron.help/every-24-hours
const TZ = process.env.TZ || "UTC";

cron.schedule(CRON_SCHEDULE, "./task.js", {
  timezone: TZ,
  noOverlap: true,
});
