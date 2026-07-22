const nxPreset = require('@nx/jest/preset').default;

module.exports = {
  ...nxPreset,
  transformIgnorePatterns: [String.raw`node_modules/(?!.*\.mjs$|@jsverse|@angular-architects|@softarc)`],
  coverageReporters: ['html', 'lcov', 'text-summary'],
  coveragePathIgnorePatterns: ['/node_modules/', '\\.stories\\.ts$', '\\.interface\\.ts$', '\\.model\\.ts$'],
};
