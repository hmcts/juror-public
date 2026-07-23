const Joi = require('joi');
const { validateJoiSchema } = require('../validation');
const { buildRequiredChoiceSchema } = require('./shared');

module.exports = function (req, body) {
  const schema = Joi.object({
    incomeAffected: buildRequiredChoiceSchema(req, 'EXPENSE_CALCULATOR.EARNINGS.ERROR_SUMMARY'),
  });

  return validateJoiSchema(schema, body, {
    summaryLinks: {
      incomeAffected: 'incomeAffectedYes',
    },
  });
};
