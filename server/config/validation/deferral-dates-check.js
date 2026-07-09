const Joi = require('joi');
const { message, validateJoiSchema } = require('./index');

module.exports = function (req, body) {
  const schema = Joi.object({
    deferralDateCheck: Joi.string()
      .empty('')
      .required()
      .messages({
        'any.required': message(req, 'VALIDATION.DEFERRAL.CHECK_DATES_PROCEED', req.session.user.thirdParty),
        'any.only': message(req, 'VALIDATION.DEFERRAL.CHECK_DATES_PROCEED', req.session.user.thirdParty),
      }),
  });

  return validateJoiSchema(schema, body);
};
