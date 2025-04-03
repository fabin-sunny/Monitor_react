module.exports = {
    preset: 'next/babel', // Using Next.js preset for Babel
    testEnvironment: 'jsdom', // Use jsdom for testing
    moduleDirectories: ['node_modules', '<rootDir>/'], // Allow Jest to find modules
    transform: {
      '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest', // Use babel-jest for transforming JavaScript/TypeScript
    },
    setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'], // Adds custom matchers to Jest
    testPathIgnorePatterns: ['/node_modules/', '/.next/'], // Ignore .next and node_modules folders
    moduleNameMapper: {
      '^@/components/(.*)$': '<rootDir>/components/$1', // Adjust paths to match your Next.js structure
    },
  };
  