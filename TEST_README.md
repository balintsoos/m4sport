# M4Sport Scraper Tests

This repository contains comprehensive tests for the M4Sport scraper functionality.

## Test Structure

### Files

- `scraper-simple.test.js` - Main unit tests for scraper functions
- `scraper.test.js` - Mock-based tests (ES module compatible)
- `scraper.integration.test.js` - Integration tests with Playwright mocks
- `scraper-functions.js` - Refactored scraper functions for better testability
- `jest.config.cjs` - Jest configuration file

## Running Tests

### Install Dependencies

```bash
npm install
```

### Run All Tests

```bash
npm test
```

### Run Specific Test File

```bash
npm test scraper-simple.test.js
```

### Run Tests with Coverage

```bash
npm run test:coverage
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

## Test Coverage

### Unit Tests (`scraper-simple.test.js`)

The main test suite covers:

#### `cleanUpEscapedSlashes` function

- ✅ Removes escaped slashes from URLs (`https:\\/\\/` → `https://`)
- ✅ Handles URLs without escaped slashes
- ✅ Handles multiple escaped slashes
- ✅ Handles empty strings

#### `getOutputFileContent` function

- ✅ Creates valid JSON with manifest URL and timestamp
- ✅ Creates properly formatted JSON (pretty-printed)
- ✅ Handles special characters in URLs
- ✅ Generates ISO 8601 timestamps

#### `extractManifestUrl` function

- ✅ Extracts manifest URLs from player frame content
- ✅ Handles escaped slashes in URLs
- ✅ Returns null when no manifest URL is found
- ✅ Handles complex JSON-like content
- ✅ Strips query parameters from URLs

#### `findPlayerFrame` function

- ✅ Finds player frames with correct URL pattern (`player.php`)
- ✅ Returns undefined when no player frame is found
- ✅ Handles empty frames array
- ✅ Finds frames even when `player.php` is in the middle of URL

#### Integration Scenarios

- ✅ Complete flow from frame content to clean URL
- ✅ Real-world complex content handling

### Mock-based Tests (`scraper.test.js` & `scraper.integration.test.js`)

These files contain more advanced tests with mocked dependencies:

- ✅ Playwright browser automation mocking
- ✅ File system operations mocking
- ✅ Success and error scenario testing
- ✅ Browser launch and page navigation testing
- ✅ JSON file output validation

## Refactored Code Structure

The original `scraper.js` has been refactored for better testability:

### Original Structure

```
scraper.js (monolithic with IIFE)
```

### New Structure

```
scraper.js (entry point)
├── imports from scraper-functions.js
└── calls runScraper()

scraper-functions.js (testable functions)
├── getPlayerFrame()
├── getManifestUrl()
├── cleanUpEscapedSlashes()
├── getOutputFileContent()
├── writeOutputFile()
└── runScraper()
```

## Test Examples

### Testing URL Cleaning

```javascript
test("should remove escaped slashes from URL", () => {
  const input = "https:\\/\\/example.com\\/manifest.m3u8";
  const result = cleanUpEscapedSlashes(input);
  expect(result).toBe("https://example.com/manifest.m3u8");
});
```

### Testing Manifest URL Extraction

```javascript
test("should extract manifest URL from content", () => {
  const content = '"file": "https://example.com/manifest.m3u8"';
  const result = extractManifestUrl(content);
  expect(result).toBe("https://example.com/manifest.m3u8");
});
```

### Testing JSON Output

```javascript
test("should create JSON content with manifest URL and timestamp", () => {
  const manifestUrl = "https://example.com/manifest.m3u8";
  const result = getOutputFileContent(manifestUrl);

  const parsed = JSON.parse(result);
  expect(parsed.manifestUrl).toBe(manifestUrl);
  expect(parsed.updatedAt).toMatch(
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
  );
});
```

## Benefits of Testing

1. **Reliability** - Ensures scraper functions work correctly with various inputs
2. **Regression Prevention** - Catches breaking changes when modifying code
3. **Documentation** - Tests serve as examples of how functions should work
4. **Confidence** - Allows safe refactoring and improvements
5. **Edge Case Coverage** - Handles empty inputs, malformed URLs, missing data

## Development Workflow

1. Write or modify scraper functionality
2. Run tests to ensure nothing breaks: `npm test`
3. Add new tests for new functionality
4. Check coverage: `npm run test:coverage`
5. Commit changes with confidence

The test suite ensures the M4Sport scraper remains robust and maintainable as the codebase evolves.
