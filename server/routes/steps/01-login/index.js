;(function () {
  'use strict';

  const controller = require('./login.controller');
  const utils = require('../../../lib/utils');

  module.exports = function (app) {
    app.get('/steps/login', 'steps.login.get', utils.checkPageAccess(app, 2), controller.index(app));
    app.get('/steps/login/tp', 'steps.login.tp.get', utils.checkPageAccess(app, 2), controller.index(app));

    app.get('/steps/login/replied', 'steps.login.replied.get',
      utils.checkPageAccess(app, 2), controller.getReplied(app));
    app.get('/steps/login/replied/tp', 'steps.login.replied.tp.get',
      utils.checkPageAccess(app, 2), controller.getReplied(app));

    app.get('/steps/login/summons-date', 'steps.login.summons-date.get',
      utils.checkPageAccess(app, 2), controller.getSummonsDate(app));
    app.get('/steps/login/summons-date/tp', 'steps.login.summons-date.tp.get',
      utils.checkPageAccess(app, 2), controller.getSummonsDate(app));

    app.post('/steps/login', 'steps.login.post', controller.create(app));
  };

})();
