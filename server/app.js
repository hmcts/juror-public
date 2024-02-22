/**
 * Main application file
 */

;(function(){
  'use strict';

  var express = require('express')
    , path = require('path')
    , _ = require('lodash')
    , config = require('./config/environment')()
    , logger = require('./components/logger')(config)
    , http = require('http')
    , ageSettings = require('./objects/ageSettings').ageSettings
    , app = express()
    , server = http.createServer(app)

    , appTitle = require(path.resolve(__dirname, '../', 'package.json')).name
    , releaseVersion = require(path.resolve(__dirname, '../', 'package.json')).version
    , versionStr = appTitle + ' v' + releaseVersion
    , upperAgeLimit
    , lowerAgeLimit
    , secretsConfig = require('config')
    , appInsights = require('applicationinsights-web');

  // Attach logger to app
  app.logger = logger;

  // Configure express
  require('./config/express')(app);
  require('./routes')(app);

  // Start AppInsights
  appInsights.setup(secretsConfig.get('secrets.juror.app-insights-connection-string'))
    .setAutoCollectConsole(true, true)
    .start();

  if (config.logConsole !== false) {
    console.info('\n\n');
    console.info(_.pad('###########', versionStr.length + 12, '#'));
    console.info('##    '+versionStr+'    ##');
    console.info(_.pad('###########', versionStr.length + 12, '#'));
    console.info('\n\n');
  }

  // Control server
  function startServer() {
    ageSettings.get(app)
      .then(function(response) {
        response.data.forEach(function(res) {

          switch (res.setting){
          case '100':
            upperAgeLimit = res.value
            break;
          case '101':
            lowerAgeLimit = res.value;
            break;
          }
        });
        app.ageSettings = {
          upperAgeLimit: upperAgeLimit,
          lowerAgeLimit: lowerAgeLimit
        };
        console.info('Retrieved age limit settings');
      })
      .catch(function(error) {
        console.info('Error retrieving age settings: ', error);

        app.ageSettings = {
          upperAgeLimit: 76,
          lowerAgeLimit: 18
        };
        console.info('Using default age limit settings');
      });

    app.pcqSettings = {
      serviceEnabled: null,
      serviceUrl: null,
      serviceReturnUrl: null
    };


    app.server = server.listen(config.port, config.ip, function() {
      if (config.logConsole !== false) {
        console.info('Express server listening on http://%s:%s', config.ip, config.port);
      }
    });
  }

  function stopServer() {
    if (config.logConsole !== false) {
      console.info('\nExpress server shutdown signal received');
    }

    if (typeof app.server !== 'undefined') {
      app.server.close(function() {
        process.exit(0);
        return;
      });
    }

    process.exit(0);
    return;
  }


  // Handle shutdown
  process.on('SIGINT', function() {
    stopServer();
  });

  //console.log('process.env:');
  //console.log(JSON.stringify(process.env));

  // Start the app immediately
  setImmediate(startServer);

  // Expose app
  exports = module.exports = app;

})();
