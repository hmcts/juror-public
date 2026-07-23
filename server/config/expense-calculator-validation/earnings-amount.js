const Joi = require('joi');
const { validateJoiSchema } = require('../validation');
const { buildCurrencyAmountSchema } = require('./shared');

module.exports = function (req, body) {
  const schema = Joi.object({
    earningsAmount: buildCurrencyAmountSchema(
      req,
      'EXPENSE_CALCULATOR.EARNINGS_AMOUNT.ERROR_SUMMARY_MISSING',
      'EXPENSE_CALCULATOR.EARNINGS_AMOUNT.ERROR_SUMMARY_INVALID',
    ),
  });

  return validateJoiSchema(schema, body, {
    summaryLinks: {
      earningsAmount: 'earningsAmount',
    },
  });
};
