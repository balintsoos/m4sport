import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { scrapeManifestUrl } from "./scraper.js";
import { MANIFEST_FILE_PATH, MANIFEST_URL_MAX_AGE_MS } from "./config.js";
import logger from "./logger.js";

export async function runInitialScrape() {
  createManifestFilePath();
  if (!isManifestStale()) {
    logger.info("Manifest is fresh, skipping initial scrape");
    return;
  }
  logger.info("Manifest stale or missing, running initial scraper");
  const now = new Date().toISOString();
  try {
    await scrapeManifestUrl(now);
    logger.info("Initial scrape completed");
  } catch (err) {
    logger.error(err, "Initial scrape failed");
  }
}

function createManifestFilePath() {
  const dir = dirname(MANIFEST_FILE_PATH);
  if (existsSync(dir)) {
    return;
  }
  mkdirSync(dir, { recursive: true });
}

function isManifestStale() {
  if (!existsSync(MANIFEST_FILE_PATH)) return true;

  try {
    const content = JSON.parse(readFileSync(MANIFEST_FILE_PATH, "utf-8"));
    const updatedAt = new Date(content.updatedAt);
    return Date.now() - updatedAt.getTime() > MANIFEST_URL_MAX_AGE_MS;
  } catch {
    return true;
  }
}
