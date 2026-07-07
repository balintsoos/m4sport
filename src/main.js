import { startScheduler } from "./scheduler.js";
import { startServer } from "./server.js";

await startScheduler();
startServer();
