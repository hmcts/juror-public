;(function () {
  'use strict';

  const controller = require('./response-start.controller');
  const auth = require('../../../components/auth');

  module.exports = function (app) {
    app.get('/steps/response-start', 'steps.response-start.get',
      auth.verify, auth.completeCheck, controller.index(app));
  };

})();
