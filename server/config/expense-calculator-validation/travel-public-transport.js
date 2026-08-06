const Joi = require('joi');
const { validateJoiSchema } = require('../validation');
const { buildCurrencyAmountSchema } = require('./shared');

module.exports = function (req, body) {
  const schema = Joi.object({
    publicTransportAmount: buildCurrencyAmountSchema(
      req,
      'EXPENSE_CALCULATOR.TRAVEL_PUBLIC_TRANSPORT.ERROR_DETAIL_MISSING',
      'EXPENSE_CALCULATOR.TRAVEL_PUBLIC_TRANSPORT.ERROR_DETAIL_INVALID',
    ),
  });

  return validateJoiSchema(schema, body, {
    summaryLinks: {
      publicTransportAmount: 'publicTransportAmount',
    },
  });
};
