const Joi = require('joi');
const { validateJoiSchema } = require('../validation');
const { buildRequiredChoiceSchema } = require('./shared');

module.exports = function (req, body) {
  const schema = Joi.object({
    parking: buildRequiredChoiceSchema(req, 'EXPENSE_CALCULATOR.TRAVEL_PARKING.ERROR_SUMMARY'),
  });

  return validateJoiSchema(schema, body, {
    summaryLinks: {
      parking: 'parkingYes',
    },
  });
};
