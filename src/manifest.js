import { existsSync, readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { MANIFEST_FILE_PATH } from "./config.js";

export function getManifestUrl() {
  return getManifest()?.manifestUrl || null;
}

export function getManifestAge() {
  const updatedAt = getManifest()?.updatedAt;
  if (!updatedAt) return null;
  return Date.now() - new Date(updatedAt).getTime();
}

export function writeManifest(manifestUrl) {
  const updatedAt = new Date().toISOString();
  const manifestData = { manifestUrl, updatedAt };
  const manifestJson = JSON.stringify(manifestData, null, 2);
  mkdirSync(dirname(MANIFEST_FILE_PATH), { recursive: true });
  writeFileSync(MANIFEST_FILE_PATH, manifestJson, { encoding: "utf-8" });
}

function getManifest() {
  if (!existsSync(MANIFEST_FILE_PATH)) return null;
  try {
    return JSON.parse(readFileSync(MANIFEST_FILE_PATH, "utf-8"));
  } catch {
    return null;
  }
}
