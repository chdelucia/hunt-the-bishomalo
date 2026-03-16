const nxPreset = require('@nx/jest/preset').default;

module.exports = {
  ...nxPreset,
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$|@jsverse)'],
  coverageReporters: ['html', 'lcov', 'text-summary'],
};
