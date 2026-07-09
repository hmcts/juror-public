const Joi = require('joi');
const { message, validateJoiSchema } = require('./index');
const { name, postcode } = require('./legacy-patterns');
const { buildPastDateSchema } = require('./date-validation');

module.exports = function (req, body) {
  const isThirdParty = req.session.user.thirdParty;

  const schema = Joi.object({
    title: Joi.string()
      .empty('')
      .max(10)
      .pattern(name)
      .messages({
        'string.max': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_PERSONAL_DETAILS.TITLE_CHECK_INVALID', isThirdParty),
        'string.pattern.base': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_PERSONAL_DETAILS.TITLE_CHECK_INVALID', isThirdParty),
      }),
    firstName: Joi.string()
      .empty('')
      .required()
      .max(20)
      .pattern(name)
      .messages({
        'any.required': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_PERSONAL_DETAILS.FIRST_NAME_CHECK_MISSING', isThirdParty),
        'any.only': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_PERSONAL_DETAILS.FIRST_NAME_CHECK_MISSING', isThirdParty),
        'string.max': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_PERSONAL_DETAILS.FIRST_NAME_CHECK_INVALID', isThirdParty),
        'string.pattern.base': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_PERSONAL_DETAILS.FIRST_NAME_CHECK_INVALID', isThirdParty),
      }),
    lastName: Joi.string()
      .empty('')
      .required()
      .max(25)
      .pattern(name)
      .messages({
        'any.required': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_PERSONAL_DETAILS.LAST_NAME_CHECK_MISSING', isThirdParty),
        'any.only': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_PERSONAL_DETAILS.LAST_NAME_CHECK_MISSING', isThirdParty),
        'string.max': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_PERSONAL_DETAILS.LAST_NAME_CHECK_INVALID', isThirdParty),
        'string.pattern.base': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_PERSONAL_DETAILS.LAST_NAME_CHECK_INVALID', isThirdParty),
      }),
    addressLineOne: Joi.string()
      .empty('')
      .required()
      .pattern(name)
      .messages({
        'any.required': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_PERSONAL_DETAILS.ADDRESS_LINE_ONE_MISSING', isThirdParty),
        'any.only': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_PERSONAL_DETAILS.ADDRESS_LINE_ONE_MISSING', isThirdParty),
        'string.pattern.base': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_PERSONAL_DETAILS.ADDRESS_LINE_ONE_CHECK_INVALID', isThirdParty),
      }),
    addressLineTwo: Joi.string()
      .empty('')
      .pattern(name)
      .messages({
        'string.pattern.base': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_PERSONAL_DETAILS.ADDRESS_LINE_TWO_CHECK_INVALID', isThirdParty),
      }),
    addressLineThree: Joi.string()
      .empty('')
      .pattern(name)
      .messages({
        'string.pattern.base': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_PERSONAL_DETAILS.ADDRESS_LINE_THREE_CHECK_INVALID', isThirdParty),
      }),
    addressTown: Joi.string()
      .empty('')
      .required()
      .pattern(name)
      .messages({
        'any.required': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_PERSONAL_DETAILS.ADDRESS_TOWN_CHECK_MISSING', isThirdParty),
        'any.only': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_PERSONAL_DETAILS.ADDRESS_TOWN_CHECK_MISSING', isThirdParty),
        'string.pattern.base': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_PERSONAL_DETAILS.ADDRESS_TOWN_CHECK_INVALID', isThirdParty),
      }),
    addressCounty: Joi.string()
      .empty('')
      .pattern(name)
      .messages({
        'string.pattern.base': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_PERSONAL_DETAILS.ADDRESS_COUNTY_CHECK_INVALID', isThirdParty),
      }),
    addressPostcode: Joi.string()
      .empty('')
      .required()
      .pattern(postcode)
      .messages({
        'any.required': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_PERSONAL_DETAILS.ADDRESS_POSTCODE_CHECK_MISSING', isThirdParty),
        'any.only': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_PERSONAL_DETAILS.ADDRESS_POSTCODE_CHECK_MISSING', isThirdParty),
        'string.pattern.base': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_PERSONAL_DETAILS.ADDRESS_POSTCODE_CHECK_INVALID', isThirdParty),
      }),
    dateOfBirth: buildPastDateSchema(req, {
      thirdParty: false,
      required: true,
      requiredMessageKey: 'VALIDATION.DATETIME_OB',
      messageKey: 'VALIDATION.YOUR_DETAILS.DATETIME_PAST_CHECK',
    }),
  });

  return validateJoiSchema(schema, body);
};
