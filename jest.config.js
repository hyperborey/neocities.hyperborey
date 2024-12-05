/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",  // Using the Node environment for tests
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],  // Use ts-jest for transforming TypeScript files
  },
  moduleNameMapper: {
    "^@lib/(.*)$": "<rootDir>/src/lib/$1",  // Resolve @lib to src/lib
    "^@/(.*)$": "<rootDir>/$1"               // Resolve @ to the root directory
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],  // Include .ts, .tsx, .js, .json extensions
};
