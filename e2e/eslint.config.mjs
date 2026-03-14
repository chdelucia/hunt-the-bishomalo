import baseConfig from '../eslint.base.config.mjs';
import cypress from 'eslint-plugin-cypress';

export default [
  ...baseConfig,
  cypress.configs['recommended'],
  {
    // Override or add rules here
    rules: {},
  },
];
