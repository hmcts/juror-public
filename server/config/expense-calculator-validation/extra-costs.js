const Joi = require('joi');
const { validateJoiSchema } = require('../validation');
const { buildRequiredChoiceSchema } = require('./shared');

module.exports = function (req, body) {
  const schema = Joi.object({
    extraCosts: buildRequiredChoiceSchema(req, 'EXPENSE_CALCULATOR.EXTRA_COSTS.ERROR_SUMMARY'),
  });

  return validateJoiSchema(schema, body, {
    summaryLinks: {
      extraCosts: 'extraCostsYes',
    },
  });
};
