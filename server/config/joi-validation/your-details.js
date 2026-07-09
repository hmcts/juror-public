const Joi = require('joi');
const moment = require('moment');
const { message, validateJoiSchema } = require('./index');
const { name, postcode, phone, phoneSpaces } = require('./legacy-patterns');

module.exports = function (req, body) {
  const schema = Joi.object({
    title: Joi.string().empty('').max(10).pattern(name).messages({
      'string.max': message(req, 'VALIDATION.YOUR_DETAILS.TITLE_CHECK_INVALID', req.session.user.thirdParty),
      'string.pattern.base': message(req, 'VALIDATION.YOUR_DETAILS.TITLE_CHECK_INVALID', req.session.user.thirdParty),
    }),
    firstName: Joi.string().empty('').required().max(20).pattern(name).messages({
      'any.required': message(req, 'VALIDATION.YOUR_DETAILS.FIRST_NAME_MISSING', req.session.user.thirdParty),
      'any.only': message(req, 'VALIDATION.YOUR_DETAILS.FIRST_NAME_MISSING', req.session.user.thirdParty),
      'string.max': message(req, 'VALIDATION.YOUR_DETAILS.FIRST_NAME_CHECK', req.session.user.thirdParty),
      'string.pattern.base': message(req, 'VALIDATION.YOUR_DETAILS.FIRST_NAME_CHECK', req.session.user.thirdParty),
    }),
    lastName: Joi.string().empty('').required().max(25).pattern(name).messages({
      'any.required': message(req, 'VALIDATION.YOUR_DETAILS.LAST_NAME_MISSING', req.session.user.thirdParty),
      'any.only': message(req, 'VALIDATION.YOUR_DETAILS.LAST_NAME_MISSING', req.session.user.thirdParty),
      'string.max': message(req, 'VALIDATION.YOUR_DETAILS.LAST_NAME_CHECK', req.session.user.thirdParty),
      'string.pattern.base': message(req, 'VALIDATION.YOUR_DETAILS.LAST_NAME_CHECK', req.session.user.thirdParty),
    }),
    addressLineOne: Joi.string().empty('').required().max(35).pattern(name).messages({
      'any.required': message(req, 'VALIDATION.YOUR_DETAILS.ADDRESS_LINE_ONE_MISSING', req.session.user.thirdParty),
      'any.only': message(req, 'VALIDATION.YOUR_DETAILS.ADDRESS_LINE_ONE_MISSING', req.session.user.thirdParty),
      'string.max': message(req, 'VALIDATION.YOUR_DETAILS.ADDRESS_LINE_ONE_CHECK', req.session.user.thirdParty),
      'string.pattern.base': message(req, 'VALIDATION.YOUR_DETAILS.ADDRESS_LINE_ONE_CHECK', req.session.user.thirdParty),
    }),
    addressLineTwo: Joi.string().empty('').max(35).pattern(name).messages({
      'string.max': message(req, 'VALIDATION.YOUR_DETAILS.ADDRESS_LINE_TWO_CHECK', req.session.user.thirdParty),
      'string.pattern.base': message(req, 'VALIDATION.YOUR_DETAILS.ADDRESS_LINE_TWO_CHECK', req.session.user.thirdParty),
    }),
    addressLineThree: Joi.string().empty('').max(35).pattern(name).messages({
      'string.max': message(req, 'VALIDATION.YOUR_DETAILS.ADDRESS_LINE_THREE_CHECK', req.session.user.thirdParty),
      'string.pattern.base': message(req, 'VALIDATION.YOUR_DETAILS.ADDRESS_LINE_THREE_CHECK', req.session.user.thirdParty),
    }),
    addressTown: Joi.string().empty('').required().max(35).pattern(name).messages({
      'any.required': message(req, 'VALIDATION.YOUR_DETAILS.ADDRESS_TOWN_MISSING', req.session.user.thirdParty),
      'any.only': message(req, 'VALIDATION.YOUR_DETAILS.ADDRESS_TOWN_MISSING', req.session.user.thirdParty),
      'string.max': message(req, 'VALIDATION.YOUR_DETAILS.ADDRESS_TOWN_CHECK', req.session.user.thirdParty),
      'string.pattern.base': message(req, 'VALIDATION.YOUR_DETAILS.ADDRESS_TOWN_CHECK', req.session.user.thirdParty),
    }),
    addressCounty: Joi.string().empty('').max(35).pattern(name).messages({
      'string.max': message(req, 'VALIDATION.YOUR_DETAILS.ADDRESS_COUNTY_CHECK', req.session.user.thirdParty),
      'string.pattern.base': message(req, 'VALIDATION.YOUR_DETAILS.ADDRESS_COUNTY_CHECK', req.session.user.thirdParty),
    }),
    addressPostcode: Joi.string().empty('').required().max(8).pattern(postcode).messages({
      'any.required': message(req, 'VALIDATION.YOUR_DETAILS.POSTCODE_MISSING', req.session.user.thirdParty),
      'any.only': message(req, 'VALIDATION.YOUR_DETAILS.POSTCODE_MISSING', req.session.user.thirdParty),
      'string.max': message(req, 'VALIDATION.YOUR_DETAILS.POSTCODE_CHECK', req.session.user.thirdParty),
      'string.pattern.base': message(req, 'VALIDATION.YOUR_DETAILS.POSTCODE_CHECK', req.session.user.thirdParty),
    }),
    dateOfBirth: Joi.any().custom((value, helpers) => {
      if (!value) {
        return value;
      }
      const dob = moment(value);
      if (!dob.isValid() || dob.diff(moment(), 'days') >= 0) {
        return helpers.error('any.custom');
      }
      return value;
    }).messages({
      'any.custom': message(req, 'VALIDATION.YOUR_DETAILS.DATETIME_PAST_CHECK', req.session.user.thirdParty),
    }),
    primaryPhone: Joi.string().empty('').required().pattern(phoneSpaces).messages({
      'any.required': message(req, 'VALIDATION.YOUR_DETAILS.MAIN_PHONE_MISSING', req.session.user.thirdParty),
      'any.only': message(req, 'VALIDATION.YOUR_DETAILS.MAIN_PHONE_MISSING', req.session.user.thirdParty),
      'string.pattern.base': message(req, 'VALIDATION.YOUR_DETAILS.MAIN_PHONE_CHECK', req.session.user.thirdParty),
    }),
    secondaryPhone: Joi.string().empty('').pattern(phone).messages({
      'string.pattern.base': message(req, 'VALIDATION.YOUR_DETAILS.OTHER_PHONE_CHECK', req.session.user.thirdParty),
    }),
    emailAddress: Joi.string().empty('').required().email().messages({
      'any.required': message(req, 'VALIDATION.YOUR_DETAILS.EMAIL_CHECK_MISSING', req.session.user.thirdParty),
      'any.only': message(req, 'VALIDATION.YOUR_DETAILS.EMAIL_CHECK_MISSING', req.session.user.thirdParty),
      'string.email': message(req, 'VALIDATION.YOUR_DETAILS.EMAIL_CHECK_INVALID', req.session.user.thirdParty),
    }),
    emailAddressConfirmation: Joi.string().empty('').when('emailAddress', {
      is: Joi.exist(),
      then: Joi.required(),
      otherwise: Joi.optional(),
    }).custom((value, helpers) => {
      const bodyValue = helpers.state.ancestors[0] || {};
      if (!bodyValue.emailAddress) {
        return value;
      }
      if (value !== bodyValue.emailAddress) {
        return helpers.error('any.only');
      }
      return value;
    }).messages({
      'any.required': message(req, 'VALIDATION.YOUR_DETAILS.EMAIL_CONFIRM_MISSING', req.session.user.thirdParty),
      'any.only': message(req, 'VALIDATION.YOUR_DETAILS.EMAIL_CHECK_EQUALITY', req.session.user.thirdParty),
    }),
  });

  return validateJoiSchema(schema, body, {
    summaryLinks: {
      addressConfirm: 'addressConfirm-Yes',
    },
  });
};
