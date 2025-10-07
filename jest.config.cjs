module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: [
    'scraper-functions.js',
    '!node_modules/**',
    '!coverage/**'
  ],
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],
  transform: {},
  moduleFileExtensions: ['js', 'json']
};