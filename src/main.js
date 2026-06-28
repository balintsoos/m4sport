import { startScheduler } from "./scheduler.js";
import { startServer } from "./server.js";

(async () => {
  await startScheduler();
  startServer();
})();
