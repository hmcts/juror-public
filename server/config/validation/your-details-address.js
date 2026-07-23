const Joi = require('joi');
const { message, validateJoiSchema } = require('./index');
const { name, postcode } = require('./regex-patterns');

module.exports = function (req, body) {
  const schema = Joi.object({
    addressLineOne: Joi.string()
      .empty('')
      .required()
      .max(35)
      .pattern(name)
      .messages({
        'any.required': message(req, 'VALIDATION.YOUR_DETAILS.ADDRESS_LINE_ONE_MISSING', req.session.user.thirdParty),
        'any.only': message(req, 'VALIDATION.YOUR_DETAILS.ADDRESS_LINE_ONE_MISSING', req.session.user.thirdParty),
        'string.max': message(req, 'VALIDATION.YOUR_DETAILS.ADDRESS_LINE_ONE_CHECK', req.session.user.thirdParty),
        'string.pattern.base': message(req, 'VALIDATION.YOUR_DETAILS.ADDRESS_LINE_ONE_CHECK', req.session.user.thirdParty),
      }),
    addressLineTwo: Joi.string()
      .empty('')
      .max(35)
      .pattern(name)
      .messages({
        'string.max': message(req, 'VALIDATION.YOUR_DETAILS.ADDRESS_LINE_TWO_CHECK', req.session.user.thirdParty),
        'string.pattern.base': message(req, 'VALIDATION.YOUR_DETAILS.ADDRESS_LINE_TWO_CHECK', req.session.user.thirdParty),
      }),
    addressLineThree: Joi.string()
      .empty('')
      .max(35)
      .pattern(name)
      .messages({
        'string.max': message(req, 'VALIDATION.YOUR_DETAILS.ADDRESS_LINE_THREE_CHECK', req.session.user.thirdParty),
        'string.pattern.base': message(req, 'VALIDATION.YOUR_DETAILS.ADDRESS_LINE_THREE_CHECK', req.session.user.thirdParty),
      }),
    addressTown: Joi.string()
      .empty('')
      .required()
      .max(35)
      .pattern(name)
      .messages({
        'any.required': message(req, 'VALIDATION.YOUR_DETAILS.ADDRESS_TOWN_MISSING', req.session.user.thirdParty),
        'any.only': message(req, 'VALIDATION.YOUR_DETAILS.ADDRESS_TOWN_MISSING', req.session.user.thirdParty),
        'string.max': message(req, 'VALIDATION.YOUR_DETAILS.ADDRESS_TOWN_CHECK', req.session.user.thirdParty),
        'string.pattern.base': message(req, 'VALIDATION.YOUR_DETAILS.ADDRESS_TOWN_CHECK', req.session.user.thirdParty),
      }),
    addressCounty: Joi.string()
      .empty('')
      .max(35)
      .pattern(name)
      .messages({
        'string.max': message(req, 'VALIDATION.YOUR_DETAILS.ADDRESS_COUNTY_CHECK', req.session.user.thirdParty),
        'string.pattern.base': message(req, 'VALIDATION.YOUR_DETAILS.ADDRESS_COUNTY_CHECK', req.session.user.thirdParty),
      }),
    addressPostcode: Joi.string()
      .empty('')
      .required()
      .max(8)
      .pattern(postcode)
      .messages({
        'any.required': message(req, 'VALIDATION.YOUR_DETAILS.POSTCODE_MISSING', req.session.user.thirdParty),
        'any.only': message(req, 'VALIDATION.YOUR_DETAILS.POSTCODE_MISSING', req.session.user.thirdParty),
        'string.max': message(req, 'VALIDATION.YOUR_DETAILS.POSTCODE_CHECK', req.session.user.thirdParty),
        'string.pattern.base': message(req, 'VALIDATION.YOUR_DETAILS.POSTCODE_CHECK', req.session.user.thirdParty),
      }),
  });

  return validateJoiSchema(schema, body);
};
