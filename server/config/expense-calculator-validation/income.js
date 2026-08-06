const Joi = require('joi');
const { validateJoiSchema } = require('../validation');
const { message } = require('../validation');

module.exports = function (req, body) {
  const schema = Joi.object({
    incomeAffected: Joi.string()
      .trim()
      .empty('')
      .required()
      .messages({
        'any.required': message(req, 'EXPENSE_CALCULATOR.EARNINGS.ERROR_DETAIL'),
        'any.only': message(req, 'EXPENSE_CALCULATOR.EARNINGS.ERROR_DETAIL'),
        'string.base': message(req, 'EXPENSE_CALCULATOR.EARNINGS.ERROR_DETAIL'),
        'string.empty': message(req, 'EXPENSE_CALCULATOR.EARNINGS.ERROR_DETAIL'),
      }),
  });

  return validateJoiSchema(schema, body, {
    summaryLinks: {
      incomeAffected: 'incomeAffectedYes',
    },
  });
};
