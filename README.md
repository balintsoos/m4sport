# M4 Sport Stream

A containerized service that scrapes the M4 Sport live stream URL and exposes it as an HTTP redirect and an M3U playlist. Point any video player (VLC, IPTV clients, etc.) at it to watch M4 Sport.

## Features

- **Automatic Stream Discovery**: Periodically scrapes M4 Sport's live page using Playwright to extract the current HLS manifest URL
- **HTTP Stream Redirect**: `GET /stream` returns a `302` redirect to the current manifest URL
- **M3U Playlist**: `GET /playlist.m3u` serves a playlist file compatible with IPTV players
- **Startup Scrape**: Automatically scrapes on startup if the manifest is missing or stale (older than 24 hours)
- **Cron Scheduling**: Configurable cron schedule for periodic re-scraping

## Installation & Usage

### Prerequisites

- Internet connection with a Hungarian IP address
- Docker and Docker Compose (or Node.js 24+)

### Using Pre-built Image (Recommended)

Add the following to your `compose.yaml`:

```yaml
services:
  m4sport:
    image: ghcr.io/balintsoos/m4sport:latest
    environment:
      - PORT=8080
      - CRON_SCHEDULE=0 * * * *
      - TZ=Europe/Budapest
    ports:
      - "8080:8080"
    volumes:
      - ./config:/config
```

Then run:
```bash
docker compose up -d
```

### Building from Source

```bash
git clone https://github.com/balintsoos/m4sport.git
cd m4sport
docker compose up -d
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | HTTP server port |
| `CRON_SCHEDULE` | `0 0 * * *` | Cron expression for scrape frequency |
| `TZ` | `UTC` | Timezone for cron schedule |

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/stream` | 302 redirect to the current HLS manifest URL |
| `GET` | `/playlist.m3u` | M3U playlist pointing to `/stream` |

## How It Works

```
M4 Sport Website → Scraper (Playwright) → manifest.json → HTTP Server → Client
```

1. On startup, if no fresh manifest exists, the scraper runs immediately
2. The cron scheduler triggers periodic re-scrapes to keep the URL current
3. The HTTP server reads the saved manifest and either redirects to it (`/stream`) or wraps it in an M3U playlist (`/playlist.m3u`)

## Troubleshooting

- **503 "Stream URL not available yet"**: The scraper hasn't completed its first run. Check logs with `docker compose logs m4sport`.
- **Scraper failing**: M4 Sport's website structure may have changed. Check logs for error details.
- **Stale stream URL**: Decrease the `CRON_SCHEDULE` interval (e.g., `*/30 * * * *` for every 30 minutes).

## License

MIT - see [LICENSE](LICENSE).

## Disclaimer

For educational and personal use only. Respect M4 Sport's terms of service and copyright policies.
