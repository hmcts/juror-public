const Joi = require('joi');
const { message, validateJoiSchema } = require('./index');

module.exports = function (req, body) {
  const schema = Joi.object({
    thirdPartyReason: Joi.string()
      .empty('')
      .required()
      .messages({
        'any.required': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_REASON.REASON_CHECK', req.session.user.thirdParty),
        'any.only': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_REASON.REASON_CHECK', req.session.user.thirdParty),
      }),
    thirdPartyOtherReason: Joi.string()
      .empty('')
      .max(100)
      .when('thirdPartyReason', {
        is: 'other',
        then: Joi.required(),
      })
      .messages({
        'any.required': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_REASON.OTHER_DETAILS_MISSING', req.session.user.thirdParty),
        'string.max': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_REASON.OTHER_DETAILS_LENGTH', req.session.user.thirdParty),
      }),
  });

  return validateJoiSchema(schema, body, {
    summaryLinks: {
      thirdPartyReason: 'thirdPartyReasonNotHere',
    },
  });
};
