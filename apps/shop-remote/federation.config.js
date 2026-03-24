const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
  name: 'shop-remote',

  exposes: {
    './Routes': './apps/shop-remote/src/app/shop/shell/shop.routes.ts',
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
    '@jsverse/transloco': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    '@hunt-the-bishomalo/shop/api': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    '@hunt-the-bishomalo/shared-data': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    '@hunt-the-bishomalo/core/api': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    '@hunt-the-bishomalo/game/api': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
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
