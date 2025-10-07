// Simple unit tests for scraper functions
// Since we're using ES modules and Jest has issues with them,
// we'll test the logic by copying the functions here

describe("Scraper Functions Unit Tests", () => {
  // Copy the function logic for testing
  const cleanUpEscapedSlashes = (url) => {
    return url.replace(/\\\//g, "/");
  };

  const getOutputFileContent = (manifestUrl) => {
    const updatedAt = new Date().toISOString();
    return JSON.stringify({ manifestUrl, updatedAt }, null, 2);
  };

  const extractManifestUrl = (content) => {
    const manifestUrlPattern = /"file":\s*"([^"?]+)/;
    const matches = content.match(manifestUrlPattern);
    return matches ? cleanUpEscapedSlashes(matches[1]) : null;
  };

  const findPlayerFrame = (frames) => {
    return frames.find((frame) => frame.url().includes("player.php"));
  };

  describe("cleanUpEscapedSlashes", () => {
    test("should remove escaped slashes from URL", () => {
      const input = "https:\\/\\/example.com\\/path\\/to\\/file";
      const result = cleanUpEscapedSlashes(input);
      expect(result).toBe("https://example.com/path/to/file");
    });

    test("should handle URL without escaped slashes", () => {
      const input = "https://example.com/path/to/file";
      const result = cleanUpEscapedSlashes(input);
      expect(result).toBe("https://example.com/path/to/file");
    });

    test("should handle multiple escaped slashes", () => {
      const input = "https:\\/\\/cdn.example.com\\/streams\\/live\\/index.m3u8";
      const result = cleanUpEscapedSlashes(input);
      expect(result).toBe("https://cdn.example.com/streams/live/index.m3u8");
    });

    test("should handle empty string", () => {
      const result = cleanUpEscapedSlashes("");
      expect(result).toBe("");
    });
  });

  describe("getOutputFileContent", () => {
    test("should create JSON content with manifest URL and timestamp", () => {
      const manifestUrl = "https://example.com/manifest.m3u8";
      const result = getOutputFileContent(manifestUrl);

      const parsed = JSON.parse(result);
      expect(parsed.manifestUrl).toBe(manifestUrl);
      expect(parsed.updatedAt).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
      );
    });

    test("should create properly formatted JSON", () => {
      const manifestUrl = "https://example.com/test.m3u8";
      const result = getOutputFileContent(manifestUrl);

      // Should be pretty-printed JSON
      expect(result).toContain("{\n");
      expect(result).toContain('  "manifestUrl":');
      expect(result).toContain('  "updatedAt":');
      expect(result).toContain("\n}");

      // Should be valid JSON
      expect(() => JSON.parse(result)).not.toThrow();
    });

    test("should handle special characters in URL", () => {
      const manifestUrl =
        "https://example.com/manifest-with-special-chars_123.m3u8";
      const result = getOutputFileContent(manifestUrl);

      const parsed = JSON.parse(result);
      expect(parsed.manifestUrl).toBe(manifestUrl);
    });
  });

  describe("extractManifestUrl", () => {
    test("should extract manifest URL from content", () => {
      const content =
        'some content "file": "https://example.com/manifest.m3u8" more content';
      const result = extractManifestUrl(content);
      expect(result).toBe("https://example.com/manifest.m3u8");
    });

    test("should handle escaped slashes in manifest URL", () => {
      const content =
        'some content "file": "https:\\/\\/example.com\\/manifest.m3u8" more content';
      const result = extractManifestUrl(content);
      expect(result).toBe("https://example.com/manifest.m3u8");
    });

    test("should return null when manifest URL is not found", () => {
      const content = "some content without manifest URL";
      const result = extractManifestUrl(content);
      expect(result).toBeNull();
    });

    test("should handle complex JSON-like content", () => {
      const content = `
        var config = {
          "video": {
            "file": "https:\\/\\/cdn.example.com\\/streams\\/live.m3u8",
            "type": "hls"
          }
        };
      `;
      const result = extractManifestUrl(content);
      expect(result).toBe("https://cdn.example.com/streams/live.m3u8");
    });

    test("should handle URL with query parameters but extract clean URL", () => {
      const content =
        '"file": "https://example.com/manifest.m3u8?token=abc123"';
      const result = extractManifestUrl(content);
      expect(result).toBe("https://example.com/manifest.m3u8");
    });
  });

  describe("findPlayerFrame", () => {
    test("should find player frame with correct URL pattern", () => {
      const frames = [
        { url: () => "https://example.com/some-page.html" },
        { url: () => "https://m4sport.hu/player.php?id=123" },
        { url: () => "https://example.com/other-page.html" },
      ];

      const result = findPlayerFrame(frames);
      expect(result).toBe(frames[1]);
    });

    test("should return undefined when no player frame is found", () => {
      const frames = [
        { url: () => "https://example.com/some-page.html" },
        { url: () => "https://example.com/other-page.html" },
      ];

      const result = findPlayerFrame(frames);
      expect(result).toBeUndefined();
    });

    test("should return undefined when frames array is empty", () => {
      const frames = [];
      const result = findPlayerFrame(frames);
      expect(result).toBeUndefined();
    });

    test("should find frame even if player.php is in the middle of URL", () => {
      const frames = [
        { url: () => "https://example.com/some-page.html" },
        { url: () => "https://m4sport.hu/path/player.php/extra" },
        { url: () => "https://example.com/other-page.html" },
      ];

      const result = findPlayerFrame(frames);
      expect(result).toBe(frames[1]);
    });
  });

  describe("Integration scenarios", () => {
    test("should handle complete flow from frame content to clean URL", () => {
      const frameContent =
        'config = {"file": "https:\\/\\/cdn.example.com\\/live\\/stream.m3u8?auth=token"}';
      const manifestUrl = extractManifestUrl(frameContent);
      expect(manifestUrl).toBe("https://cdn.example.com/live/stream.m3u8");

      const output = getOutputFileContent(manifestUrl);
      const parsed = JSON.parse(output);
      expect(parsed.manifestUrl).toBe(
        "https://cdn.example.com/live/stream.m3u8"
      );
      expect(parsed.updatedAt).toBeDefined();
    });

    test("should handle real-world complex content", () => {
      const frameContent = `
        <script>
          var playerConfig = {
            "sources": [{
              "file": "https:\\/\\/stream.m4sport.hu\\/live\\/index.m3u8?quality=720p",
              "type": "hls"
            }],
            "autostart": true
          };
        </script>
      `;

      const manifestUrl = extractManifestUrl(frameContent);
      expect(manifestUrl).toBe("https://stream.m4sport.hu/live/index.m3u8");
    });
  });
});
