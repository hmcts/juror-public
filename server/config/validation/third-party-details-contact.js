const Joi = require('joi');
const { message, validateJoiSchema } = require('./index');
const { phone } = require('./custom-validation').regexPatterns;
const { optionalString } = require('./custom-validation');

module.exports = function (req, body) {
  const schema = Joi.object({
    contactPhone: optionalString()
      .when('contactEmail', {
        is: Joi.exist(),
        then: Joi.optional(),
        otherwise: Joi.required(),
      })
      .messages({
        'any.required': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_DETAILS.CONTACT_CHECK_MISSING', req.session.user.thirdParty),
      }),
    mainPhone: optionalString()
      .when('contactPhone', {
        is: 'By phone',
        then: Joi.required(),
        otherwise: Joi.optional(),
      })
      .pattern(phone)
      .messages({
        'any.required': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_DETAILS.MAIN_PHONE_CHECK_MISSING', req.session.user.thirdParty),
        'string.pattern.base': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_DETAILS.MAIN_PHONE_CHECK_INVALID', req.session.user.thirdParty),
      }),
    otherPhone: optionalString()
      .pattern(phone)
      .messages({
        'string.pattern.base': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_DETAILS.OTHER_PHONE_CHECK_INVALID', req.session.user.thirdParty),
      }),
    emailAddress: optionalString()
      .when('contactEmail', {
        is: 'By email',
        then: Joi.required().email(),
        otherwise: Joi.optional().email(),
      })
      .messages({
        'any.required': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_DETAILS.EMAIL_CHECK_MISSING', req.session.user.thirdParty),
        'string.email': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_DETAILS.EMAIL_CHECK_INVALID', req.session.user.thirdParty),
      }),
    emailAddressConfirmation: optionalString()
      .when('contactEmail', {
        is: 'By email',
        then: Joi.required(),
        otherwise: Joi.optional(),
      })
      .custom((value, helpers) => {
        const formBody = helpers.state.ancestors[0] || {};
        if (formBody.contactEmail !== 'By email' || typeof formBody.emailAddress === 'undefined' || formBody.emailAddress === '') {
          return value;
        }
        if (value !== formBody.emailAddress) {
          return helpers.error('any.only');
        }
        return value;
      })
      .messages({
        'any.required': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_DETAILS.EMAIL_CONFIRMATION_CHECK_MISSING', req.session.user.thirdParty),
        'any.only': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_DETAILS.EMAIL_CONFIRMATION_CHECK_INVALID', req.session.user.thirdParty),
      }),
  });

  return validateJoiSchema(schema, body);
};
