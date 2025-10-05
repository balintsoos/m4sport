import { firefox } from "playwright";
import fs from "fs";

const pageUrl = "https://m4sport.hu/elo";
const urlPattern = "/index.m3u8?";

(async () => {
  const urls = [];
  const browser = await firefox.launch({ headless: true });
  const page = await browser.newPage();

  page.on("request", (request) => {
    const url = request.url();
    if (url.includes(urlPattern)) {
      urls.push(url);
    }
  });

  await page.goto(pageUrl, { waitUntil: "networkidle" });
  await browser.close();

  if (urls.length === 0) {
    console.error("No URLs found");
    process.exit(1);
  }

  console.log("Found URLs:", urls);

  const manifestUrl = urls[0].split("?v=")[0];
  const updatedAt = new Date();
  fs.writeFileSync(
    "manifest-url.json",
    JSON.stringify({ manifestUrl, updatedAt }, null, 2)
  );
})();
