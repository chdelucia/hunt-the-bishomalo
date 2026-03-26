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
        stringifyContentPathRegex: String.raw`\.(html|svg)$`,
        diagnostics: {
          ignoreCodes: [151001],
        },
      },
    ],
  },
  transformIgnorePatterns: [String.raw`node_modules/(?!.*\.mjs$|@jsverse|@angular-architects)`],
  moduleNameMapper: {
    '^@angular/core/testing$': '<rootDir>/node_modules/@angular/core/fesm2022/testing.mjs',
    '^@angular/common/testing$': '<rootDir>/node_modules/@angular/common/fesm2022/testing.mjs',
    '^@angular/compiler/testing$': '<rootDir>/node_modules/@angular/compiler/fesm2022/testing.mjs',
    '^@angular/platform-browser/testing$': '<rootDir>/node_modules/@angular/platform-browser/fesm2022/testing.mjs',
    '^@angular/platform-browser-dynamic/testing$': '<rootDir>/node_modules/@angular/platform-browser-dynamic/fesm2022/testing.mjs',
    '^@angular/router/testing$': '<rootDir>/node_modules/@angular/router/fesm2022/testing.mjs',
    '^@angular/core$': '<rootDir>/node_modules/@angular/core/fesm2022/core.mjs',
    '^@angular/common$': '<rootDir>/node_modules/@angular/common/fesm2022/common.mjs',
    '^@angular/common/http$': '<rootDir>/node_modules/@angular/common/fesm2022/http.mjs',
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
  collectCoverageFrom: [
    'src/app/**/*.ts',
    '!src/app/**/*.spec.ts',
    '!src/app/app.config.ts',
    '!src/bootstrap.ts',
  ],
};
