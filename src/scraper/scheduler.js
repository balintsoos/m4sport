import cron from "node-cron";

const CRON_SCHEDULE = "0 0 * * *"; // https://cron.help/every-24-hours

cron.schedule(CRON_SCHEDULE, "./task.js", {
  timezone: "Europe/Budapest",
  noOverlap: true,
});
