const Joi = require('joi');
const { validateJoiSchema } = require('../validation');
const { message } = require('../validation');

module.exports = function (req, body) {
  const schema = Joi.object({
    travelType: Joi.string()
      .trim()
      .empty('')
      .required()
      .messages({
        'any.required': message(req, 'EXPENSE_CALCULATOR.TRAVEL.ERROR_SUMMARY'),
        'any.only': message(req, 'EXPENSE_CALCULATOR.TRAVEL.ERROR_SUMMARY'),
        'string.base': message(req, 'EXPENSE_CALCULATOR.TRAVEL.ERROR_SUMMARY'),
        'string.empty': message(req, 'EXPENSE_CALCULATOR.TRAVEL.ERROR_SUMMARY'),
      }),
  });

  return validateJoiSchema(schema, body, {
    summaryLinks: {
      travelType: 'travelTypeBicycle',
    },
  });
};
