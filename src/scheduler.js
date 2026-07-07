import { existsSync, readFileSync } from "node:fs";
import { scrapeManifestUrl } from "./scraper.js";
import { MANIFEST_FILE_PATH, MANIFEST_URL_MAX_AGE_MS } from "./config.js";
import { info, error } from "./logger.js";

export async function startScheduler() {
  const delay = msUntilNextScrape();
  if (delay === 0) {
    info("Manifest is stale or missing, running initial scrape");
    await runScrape();
  } else {
    info(`Manifest is fresh, next scrape scheduled in ${delay} ms`);
    setTimeout(runScrape, delay);
  }
  setInterval(runScrape, MANIFEST_URL_MAX_AGE_MS);
}

async function runScrape() {
  info("Scrape started");
  try {
    await scrapeManifestUrl(new Date().toISOString());
    info("Scrape completed");
  } catch (err) {
    error(`Scrape failed: ${err.message}`);
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
