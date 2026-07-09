const Joi = require('joi');
const { validateJoiSchema } = require('./index');
const { buildDeferralDateSchema } = require('./date-validation');

module.exports = function (req, body) {
  const isThirdParty = req.session.user.thirdParty;

  const schema = Joi.object({
    date1: buildDeferralDateSchema(req, {
      thirdParty: isThirdParty,
      missingKey: 'VALIDATION.DEFERRAL.DATE_ONE_MISSING',
      invalidKey: 'VALIDATION.DEFERRAL.DATE_ONE_FORMAT',
      rangeKey: 'VALIDATION.DEFERRAL.DATE_ONE_RANGE',
    }),
    date2: buildDeferralDateSchema(req, {
      thirdParty: isThirdParty,
      missingKey: 'VALIDATION.DEFERRAL.DATE_TWO_MISSING',
      invalidKey: 'VALIDATION.DEFERRAL.DATE_TWO_FORMAT',
      rangeKey: 'VALIDATION.DEFERRAL.DATE_TWO_RANGE',
    }),
    date3: buildDeferralDateSchema(req, {
      thirdParty: isThirdParty,
      missingKey: 'VALIDATION.DEFERRAL.DATE_THREE_MISSING',
      invalidKey: 'VALIDATION.DEFERRAL.DATE_THREE_FORMAT',
      rangeKey: 'VALIDATION.DEFERRAL.DATE_THREE_RANGE',
    }),
    date1FieldId: Joi.string().optional(),
    date2FieldId: Joi.string().optional(),
    date3FieldId: Joi.string().optional(),
    earliestDate: Joi.any().required(),
    latestDate: Joi.any().required(),
    ageLimit: Joi.number().required(),
    jurorDOB: Joi.any().required(),
  });

  return validateJoiSchema(schema, body);
};
