const Joi = require('joi');
const { validateJoiSchema } = require('../validation');
const { buildCurrencyAmountSchema } = require('./shared');

module.exports = function (req, body) {
  const schema = Joi.object({
    bicycleMiles: buildCurrencyAmountSchema(
      req,
      'EXPENSE_CALCULATOR.TRAVEL_BICYCLE.ERROR_SUMMARY_MISSING',
      'EXPENSE_CALCULATOR.TRAVEL_BICYCLE.ERROR_SUMMARY_INVALID',
    ),
  });

  return validateJoiSchema(schema, body, {
    summaryLinks: {
      bicycleMiles: 'bicycleMiles',
    },
  });
};
