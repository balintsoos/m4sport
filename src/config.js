import path from "node:path";

export const PORT = process.env.PORT || 3000;
export const CRON_SCHEDULE = process.env.CRON_SCHEDULE || "0 0 * * *";
export const TZ = process.env.TZ || "UTC";

export const MANIFEST_PATH = path.resolve("./scraped/manifest-url.json");
export const MANIFEST_MAX_AGE_MS = 24 * 60 * 60 * 1000;

export const PAGE_URL = "https://m4sport.hu/elo";
export const PLAYER_FRAME_URL = "player.php";
export const MANIFEST_URL_PATTERN = /"file":\s*"([^"?]+)/;
export const OUTPUT_DIR_PATH = path.resolve("./scraped");
export const OUTPUT_FILE_NAME = "manifest-url.json";
