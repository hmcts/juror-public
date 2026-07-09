const Joi = require('joi');
const { message, validateJoiSchema } = require('./index');
const { name, phoneSpaces } = require('./legacy-patterns');

module.exports = function (req, body) {
  const schema = Joi.object({
    firstName: Joi.string()
      .empty('')
      .required()
      .max(50)
      .messages({
        'any.required': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_DETAILS.FIRST_NAME_CHECK_MISSING', req.session.user.thirdParty),
        'any.only': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_DETAILS.FIRST_NAME_CHECK_MISSING', req.session.user.thirdParty),
        'string.max': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_DETAILS.FIRST_NAME_CHECK_INVALID', req.session.user.thirdParty),
      }),
    lastName: Joi.string()
      .empty('')
      .required()
      .max(50)
      .messages({
        'any.required': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_DETAILS.LAST_NAME_CHECK_MISSING', req.session.user.thirdParty),
        'any.only': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_DETAILS.LAST_NAME_CHECK_MISSING', req.session.user.thirdParty),
        'string.max': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_DETAILS.LAST_NAME_CHECK_INVALID', req.session.user.thirdParty),
      }),
    relationship: Joi.string()
      .empty('')
      .required()
      .max(100)
      .messages({
        'any.required': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_DETAILS.RELATIONSHIP_CHECK_MISSING', req.session.user.thirdParty),
        'any.only': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_DETAILS.RELATIONSHIP_CHECK_MISSING', req.session.user.thirdParty),
        'string.max': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_DETAILS.RELATIONSHIP_CHECK_INVALID', req.session.user.thirdParty),
      }),
    contactPhone: Joi.string()
      .empty('')
      .when('contactEmail', {
        is: Joi.exist(),
        then: Joi.optional(),
        otherwise: Joi.required(),
      })
      .messages({
        'any.required': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_DETAILS.CONTACT_CHECK_MISSING', req.session.user.thirdParty),
      }),
    mainPhone: Joi.string()
      .empty('')
      .when('contactPhone', {
        is: 'By phone',
        then: Joi.required(),
        otherwise: Joi.optional(),
      })
      .pattern(phoneSpaces)
      .messages({
        'any.required': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_DETAILS.MAIN_PHONE_CHECK_MISSING', req.session.user.thirdParty),
        'string.pattern.base': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_DETAILS.MAIN_PHONE_CHECK_INVALID', req.session.user.thirdParty),
      }),
    otherPhone: Joi.string()
      .empty('')
      .pattern(phoneSpaces)
      .messages({
        'string.pattern.base': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_DETAILS.OTHER_PHONE_CHECK_INVALID', req.session.user.thirdParty),
      }),
    emailAddress: Joi.string()
      .empty('')
      .when('contactEmail', {
        is: 'By email',
        then: Joi.required().email(),
        otherwise: Joi.optional().email(),
      })
      .messages({
        'any.required': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_DETAILS.EMAIL_CHECK_MISSING', req.session.user.thirdParty),
        'string.email': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_DETAILS.EMAIL_CHECK_INVALID', req.session.user.thirdParty),
      }),
    emailAddressConfirmation: Joi.string()
      .empty('')
      .when('contactEmail', {
        is: 'By email',
        then: Joi.required(),
        otherwise: Joi.optional(),
      })
      .custom((value, helpers) => {
        const body = helpers.state.ancestors[0] || {};
        if (body.contactEmail !== 'By email' || typeof body.emailAddress === 'undefined' || body.emailAddress === '') {
          return value;
        }
        if (value !== body.emailAddress) {
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
