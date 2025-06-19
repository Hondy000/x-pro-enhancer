module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: [
    '**/__tests__/**/*.js',
    '**/*.test.js',
    '**/*.spec.js'
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/build/'
  ],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    '*.js',
    'scripts/**/*.js',
    '!jest.config.js',
    '!jest.setup.js',
    '!coverage/**',
    '!dist/**',
    '!build/**'
  ],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 75,
      statements: 75
    }
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/styleMock.js',
    '\\.(gif|ttf|eot|svg|png|jpg|jpeg)$': '<rootDir>/__mocks__/fileMock.js'
  },
  transform: {
    '^.+\\.js$': 'babel-jest'
  }
};
