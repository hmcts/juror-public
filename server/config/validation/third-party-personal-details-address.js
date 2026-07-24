const Joi = require('joi');
const { message, validateJoiSchema } = require('./index');
const { name, postcode } = require('./custom-validation').regexPatterns;
const { optionalString } = require('./custom-validation');

module.exports = function (req, body) {
  const schema = Joi.object({
    addressLineOne: Joi.string()
      .empty('')
      .required()
      .pattern(name)
      .messages({
        'any.required': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_PERSONAL_DETAILS.ADDRESS_LINE_ONE_MISSING', req.session.user.thirdParty),
        'any.only': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_PERSONAL_DETAILS.ADDRESS_LINE_ONE_MISSING', req.session.user.thirdParty),
        'string.pattern.base': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_PERSONAL_DETAILS.ADDRESS_LINE_ONE_CHECK_INVALID', req.session.user.thirdParty),
      }),
    addressLineTwo: optionalString()
      .pattern(name)
      .messages({
        'string.pattern.base': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_PERSONAL_DETAILS.ADDRESS_LINE_TWO_CHECK_INVALID', req.session.user.thirdParty),
      }),
    addressLineThree: optionalString()
      .pattern(name)
      .messages({
        'string.pattern.base': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_PERSONAL_DETAILS.ADDRESS_LINE_THREE_CHECK_INVALID', req.session.user.thirdParty),
      }),
    addressTown: Joi.string()
      .empty('')
      .required()
      .pattern(name)
      .messages({
        'any.required': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_PERSONAL_DETAILS.ADDRESS_TOWN_CHECK_MISSING', req.session.user.thirdParty),
        'any.only': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_PERSONAL_DETAILS.ADDRESS_TOWN_CHECK_MISSING', req.session.user.thirdParty),
        'string.pattern.base': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_PERSONAL_DETAILS.ADDRESS_TOWN_CHECK_INVALID', req.session.user.thirdParty),
      }),
    addressCounty: optionalString()
      .pattern(name)
      .messages({
        'string.pattern.base': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_PERSONAL_DETAILS.ADDRESS_COUNTY_CHECK_INVALID', req.session.user.thirdParty),
      }),
    addressPostcode: Joi.string()
      .empty('')
      .required()
      .pattern(postcode)
      .messages({
        'any.required': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_PERSONAL_DETAILS.ADDRESS_POSTCODE_CHECK_MISSING', req.session.user.thirdParty),
        'any.only': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_PERSONAL_DETAILS.ADDRESS_POSTCODE_CHECK_MISSING', req.session.user.thirdParty),
        'string.pattern.base': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_PERSONAL_DETAILS.ADDRESS_POSTCODE_CHECK_INVALID', req.session.user.thirdParty),
      }),
  });

  return validateJoiSchema(schema, body);
};
