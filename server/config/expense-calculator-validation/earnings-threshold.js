const Joi = require('joi');
const { validateJoiSchema } = require('../validation');
const { message } = require('../validation');

module.exports = function (req, body) {
  const schema = Joi.object({
    earningsThreshold: Joi.string()
      .trim()
      .empty('')
      .required()
      .messages({
        'any.required': message(req, 'EXPENSE_CALCULATOR.EARNINGS_THRESHOLD.ERROR_DETAIL'),
        'any.only': message(req, 'EXPENSE_CALCULATOR.EARNINGS_THRESHOLD.ERROR_DETAIL'),
        'string.base': message(req, 'EXPENSE_CALCULATOR.EARNINGS_THRESHOLD.ERROR_DETAIL'),
        'string.empty': message(req, 'EXPENSE_CALCULATOR.EARNINGS_THRESHOLD.ERROR_DETAIL'),
      }),
  });

  return validateJoiSchema(schema, body, {
    summaryLinks: {
      earningsThreshold: 'earningsThresholdYes',
    },
  });
};
