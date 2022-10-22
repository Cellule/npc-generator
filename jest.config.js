"use strict";

const path = require("path");

module.exports = {
  roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.ts$": ["ts-jest", { tsconfig: "tsconfig.test.json", isolatedModules: true }],
  },
  // setupFiles,
  setupFilesAfterEnv: [path.join(__dirname, "jest.setupAfterEnv.js")],
  testEnvironment: "node",
  // collectCoverageFrom: testRoots.map((r) => `${r}/**/*.${useDist ? "js" : "{ts,tsx}"}`),
  // coveragePathIgnorePatterns: [".d.ts", "/node_modules/", "/migrations/", "/seeds/", "/__tests__/", "/__manualTests__/"],
  testRegex: `/__tests__/.*\\.spec\\.ts$`,
  moduleFileExtensions: ["ts", "js", "json"],
};
