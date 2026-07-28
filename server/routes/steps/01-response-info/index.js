;(function () {
  'use strict';

  const controller = require('./response-info.controller');
  const auth = require('../../../components/auth');
  const environmentConfig = require('../../../config/environment')();

  module.exports = function (app) {
    console.log('environmentConfig.featureFlags?.digitalByDefault', environmentConfig.featureFlags?.digitalByDefault);
    if (environmentConfig.featureFlags?.digitalByDefault) {
      app.get(
        '/steps/response-information/:id',
        'steps.response-info.get',
        // auth.completeCheck,
        controller.index(app));
    }
  };

})();
