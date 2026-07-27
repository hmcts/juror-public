const Joi = require('joi');
const { message, validateJoiSchema } = require('./index');

module.exports = function (req, body) {
  const schema = Joi.object({
    deferralReason: Joi.string()
      .empty('')
      .required()
      .max(1000)
      .messages({
        'any.required': message(req, 'VALIDATION.DEFERRAL.CHECK_REASON_MISSING', req.session.user.thirdParty),
        'any.only': message(req, 'VALIDATION.DEFERRAL.CHECK_REASON_MISSING', req.session.user.thirdParty),
        'string.max': message(req, 'VALIDATION.DEFERRAL.CHECK_REASON_LENGTH', req.session.user.thirdParty),
      }),
  });

  return validateJoiSchema(schema, body);
};
