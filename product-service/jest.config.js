module.exports = {
    roots: ['<rootDir>/src'],
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
      "^@libs/(.*)$": "<rootDir>/src/libs/$1"
    },
  };