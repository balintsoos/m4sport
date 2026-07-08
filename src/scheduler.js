import { MANIFEST_URL_MAX_AGE_MS } from "./config.js";
import { scrapeManifestUrl } from "./scraper.js";
import { getManifestAge } from "./manifest.js";
import { info, error } from "./logger.js";

export async function startScheduler() {
  const delay = msUntilNextScrape();
  setTimeout(async () => {
    await runScrape();
    setInterval(runScrape, MANIFEST_URL_MAX_AGE_MS);
  }, delay);
  info(`Next scrape scheduled in ${delay} ms`);
}

async function runScrape() {
  info("Scrape started");
  try {
    await scrapeManifestUrl();
    info("Scrape completed");
  } catch (err) {
    error(`Scrape failed: ${err.message}`);
  }
}

function msUntilNextScrape() {
  const age = getManifestAge();
  if (age === null) return 0;
  return Math.max(0, MANIFEST_URL_MAX_AGE_MS - age);
}
