/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
  moduleNameMapper: {
    "^@lib/(.*)$": "<rootDir>/src/lib/$1",
    "^@managers/(.*)$": "<rootDir>/src/services/managers/$1",
    "^@/(.*)$": "<rootDir>/$1"
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
};
