import { firefox } from "playwright";

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

  console.log("Found URLs:", urls);
})();
