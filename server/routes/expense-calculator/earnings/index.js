;(function(){
  'use strict';

  const controller = require('./earnings.controller');
  const auth = require('../../../components/auth'); 

  module.exports = function(app) {
    app.get('/expense-calculator/earnings', 'expense.calculator.earnings.get', auth.validExpenseCalcSession, controller.index(app));
    app.post('/expense-calculator/earnings', 'expense.calculator.earnings.post', auth.validExpenseCalcSession, controller.create(app));
    app.get('/expense-calculator/earnings/change', 'expense.calculator.earnings.change.get', auth.validExpenseCalcSession, controller.change(app));

    app.get('/expense-calculator/earnings/threshold', 'expense.calculator.earnings.threshold.get', auth.validExpenseCalcSession, controller.getEarningsThreshold(app));
    app.post('/expense-calculator/earnings/threshold', 'expense.calculator.earnings.threshold.post', auth.validExpenseCalcSession, controller.createEarningsThreshold(app));
    app.get('/expense-calculator/earnings/threshold/change', 'expense.calculator.earnings.threshold.change.get', auth.validExpenseCalcSession, controller.changeEarningsThreshold(app));

    app.get('/expense-calculator/earnings/amount', 'expense.calculator.earnings.amount.get', auth.validExpenseCalcSession, controller.getEarningsAmount(app));
    app.post('/expense-calculator/earnings/amount', 'expense.calculator.earnings.amount.post', auth.validExpenseCalcSession, controller.createEarningsAmount(app));
    app.get('/expense-calculator/earnings/amount/change', 'expense.calculator.earnings.amount.change.get', auth.validExpenseCalcSession, controller.changeEarningsAmount(app));
  };

})();
