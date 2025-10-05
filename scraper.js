import { firefox } from "playwright";
import fs from "fs";
import path from "path";

const pageUrl = "https://m4sport.hu/elo";
const manifestFileName = "index.m3u8";
const playerFrameFileName = "player.php";

(async () => {
  let manifestUrl = null;
  const browser = await firefox.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(pageUrl, { waitUntil: "networkidle" });

  for (const frame of page.frames()) {
    if (frame.url().includes(playerFrameFileName)) {
      const frameHtml = await frame.content();
      if (frameHtml && frameHtml.includes(manifestFileName)) {
        const match = frameHtml.match(/"file":\s*"([^"?]+)/);
        manifestUrl = match ? match[1].replace(/\\\//g, "/") : null;
      }
    }
  }

  await browser.close();

  if (!manifestUrl) {
    console.error("No URL found");
    process.exit(1);
  }

  console.log("Found URL:", manifestUrl);
  const updatedAt = new Date();

  const outputDir = path.resolve("./scraped");
  fs.mkdirSync(outputDir, { recursive: true });
  const outFile = path.join(outputDir, "manifest-url.json");
  fs.writeFileSync(
    outFile,
    JSON.stringify({ manifestUrl, updatedAt }, null, 2),
    { encoding: "utf-8" }
  );
})();
