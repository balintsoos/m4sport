import http from "node:http";
import fs from "node:fs";
import { PORT, MANIFEST_PATH } from "./config.js";
import logger from "./logger.js";

function getManifestUrl() {
  const content = fs.readFileSync(MANIFEST_PATH, "utf-8");
  return JSON.parse(content).manifestUrl;
}

const server = http.createServer((req, res) => {
  if (req.method !== "GET") {
    res.writeHead(405);
    res.end();
    return;
  }

  try {
    if (req.url === "/stream") {
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
  logger.info({ port: PORT }, "Server listening");
});
