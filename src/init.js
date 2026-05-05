import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { scrapeManifestUrl } from "./scraper.js";
import { MANIFEST_FILE_PATH, MANIFEST_URL_MAX_AGE_MS } from "./config.js";
import logger from "./logger.js";

const dir = dirname(MANIFEST_FILE_PATH);
if (!existsSync(dir)) {
  mkdirSync(dir, { recursive: true });
}

if (isManifestStale()) {
  const now = new Date().toISOString();
  logger.info("Manifest stale or missing, running scraper");
  scrapeManifestUrl(now)
    .then(() => logger.info("Initial scrape completed"))
    .catch((err) => logger.error(err, "Initial scrape failed"));
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
