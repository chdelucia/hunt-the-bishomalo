const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
  name: 'hunt-the-bishomalo',


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
    // Add further packages you don't need at runtime
  ],

  // Please read our FAQ about sharing libs:
  // https://shorturl.at/jmzH0

  features: {
    // New feature for more performance and avoiding
    // issues with node libs. Comment this out to
    // get the traditional behavior:
    ignoreUnusedDeps: true
  }
});
