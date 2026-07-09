const Joi = require('joi');
const moment = require('moment');
const { message, validateJoiSchema } = require('./index');
const { dayMonth, year } = require('./legacy-patterns');

const buildDobSchema = (req) => {
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
      'any.required': message(req, 'VALIDATION.YOUR_DETAILS_CONFIRM.DAY_MISSING', req.session.user.thirdParty),
      'any.only': message(req, 'VALIDATION.YOUR_DETAILS_CONFIRM.DAY_MISSING', req.session.user.thirdParty),
      'string.pattern.base': message(req, 'VALIDATION.YOUR_DETAILS_CONFIRM.DAY_INVALID', req.session.user.thirdParty),
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
      'any.required': message(req, 'VALIDATION.YOUR_DETAILS_CONFIRM.MONTH_MISSING', req.session.user.thirdParty),
      'any.only': message(req, 'VALIDATION.YOUR_DETAILS_CONFIRM.MONTH_MISSING', req.session.user.thirdParty),
      'string.pattern.base': message(req, 'VALIDATION.YOUR_DETAILS_CONFIRM.MONTH_INVALID', req.session.user.thirdParty),
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
      'any.required': message(req, 'VALIDATION.YOUR_DETAILS_CONFIRM.YEAR_MISSING', req.session.user.thirdParty),
      'any.only': message(req, 'VALIDATION.YOUR_DETAILS_CONFIRM.YEAR_MISSING', req.session.user.thirdParty),
      'string.pattern.base': message(req, 'VALIDATION.YOUR_DETAILS_CONFIRM.YEAR_INVALID', req.session.user.thirdParty),
    });

  const dateSchema = Joi.any()
    .custom((value, helpers) => {
      if (!value) {
        return value;
      }

      const dob = moment(value);
      if (!dob.isValid() || dob.diff(moment(), 'days') >= 0) {
        return helpers.error('any.custom');
      }

      return value;
    })
    .messages({
      'any.custom': message(req, 'VALIDATION.YOUR_DETAILS_CONFIRM.INVALID_DATE', req.session.user.thirdParty),
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
