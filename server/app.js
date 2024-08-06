/**
 * Main application file
 */

;(function () {
  'use strict';

  const express = require('express');
  const path = require('path');
  const _ = require('lodash');
  const config = require('./config/environment')();
  const http = require('http');
  const ageSettings = require('./objects/ageSettings').ageSettings;
  const app = express();
  const server = http.createServer(app);
  const appTitle = require(path.resolve(__dirname, '../', 'package.json')).name;
  const releaseVersion = require(path.resolve(__dirname, '../', 'package.json')).version;
  const versionStr = appTitle + ' v' + releaseVersion;
  const { AppInsights } = require('./lib/appinsights');
  const { Logger } = require('./components/logger');

  let upperAgeLimit;
  let lowerAgeLimit;

  // Initialise
  new AppInsights();
  new Logger(config).initLogger(app);

  // Configure express
  require('./config/express')(app);
  require('./routes')(app);

  if (config.logConsole !== false) {
    console.info('\n\n');
    console.info(_.pad('###########', versionStr.length + 12, '#'));
    console.info('##    '+versionStr+'    ##');
    console.info(_.pad('###########', versionStr.length + 12, '#'));
    console.info('\n\n');
  }

  // Control server
  function startServer () {
    ageSettings.get(app)
      .then(function (response) {

        response.data.forEach(function(res) {

          switch (res.setting) {
            case '100':
              upperAgeLimit = res.value;
              break;
            case '101':
              lowerAgeLimit = res.value;
              break;
          }
        });

        app.ageSettings = {
          upperAgeLimit: upperAgeLimit,
          lowerAgeLimit: lowerAgeLimit,
        };
        console.info('Retrieved age limit settings');
        console.info(app.ageSettings);
      })
      .catch(function (error) {
        console.info('Error retrieving age settings: ', error);

        app.ageSettings = {
          upperAgeLimit: 76,
          lowerAgeLimit: 18,
        };
        console.info('Using default age limit values:');
        console.info(app.ageSettings);
      });


    app.pcqSettings = {
      serviceEnabled: null,
      serviceUrl: null,
      serviceReturnUrl: null,
    };


    app.server = server.listen(config.port, config.ip, function () {
      if (config.logConsole !== false) {
        console.info('Express server listening on http://%s:%s', config.ip, config.port);
      }
    });
  }

  async function stopServer () {
    if (config.logConsole !== false) {
      console.info('Express server shutdown signal received.');
      console.info('Express server closing down.');
    }

    app.server.close();
    await new Promise((res) => setTimeout(res, 5000));

    AppInsights.client()?.flush({
      callback: () => {
        process.exit();
      },
    });
  }

  // Handle shutdown
  process.on('SIGINT', function () {
    stopServer();
  });

  process.on('SIGTERM', function () {
    stopServer();
  });

  //app.logger.debug('NODE_ENV: ', process.env.NODE_ENV);

  // Start the app immediately
  setImmediate(startServer);

  // Expose app
  exports = module.exports = app;

})();
