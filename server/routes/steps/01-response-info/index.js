;(function () {
  'use strict';

  const controller = require('./response-info.controller');
  const auth = require('../../../components/auth');

  module.exports = function (app) {
    app.get(
      '/steps/response-information/:id',
      'steps.response-info.get',
      auth.completeCheck,
      controller.index(app));

  };

})();
