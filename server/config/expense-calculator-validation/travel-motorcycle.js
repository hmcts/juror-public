const Joi = require('joi');
const { validateJoiSchema } = require('../validation');
const { buildCurrencyAmountSchema } = require('./shared');

module.exports = function (req, body) {
  const schema = Joi.object({
    motorcycleMiles: buildCurrencyAmountSchema(
      req,
      'EXPENSE_CALCULATOR.TRAVEL_MOTORCYCLE.ERROR_DETAIL_MISSING',
      'EXPENSE_CALCULATOR.TRAVEL_MOTORCYCLE.ERROR_DETAIL_INVALID',
    ),
  });

  return validateJoiSchema(schema, body, {
    summaryLinks: {
      motorcycleMiles: 'motorcycleMiles',
    },
  });
};
