// End-to-end test for scraper functions
// This test will actually import and test the ES module functions

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

describe("Scraper E2E Tests", () => {
  const testScraperCode = `
    import fs from 'fs';
    import path from 'path';
    
    // Test the individual functions from scraper-functions.js
    const {
      getPlayerFrame,
      getManifestUrl,
      cleanUpEscapedSlashes,
      getOutputFileContent,
      writeOutputFile
    } = await import('./scraper-functions.js');
    
    // Test cleanUpEscapedSlashes
    const testUrl = 'https:\\\\/\\\\/example.com\\\\/manifest.m3u8';
    const cleanUrl = cleanUpEscapedSlashes(testUrl);
    console.log('CLEAN_URL_TEST:', cleanUrl === 'https://example.com/manifest.m3u8');
    
    // Test getOutputFileContent
    const output = getOutputFileContent('https://test.com/manifest.m3u8');
    const parsed = JSON.parse(output);
    console.log('OUTPUT_TEST:', (parsed.manifestUrl === 'https://test.com/manifest.m3u8' && parsed.updatedAt) ? 'true' : 'false');
    
    // Test getPlayerFrame simulation
    const mockPage = {
      frames: () => [
        { url: () => 'https://example.com/other.html' },
        { url: () => 'https://m4sport.hu/player.php?id=123' }
      ]
    };
    const frame = getPlayerFrame(mockPage);
    console.log('FRAME_TEST:', frame && frame.url().includes('player.php'));
    
    // Test getManifestUrl simulation
    const mockFrame = {
      content: async () => 'content "file": "https:\\\\/\\\\/test.com\\\\/video.m3u8" more'
    };
    const manifestUrl = await getManifestUrl(mockFrame);
    console.log('MANIFEST_TEST:', manifestUrl === 'https://test.com/video.m3u8');
    
    console.log('ALL_TESTS_PASSED');
  `;

  const testFilePath = path.join(__dirname, "temp-e2e-test.mjs");

  beforeAll(() => {
    fs.writeFileSync(testFilePath, testScraperCode);
  });

  afterAll(() => {
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
  });

  test("should run ES module functions correctly", (done) => {
    const child = execSync(`node ${testFilePath}`, {
      encoding: "utf8",
      cwd: __dirname,
    });

    const output = child.toString();

    expect(output).toContain("CLEAN_URL_TEST: true");
    expect(output).toContain("OUTPUT_TEST: true");
    expect(output).toContain("FRAME_TEST: true");
    expect(output).toContain("MANIFEST_TEST: true");
    expect(output).toContain("ALL_TESTS_PASSED");

    done();
  }, 10000); // 10 second timeout

  test("should validate original scraper.js can be loaded", () => {
    const scraperPath = path.join(__dirname, "scraper.js");
    expect(fs.existsSync(scraperPath)).toBe(true);

    const scraperContent = fs.readFileSync(scraperPath, "utf8");
    expect(scraperContent).toContain("runScraper");
    expect(scraperContent).toContain("scraper-functions.js");
  });

  test("should validate scraper-functions.js exports all required functions", () => {
    const functionsPath = path.join(__dirname, "scraper-functions.js");
    expect(fs.existsSync(functionsPath)).toBe(true);

    const functionsContent = fs.readFileSync(functionsPath, "utf8");
    expect(functionsContent).toContain("export function getPlayerFrame");
    expect(functionsContent).toContain("export async function getManifestUrl");
    expect(functionsContent).toContain("export function cleanUpEscapedSlashes");
    expect(functionsContent).toContain("export function getOutputFileContent");
    expect(functionsContent).toContain("export function writeOutputFile");
    expect(functionsContent).toContain("export async function runScraper");
  });
});
