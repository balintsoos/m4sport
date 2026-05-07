import { runInitialScrape } from "./init.js";
import { startServer } from "./server.js";
import { schedulePeriodicScrape } from "./cron.js";

(async () => {
  await runInitialScrape();
  startServer();
  schedulePeriodicScrape();
})();
