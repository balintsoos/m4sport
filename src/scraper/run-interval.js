import { scrapeManifestUrl, log } from "./scraper.js";

const HOURLY = 1000 * 60 * 60;

log("Initial scrape started");

scrapeManifestUrl()
  .then(() => {
    log("Initial scrape completed");
  })
  .catch((error) => {
    log("Initial scrape failed:", error);
  });

setInterval(async () => {
  try {
    log("Scheduled scrape started");
    await scrapeManifestUrl();
    log("Scheduled scrape completed");
  } catch (error) {
    log("Scheduled scrape failed:", error);
  }
}, HOURLY);
