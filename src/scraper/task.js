import { scrapeManifestUrl } from "./scraper.js";

export function task(context) {
  console.log(`${context.dateLocalIso} | Scrape started`);

  scrapeManifestUrl()
    .then(() => {
      console.log(`${context.dateLocalIso} | Scrape completed`);
      process.exit(0);
    })
    .catch((error) => {
      console.log(`${context.dateLocalIso} | Scrape failed:`, error);
      process.exit(1);
    });
}
