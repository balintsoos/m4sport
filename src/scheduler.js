import { existsSync, readFileSync } from "node:fs";
import { scrapeManifestUrl } from "./scraper.js";
import { MANIFEST_FILE_PATH, MANIFEST_URL_MAX_AGE_MS } from "./config.js";
import logger from "./logger.js";

export async function startScheduler() {
  const delay = msUntilNextScrape();
  if (delay === 0) {
    logger.info("Manifest stale or missing, running initial scrape");
    await runScrape();
  } else {
    logger.info({ delayMs: delay }, "Manifest is fresh, next scrape scheduled");
    setTimeout(runScrape, delay);
  }
  setInterval(runScrape, MANIFEST_URL_MAX_AGE_MS);
}

async function runScrape() {
  logger.info("Scrape started");
  try {
    await scrapeManifestUrl(new Date().toISOString());
    logger.info("Scrape completed");
  } catch (err) {
    logger.error(err, "Scrape failed");
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
