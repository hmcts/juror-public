;(function(){
  'use strict';

  const controller = require('./confirm-information.controller');
  const auth = require('../../../components/auth');

  module.exports = function(app) {
    app.get('/expense-calculator/confirm-information', 'expense.calculator.confirm.information.get', auth.validExpenseCalcSession, controller.index(app));
    app.post('/expense-calculator/confirm-information', 'expense.calculator.confirm.information.post', auth.validExpenseCalcSession, controller.create(app));
  };

})();
