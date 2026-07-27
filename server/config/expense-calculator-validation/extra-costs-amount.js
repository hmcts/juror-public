const Joi = require('joi');
const { validateJoiSchema } = require('../validation');
const { buildCurrencyAmountSchema } = require('./shared');

module.exports = function (req, body) {
  const schema = Joi.object({
    extraCostsAmount: buildCurrencyAmountSchema(
      req,
      'EXPENSE_CALCULATOR.EXTRA_COSTS_AMOUNT.ERROR_DETAIL_MISSING',
      'EXPENSE_CALCULATOR.EXTRA_COSTS_AMOUNT.ERROR_DETAIL_INVALID',
    ),
  });

  return validateJoiSchema(schema, body, {
    summaryLinks: {
      extraCostsAmount: 'extraCostsAmount',
    },
  });
};
