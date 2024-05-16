module.exports = {
  transform: {
    // Apply 'ts-jest' to TypeScript files
    "^.+\\.(t|j)sx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.jest.json",
        useESM: true,
      },
    ],
    // Apply 'babel-jest' for JavaScript and JSX files
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    '\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/styleMock.js',
  },
  preset: "ts-jest/presets/default-esm",
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
  extensionsToTreatAsEsm: [".ts", ".tsx", ".jsx"],
  testEnvironment: "jsdom",
  setupFiles: ["jest-canvas-mock"],
  setupFilesAfterEnv: ["<rootDir>/setupTests.js"],
  transformIgnorePatterns: [
    "<rootDir>/node_modules/",
    "/node_modules/(?!react-leaflet|leaflet)",
  ],
};
