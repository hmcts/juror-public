const Joi = require('joi');
const { message, validateJoiSchema } = require('./index');
const { phone } = require('./legacy-patterns');

module.exports = function (req, body) {
  const thirdParty = req.session.user.thirdParty;

  const schema = Joi.object({
    useJurorPhoneDetails: Joi.string()
      .empty('')
      .valid('Yes', 'No')
      .when('useJurorEmailDetails', {
        is: Joi.exist(),
        then: Joi.optional(),
        otherwise: Joi.required(),
      })
      .custom((value, helpers) => {
        if (value === 'No' && req.session.user.thirdPartyDetails.contactPhone === 'By phone') {
          return helpers.error('any.invalid');
        }
        return value;
      })
      .messages({
        'any.required': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_CONTACT.USE_PHONE_CHECK', thirdParty),
        'any.only': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_CONTACT.USE_PHONE_CHECK', thirdParty),
        'any.invalid': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_CONTACT.CANNOT_USE_OWN_PHONE_INLINE', thirdParty),
      }),
    primaryPhone: Joi.string()
      .empty('')
      .when('useJurorPhoneDetails', {
        is: 'Yes',
        then: Joi.required(),
        otherwise: Joi.optional(),
      })
      .pattern(phone)
      .messages({
        'any.required': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_CONTACT.PHONE_NUMBER_CHECK_MISSING', thirdParty),
        'string.pattern.base': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_CONTACT.PHONE_NUMBER_CHECK_INVALID', thirdParty),
      }),
    secondaryPhone: Joi.string()
      .empty('')
      .pattern(phone)
      .messages({
        'string.pattern.base': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_CONTACT.PHONE_NUMBER_OTHER_CHECK_INVALID', thirdParty),
      }),
    useJurorEmailDetails: Joi.string()
      .empty('')
      .valid('Yes', 'No')
      .when('useJurorPhoneDetails', {
        is: Joi.exist(),
        then: Joi.optional(),
        otherwise: Joi.required(),
      })
      .custom((value, helpers) => {
        if (value === 'No' && req.session.user.thirdPartyDetails.contactEmail === 'By email') {
          return helpers.error('any.invalid');
        }
        return value;
      })
      .messages({
        'any.required': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_CONTACT.USE_EMAIL_CHECK', thirdParty),
        'any.only': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_CONTACT.USE_EMAIL_CHECK', thirdParty),
        'any.invalid': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_CONTACT.CANNOT_USE_OWN_EMAIL_INLINE', thirdParty),
      }),
    emailAddress: Joi.string()
      .empty('')
      .when('useJurorEmailDetails', {
        is: 'Yes',
        then: Joi.required().email(),
        otherwise: Joi.optional().email(),
      })
      .messages({
        'any.required': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_CONTACT.EMAIL_CHECK_MISSING', thirdParty),
        'string.email': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_CONTACT.EMAIL_CHECK_INVALID', thirdParty),
      }),
    emailAddressConfirmation: Joi.string()
      .empty('')
      .custom((value, helpers) => {
        const body = helpers.state.ancestors[0] || {};
        if (body.useJurorEmailDetails !== 'Yes' || typeof body.emailAddress === 'undefined' || body.emailAddress === '') {
          return value;
        }
        if (value !== body.emailAddress) {
          return helpers.error('any.only');
        }
        return value;
      })
      .messages({
        'any.only': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_CONTACT.EMAIL_CONFIRMATION_CHECK_INVALID', thirdParty),
      }),
  });

  return validateJoiSchema(schema, body);
};
