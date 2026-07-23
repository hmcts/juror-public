const Joi = require('joi');
const { validateJoiSchema } = require('../validation');
const { buildRequiredChoiceSchema } = require('./shared');

module.exports = function (req, body) {
  const schema = Joi.object({
    travelType: buildRequiredChoiceSchema(req, 'EXPENSE_CALCULATOR.TRAVEL.ERROR_SUMMARY'),
  });

  return validateJoiSchema(schema, body, {
    summaryLinks: {
      travelType: 'travelTypeBicycle',
    },
  });
};
