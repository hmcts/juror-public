const Joi = require('joi');
const { validateJoiSchema } = require('../validation');
const { message } = require('../validation');

module.exports = function (req, body) {
  const schema = Joi.object({
    travelType: Joi.array()
      .single()
      .required()
      .messages({
        'any.required': message(req, 'EXPENSE_CALCULATOR.TRAVEL_TYPE.ERROR_DETAIL'),
        'any.only': message(req, 'EXPENSE_CALCULATOR.TRAVEL_TYPE.ERROR_DETAIL'),
      }),
  });

  return validateJoiSchema(schema, body, {
    summaryLinks: {
      travelType: 'travelTypeBicycle',
    },
  });
};
