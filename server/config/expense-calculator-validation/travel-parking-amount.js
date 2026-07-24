const Joi = require('joi');
const { validateJoiSchema } = require('../validation');
const { buildCurrencyAmountSchema } = require('./shared');

module.exports = function (req, body) {
  const schema = Joi.object({
    parkingAmount: buildCurrencyAmountSchema(
      req,
      'EXPENSE_CALCULATOR.TRAVEL_PARKING_AMOUNT.ERROR_DETAIL',
      'EXPENSE_CALCULATOR.TRAVEL_PARKING_AMOUNT.ERROR_DETAIL',
    ),
  });

  return validateJoiSchema(schema, body, {
    summaryLinks: {
      parkingAmount: 'parkingAmount',
    },
  });
};
