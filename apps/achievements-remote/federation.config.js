const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
  name: 'achievements-remote',

  exposes: {
    './Routes': './libs/achievements/shell/src/index.ts',
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
    '@jsverse/transloco': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    '@hunt-the-bishomalo/achievements/api': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    '@hunt-the-bishomalo/achievements/data-access': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    '@hunt-the-bishomalo/shared-data': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    '@hunt-the-bishomalo/core/api': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    '@hunt-the-bishomalo/core/data-access': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    '@hunt-the-bishomalo/game/api': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    '@hunt-the-bishomalo/game/data-access': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    '@hunt-the-bishomalo/gamestats/api': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    '@hunt-the-bishomalo/gamestats/data-access': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
  },

  skip: [
    'rxjs/ajax',
    'rxjs/fetch',
    'rxjs/testing',
    'rxjs/webSocket',
  ],

  features: {
    ignoreUnusedDeps: true
  }
});
