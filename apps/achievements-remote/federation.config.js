const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
  name: 'achievements-remote',

  exposes: {
    './Routes': './apps/achievements-remote/src/app/achievements/shell/achievements.routes.ts',
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
    '@jsverse/transloco': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    '@hunt-the-bishomalo/achievements/api': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    '@hunt-the-bishomalo/shared-data': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    '@hunt-the-bishomalo/core/api': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    '@hunt-the-bishomalo/game/api': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    '@hunt-the-bishomalo/gamestats/api': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
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
