const appInsights = require('applicationinsights');
const secretsConfig = require('config');

module.exports.AppInsights = class AppInsights {

  constructor() {
    const isDev = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'dev';

    if (!isDev) {
      appInsights.setup(secretsConfig.get('secrets.juror.app-insights-connection-string'))
        .setAutoCollectConsole(true, true)
        .start();
    }
  }

};
