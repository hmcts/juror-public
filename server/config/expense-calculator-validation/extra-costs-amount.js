const Joi = require('joi');
const { validateJoiSchema } = require('../validation');
const { buildCurrencyAmountSchema } = require('./shared');

module.exports = function (req, body) {
  const schema = Joi.object({
    extraCostsAmount: buildCurrencyAmountSchema(
      req,
      'EXPENSE_CALCULATOR.EXTRA_COSTS_AMOUNT.ERROR_SUMMARY_MISSING',
      'EXPENSE_CALCULATOR.EXTRA_COSTS_AMOUNT.ERROR_SUMMARY_INVALID',
    ),
  });

  return validateJoiSchema(schema, body, {
    summaryLinks: {
      extraCostsAmount: 'extraCostsAmount',
    },
  });
};
