;(function () {
  'use strict';

  const controller = require('./dbd.controller');
  const auth = require('../../../components/auth');

  module.exports = function (app) {
    app.get('/steps/dbd', 'steps.dbd.get',
      auth.verify, auth.completeCheck, controller.index(app));
  };

})();
