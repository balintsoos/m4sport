export const PORT = process.env.PORT || 3000;
export const MANIFEST_FILE_PATH = process.env.MANIFEST_FILE_PATH || "./config/manifest.json";

export const PAGE_URL = "https://m4sport.hu/elo";
export const PLAYER_FRAME_URL = "player.php";
export const MANIFEST_URL_PATTERN = /"file":\s*"([^"?]+)/;
export const MANIFEST_URL_MAX_AGE_MS = 24 * 60 * 60 * 1000;
