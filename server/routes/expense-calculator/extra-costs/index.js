;(function(){
  'use strict';

  const controller = require('./extra-costs.controller');
  const auth = require('../../../components/auth');

  module.exports = function(app) {
    app.get('/expense-calculator/extra-costs', 'expense.calculator.extra.costs.get', auth.validExpenseCalcSession, controller.index(app));
    app.post('/expense-calculator/extra-costs', 'expense.calculator.extra.costs.post', auth.validExpenseCalcSession, controller.create(app));
    app.get('/expense-calculator/extra-cost/change', 'expense.calculator.extra.costs.change.get', auth.validExpenseCalcSession, controller.change(app));

    app.get('/expense-calculator/extra-costs/amount', 'expense.calculator.extra.costs.amount.get', auth.validExpenseCalcSession, controller.getExtraCostsAmount(app));
    app.post('/expense-calculator/extra-costs/amount', 'expense.calculator.extra.costs.amount.post', auth.validExpenseCalcSession, controller.createExtraCostsAmount(app));
    app.get('/expense-calculator/extra-costs/amount/change', 'expense.calculator.extra.costs.amount.change.get', auth.validExpenseCalcSession, controller.changeExtraCostsAmount(app));

    app.get('/expense-calculator/extra-costs/info', 'expense.calculator.extra.costs.info', auth.validExpenseCalcSession, controller.getExtraCostsInfo(app));
  };

})();
