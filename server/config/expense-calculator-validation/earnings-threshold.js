const Joi = require('joi');
const { validateJoiSchema } = require('../validation');
const { buildRequiredChoiceSchema } = require('./shared');

module.exports = function (req, body) {
  const schema = Joi.object({
    earningsThreshold: buildRequiredChoiceSchema(req, 'EXPENSE_CALCULATOR.EARNINGS_THRESHOLD.ERROR_SUMMARY'),
  });

  return validateJoiSchema(schema, body, {
    summaryLinks: {
      earningsThreshold: 'earningsThresholdYes',
    },
  });
};
