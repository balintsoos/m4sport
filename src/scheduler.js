import { existsSync, readFileSync } from "node:fs";
import { scrapeManifestUrl } from "./scraper.js";
import { MANIFEST_FILE_PATH, MANIFEST_URL_MAX_AGE_MS } from "./config.js";
import logger from "./logger.js";

export function schedulePeriodicScrape() {
  const delay = msUntilNextScrape();
  logger.info({ delayMs: delay }, "Next scrape scheduled");
  setTimeout(runAndRepeat, delay);
}

async function runAndRepeat() {
  await runScrape();
  setInterval(runScrape, MANIFEST_URL_MAX_AGE_MS);
}

async function runScrape() {
  logger.info("Scheduled scrape started");
  try {
    await scrapeManifestUrl(new Date().toISOString());
    logger.info("Scheduled scrape completed");
  } catch (err) {
    logger.error(err, "Scheduled scrape failed");
  }
}

function msUntilNextScrape() {
  if (!existsSync(MANIFEST_FILE_PATH)) return 0;
  try {
    const { updatedAt } = JSON.parse(readFileSync(MANIFEST_FILE_PATH, "utf-8"));
    const elapsed = Date.now() - new Date(updatedAt).getTime();
    return Math.max(0, MANIFEST_URL_MAX_AGE_MS - elapsed);
  } catch {
    return 0;
  }
}
