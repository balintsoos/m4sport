import fs from "node:fs";
import { scrapeManifestUrl } from "./scraper.js";
import { MANIFEST_PATH, MANIFEST_MAX_AGE_MS } from "./config.js";
import logger from "./logger.js";

function isManifestStale() {
  if (!fs.existsSync(MANIFEST_PATH)) return true;

  try {
    const content = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
    const updatedAt = new Date(content.updatedAt);
    return Date.now() - updatedAt.getTime() > MANIFEST_MAX_AGE_MS;
  } catch {
    return true;
  }
}

if (isManifestStale()) {
  const now = new Date().toISOString();
  logger.info("Manifest stale or missing, running scraper");
  scrapeManifestUrl(now)
    .then(() => logger.info("Initial scrape completed"))
    .catch((err) => logger.error(err, "Initial scrape failed"));
}
