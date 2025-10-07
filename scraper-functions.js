import fs from "fs";
import path from "path";

const playerFrameSourceUrl = "player.php";
const manifestUrlPattern = /"file":\s*"([^"?]+)/;
const outputDirectoryPath = "./scraped";
const outputFileName = "manifest-url.json";

export function getPlayerFrame(page) {
  return page
    .frames()
    .find((frame) => frame.url().includes(playerFrameSourceUrl));
}

export async function getManifestUrl(playerFrame) {
  const playerFrameContent = await playerFrame.content();
  const matches = playerFrameContent.match(manifestUrlPattern);
  return matches ? cleanUpEscapedSlashes(matches[1]) : null;
}

export function cleanUpEscapedSlashes(url) {
  return url.replace(/\\\//g, "/");
}

export function writeOutputFile(fileContent) {
  const outputDirectory = path.resolve(outputDirectoryPath);
  fs.mkdirSync(outputDirectory, { recursive: true });
  const outFile = path.join(outputDirectory, outputFileName);
  fs.writeFileSync(outFile, fileContent, { encoding: "utf-8" });
}

export function getOutputFileContent(manifestUrl) {
  const updatedAt = new Date().toISOString();
  return JSON.stringify({ manifestUrl, updatedAt }, null, 2);
}

export async function runScraper() {
  const { firefox } = await import("playwright");
  const pageUrl = "https://m4sport.hu/elo";

  const browser = await firefox.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(pageUrl, { waitUntil: "load" });

  const playerFrame = getPlayerFrame(page);
  if (!playerFrame) {
    console.error("Player frame not found");
    await browser.close();
    process.exit(1);
  }

  const manifestUrl = await getManifestUrl(playerFrame);
  await browser.close();
  if (!manifestUrl) {
    console.error("Manifest URL not found in player frame");
    process.exit(1);
  }

  console.log("Manifest URL found:", manifestUrl);
  const outputFileContent = getOutputFileContent(manifestUrl);
  writeOutputFile(outputFileContent);
  process.exit(0);
}
