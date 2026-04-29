import { scrapeManifestUrl } from "./scraper.js";
import logger from "./logger.js";

export function task(context) {
  logger.info("Scheduled scrape started");

  scrapeManifestUrl(context.dateLocalIso)
    .then(() => {
      logger.info("Scheduled scrape completed");
      process.exit(0);
    })
    .catch((error) => {
      logger.error(error, "Scheduled scrape failed");
      process.exit(1);
    });
}
