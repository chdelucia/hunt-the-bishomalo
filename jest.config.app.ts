export default {
  displayName: 'hunt-the-bishomalo',
  preset: './jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  coverageDirectory: './coverage/hunt-the-bishomalo',
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  moduleNameMapper: {
    '^@angular/core/testing$': 'node_modules/@angular/core/fesm2022/testing.mjs',
    '^@angular/common/testing$': 'node_modules/@angular/common/fesm2022/testing.mjs',
    '^@angular/compiler/testing$': 'node_modules/@angular/compiler/fesm2022/testing.mjs',
    '^@angular/platform-browser/testing$': 'node_modules/@angular/platform-browser/fesm2022/testing.mjs',
    '^@angular/platform-browser-dynamic/testing$': 'node_modules/@angular/platform-browser-dynamic/fesm2022/testing.mjs',
    '^@angular/router/testing$': 'node_modules/@angular/router/fesm2022/testing.mjs',
  },
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.[jt]s?(x)',
    '<rootDir>/src/**/*(*.)@(spec|test).[jt]s?(x)',
  ],
};
