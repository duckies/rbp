module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.e2e-spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  coverageDirectory: './coverage',
  collectCoverage: true,
  collectCoverageFrom: ['./src/**/*.{ts,js}', '!./src/**/*.spec.{ts,js}'],
  testEnvironment: 'node',
};
