const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  reporters: [
    "default",
    ["jest-html-reporter", {
      pageTitle: "Test Report",
      outputPath: "test-report.html",
      includeFailureMsg: true,
      includeSuiteFailure: true
    }]
  ],
  collectCoverage: false,
  collectCoverageFrom: [
    'src/**/*.ts',            
    '!src/**/*.tsx',        
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
  coveragePathIgnorePatterns: [
   "/node_modules/",
  "src/backend/server.ts", // Abaikan file ini
  "src/view/"
  ],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50
    }
  }
};