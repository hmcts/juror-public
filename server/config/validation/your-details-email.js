const Joi = require('joi');
const { message, validateJoiSchema } = require('./index');

module.exports = function (req, body) {
  const schema = Joi.object({
    emailAddress: Joi.string()
      .empty('')
      .required()
      .email()
      .messages({
        'any.required': message(req, 'VALIDATION.YOUR_DETAILS.EMAIL_CHECK_MISSING', req.session.user.thirdParty),
        'any.only': message(req, 'VALIDATION.YOUR_DETAILS.EMAIL_CHECK_MISSING', req.session.user.thirdParty),
        'string.email': message(req, 'VALIDATION.YOUR_DETAILS.EMAIL_CHECK_INVALID', req.session.user.thirdParty),
      }),
    emailAddressConfirmation: Joi.string()
      .empty('')
      .when('emailAddress', {
        is: Joi.exist(),
        then: Joi.required(),
        otherwise: Joi.optional(),
      })
      .custom((value, helpers) => {
        const bodyValue = helpers.state.ancestors[0] || {};
        if (typeof bodyValue.emailAddress === 'undefined' || bodyValue.emailAddress === '') {
          return value;
        }
        if (value !== bodyValue.emailAddress) {
          return helpers.error('any.only');
        }
        return value;
      })
      .messages({
        'any.required': message(req, 'VALIDATION.YOUR_DETAILS.EMAIL_CONFIRM_MISSING', req.session.user.thirdParty),
        'any.only': message(req, 'VALIDATION.YOUR_DETAILS.EMAIL_CHECK_EQUALITY', req.session.user.thirdParty),
      }),
  });

  return validateJoiSchema(schema, body);
};
