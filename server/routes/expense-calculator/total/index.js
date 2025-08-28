;(function(){
  'use strict';

  const controller = require('./total.controller');
  const auth = require('../../../components/auth');

  module.exports = function(app) {
    app.get('/expense-calculator/total', 'expense.calculator.total.get', auth.validExpenseCalcSession, controller.index(app));
    app.post('/expense-calculator/total', 'expense.calculator.total.post', auth.validExpenseCalcSession, controller.create(app));

  };

})();
