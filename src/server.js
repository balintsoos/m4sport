import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { PORT } from "./config.js";
import { getManifestUrl } from "./manifest.js";
import { info } from "./logger.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PLAYER_HTML_PATH = resolve(__dirname, "./player/index.html");

export function startServer() {
  const server = createServer((req, res) => {
    if (req.method !== "GET") {
      res.writeHead(405);
      res.end();
      return;
    }

    try {
      if (req.url === "/") {
        const html = readFileSync(PLAYER_HTML_PATH, "utf-8");
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(html);
      } else if (req.url === "/stream") {
        const url = getManifestUrl();
        res.writeHead(302, { Location: url });
        res.end();
      } else if (req.url === "/playlist.m3u") {
        const host = req.headers.host || `localhost:${PORT}`;
        const protocol = req.headers["x-forwarded-proto"] || "http";
        const streamUrl = `${protocol}://${host}/stream`;
        const body = `#EXTM3U\n#EXTINF:-1 tvg-name="M4 Sport",M4 Sport\n${streamUrl}\n`;
        res.writeHead(200, { "Content-Type": "audio/x-mpegurl" });
        res.end(body);
      } else {
        res.writeHead(404);
        res.end();
      }
    } catch (err) {
      res.writeHead(503, { "Content-Type": "text/plain" });
      res.end("Stream URL not available yet");
    }
  });

  server.listen(PORT, () => {
    info(`Server listening on port ${PORT}`);
  });
}
