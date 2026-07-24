const Joi = require('joi');
const { validateJoiSchema } = require('../validation');
const { message } = require('../validation');

module.exports = function (req, body) {
  const schema = Joi.object({
    travelType: Joi.array()
      .single()
      .required()
      .messages({
        'any.required': message(req, 'EXPENSE_CALCULATOR.TRAVEL_TYPE.ERROR_SUMMARY'),
        'any.only': message(req, 'EXPENSE_CALCULATOR.TRAVEL_TYPE.ERROR_SUMMARY'),
      }),
  });

  return validateJoiSchema(schema, body, {
    summaryLinks: {
      travelType: 'travelTypeBicycle',
    },
  });
};
