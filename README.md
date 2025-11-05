# M4 Sport TV Player

A containerized solution for streaming M4 Sport TV channel full-screen with automated stream URL discovery.

## 🚀 Features

- **Automatic Stream Discovery**: Scrapes M4 Sport's live page periodically to get the current stream URL
- **Web-based Player**: Clean, full-screen video player with resolution and audio channel switcher
- **Containerized**: Fully containerized solution for easy deployment

## 🛠️ Installation & Usage

### Prerequisites

- Internet connection and hungarian IP address for accessing M4 Sport streams
- Docker and Docker Compose

### Option 1: Using Pre-built Images (Recommended)

Add the following to your `compose.yaml`:

```yaml
services:
  m4sport-scraper:
    image: ghcr.io/balintsoos/m4sport-scraper:latest
    container_name: m4sport-scraper
    volumes:
      - ./m4sport:/app/scraped
    restart: unless-stopped

  m4sport-player:
    image: ghcr.io/balintsoos/m4sport-player:latest
    container_name: m4sport-player
    volumes:
      - ./m4sport:/usr/share/nginx/html/scraped
    ports:
      - "8080:80"
    restart: unless-stopped
```

Then run:
```bash
docker compose up -d
```

### Option 2: Building from Source

1. Clone the repository:
```bash
git clone https://github.com/balintsoos/m4sport.git
cd m4sport
```

2. Start the services:
```bash
docker compose up -d
```

The player will be available at `http://localhost:8080`

## 🔍 How It Works

1. **Scraper Process**:
   - Uses Node.js and Playwright to navigate to M4 Sport's live page
   - Extracts the HLS manifest URL from the player iframe
   - Saves the URL with timestamp to `manifest-url.json`
   - Repeats every hour to handle URL changes

2. **Player Process**:
   - Uses Nginx to serve a web interface on the configured port
   - Fetches the current manifest URL from the shared JSON file
   - Initializes Shaka Player with the stream URL
   - Provides standard video controls (play/pause, volume, fullscreen), resolution and audio channel switcher

3. **Data Flow**:
   ```
   M4 Sport Website → Scraper → manifest-url.json → Player → Browser
   ```

## 🐛 Troubleshooting

### Common Issues

1. **Stream not loading**: 
   - Check if the scraper is running and has found a valid URL
   - Verify the manifest URL in `scraped/manifest-url.json`

2. **Scraper failing**:
   - M4 Sport website structure may have changed
   - Check scraper logs: `docker compose logs scraper`

3. **Player not accessible**:
   - Ensure the port is not in use by another service
   - Check firewall settings

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This tool is for educational and personal use only. Please respect M4 Sport's terms of service and copyright policies. The authors are not responsible for any misuse of this software.
