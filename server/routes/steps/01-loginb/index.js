;(function () {
  'use strict';

  const controller = require('./digital-summons.controller');
  const auth = require('../../../components/auth');

  module.exports = function (app) {
    app.get('/steps/digital-summons', 'steps.digital.summons.get',
      auth.verify, auth.completeCheck, controller.index(app));
  };

})();
