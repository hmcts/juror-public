const Joi = require('joi');
const moment = require('moment');
const { message, validateJoiSchema } = require('./index');
const { dayMonth, year } = require('./legacy-patterns');

const buildDobSchema = (req) => {
  const isThirdParty = req.session.user.thirdParty;

  const daySchema = Joi.string()
    .empty('')
    .required()
    .custom((value, helpers) => {
      if (!dayMonth.test(value) || Number(value) < 1 || Number(value) > 31) {
        return helpers.error('string.pattern.base');
      }
      return value;
    })
    .messages({
      'any.required': message(req, 'VALIDATION.YOUR_DETAILS_CONFIRM.DAY_MISSING', isThirdParty),
      'any.only': message(req, 'VALIDATION.YOUR_DETAILS_CONFIRM.DAY_MISSING', isThirdParty),
      'string.pattern.base': message(req, 'VALIDATION.YOUR_DETAILS_CONFIRM.DAY_INVALID', isThirdParty),
    });

  const monthSchema = Joi.string()
    .empty('')
    .required()
    .custom((value, helpers) => {
      if (!dayMonth.test(value) || Number(value) < 1 || Number(value) > 12) {
        return helpers.error('string.pattern.base');
      }
      return value;
    })
    .messages({
      'any.required': message(req, 'VALIDATION.YOUR_DETAILS_CONFIRM.MONTH_MISSING', isThirdParty),
      'any.only': message(req, 'VALIDATION.YOUR_DETAILS_CONFIRM.MONTH_MISSING', isThirdParty),
      'string.pattern.base': message(req, 'VALIDATION.YOUR_DETAILS_CONFIRM.MONTH_INVALID', isThirdParty),
    });

  const yearSchema = Joi.string()
    .empty('')
    .required()
    .custom((value, helpers) => {
      if (!year.test(value)) {
        return helpers.error('string.pattern.base');
      }
      return value;
    })
    .messages({
      'any.required': message(req, 'VALIDATION.YOUR_DETAILS_CONFIRM.YEAR_MISSING', isThirdParty),
      'any.only': message(req, 'VALIDATION.YOUR_DETAILS_CONFIRM.YEAR_MISSING', isThirdParty),
      'string.pattern.base': message(req, 'VALIDATION.YOUR_DETAILS_CONFIRM.YEAR_INVALID', isThirdParty),
    });

  const dateSchema = Joi.any()
    .custom((value, helpers) => {
      if (!value) {
        return value;
      }

      const dob = moment(value);
      const body = helpers.state.ancestors[0] || {};
      if (!dob.isValid() || dob.diff(moment(), 'days') >= 0 || !body.dobDay || !body.dobMonth || !body.dobYear) {
        return helpers.error('any.custom');
      }

      return value;
    })
    .messages({
      'any.custom': message(req, 'VALIDATION.YOUR_DETAILS_CONFIRM.INVALID_DATE', isThirdParty),
    });

  return Joi.object({
    dobDay: daySchema,
    dobMonth: monthSchema,
    dobYear: yearSchema,
    dateOfBirth: dateSchema,
  });
};

module.exports = function (req, body) {
  return validateJoiSchema(buildDobSchema(req), body, {
    summaryLinks: {
      dobDay: 'dobDay',
      dobMonth: 'dobMonth',
      dobYear: 'dobYear',
      dateOfBirth: 'dobDay',
    },
  });
};
