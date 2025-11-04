import { scrapeManifestUrl, log } from "./scraper.js";

log("Scrape started");

scrapeManifestUrl()
  .then(() => {
    log("Scrape completed");
    process.exit(0);
  })
  .catch((error) => {
    log("Scrape failed:", error);
    process.exit(1);
  });
