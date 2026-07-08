import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { chromium } from "playwright";
import {
  PAGE_URL,
  PLAYER_FRAME_URL,
  MANIFEST_URL_PATTERN,
} from "./config.js";
import { writeManifest } from "./manifest.js";

export async function scrapeManifestUrl() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(PAGE_URL, { waitUntil: "networkidle", timeout: 20000 });

  const playerFrame = getPlayerFrame(page);
  if (!playerFrame) {
    await close(page, context, browser);
    throw new Error("Player frame not found");
  }

  const manifestUrl = await getManifestUrl(playerFrame);
  await close(page, context, browser);
  if (!manifestUrl) {
    throw new Error("Manifest URL not found");
  }

  writeManifest(manifestUrl);
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

async function close(page, context, browser) {
  await page.close();
  await context.close();
  await browser.close();
}
