import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const PAGE_URL = "https://m4sport.hu/elo";
const PLAYER_FRAME_URL = "player.php";
const MANIFEST_URL_PATTERN = /"file":\s*"([^"?]+)/;
const OUTPUT_DIR_PATH = "./scraped";
const OUTPUT_FILE_NAME = "manifest-url.json";

export async function scrapeManifestUrl() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(PAGE_URL, { waitUntil: "networkidle", timeout: 20000 });

  const playerFrame = getPlayerFrame(page);
  if (!playerFrame) {
    log("Player frame not found");
    await browser.close();
    return;
  }

  const manifestUrl = await getManifestUrl(playerFrame);
  await browser.close();
  if (!manifestUrl) {
    log("Manifest URL not found");
    return;
  }

  log("Manifest URL found");
  const outputFileContent = getOutputFileContent(manifestUrl);
  writeOutputFile(outputFileContent);
}

export function log(...message) {
  console.log(new Date().toISOString(), ...message);
}

function getPlayerFrame(page) {
  return page.frames().find((frame) => frame.url().includes(PLAYER_FRAME_URL));
}

async function getManifestUrl(playerFrame) {
  const playerFrameContent = await playerFrame.content();
  const matches = playerFrameContent.match(MANIFEST_URL_PATTERN);
  return matches ? cleanUpEscapedSlashes(matches[1]) : null;
}

function cleanUpEscapedSlashes(url) {
  return url.replace(/\\\//g, "/");
}

function writeOutputFile(fileContent) {
  const outputDirectory = path.resolve(OUTPUT_DIR_PATH);
  fs.mkdirSync(outputDirectory, { recursive: true });
  const outFile = path.join(outputDirectory, OUTPUT_FILE_NAME);
  fs.writeFileSync(outFile, fileContent, { encoding: "utf-8" });
}

function getOutputFileContent(manifestUrl) {
  const updatedAt = new Date().toISOString();
  return JSON.stringify({ manifestUrl, updatedAt }, null, 2);
}
