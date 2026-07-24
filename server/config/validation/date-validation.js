const Joi = require('joi');
const moment = require('moment');
const { message } = require('./index');

const dayMonthPattern = /^[0-9]{1,2}$/;
const yearPattern = /^[0-9]{4}$/;

const createDobPartSchema = ({
  req,
  thirdParty,
  max,
  requiredKey,
  invalidKey,
}) => Joi.string()
  .empty('')
  .required()
  .custom((value, helpers) => {
    if (!dayMonthPattern.test(value) || Number(value) < 1 || Number(value) > max) {
      return helpers.error('string.pattern.base');
    }
    return value;
  })
  .messages({
    'any.required': message(req, requiredKey, thirdParty),
    'any.only': message(req, requiredKey, thirdParty),
    'string.pattern.base': message(req, invalidKey, thirdParty),
    'string.empty': message(req, requiredKey, thirdParty),
  });

const buildDateOfBirthSchemas = (req, { missingPrefix = 'VALIDATION.YOUR_DETAILS_CONFIRM', thirdParty }) => Joi.object({
  dobDay: createDobPartSchema({
    req,
    thirdParty,
    max: 31,
    requiredKey: `${missingPrefix}.DAY_MISSING`,
    invalidKey: `${missingPrefix}.DAY_INVALID`,
  }),
  dobMonth: createDobPartSchema({
    req,
    thirdParty,
    max: 12,
    requiredKey: `${missingPrefix}.MONTH_MISSING`,
    invalidKey: `${missingPrefix}.MONTH_INVALID`,
  }),
  dobYear: Joi.string()
    .empty('')
    .required()
    .custom((value, helpers) => {
      if (!yearPattern.test(value)) {
        return helpers.error('string.pattern.base');
      }
      return value;
    })
    .messages({
      'any.required': message(req, `${missingPrefix}.YEAR_MISSING`, thirdParty),
      'any.only': message(req, `${missingPrefix}.YEAR_MISSING`, thirdParty),
      'string.pattern.base': message(req, `${missingPrefix}.YEAR_INVALID`, thirdParty),
      'string.empty': message(req, `${missingPrefix}.YEAR_MISSING`, thirdParty),
    }),
  dateOfBirth: Joi.any()
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
      'any.custom': message(req, `${missingPrefix}.INVALID_DATE`, thirdParty),
    }),
});

const buildPastDateSchema = (req, {
  thirdParty,
  messageKey,
  requiredMessageKey,
  required = false,
}) => {
  let schema = Joi.any();

  if (required) {
    schema = schema.required();
  }

  return schema
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
      'any.required': message(req, requiredMessageKey || messageKey, thirdParty),
      'any.only': message(req, requiredMessageKey || messageKey, thirdParty),
      'any.custom': message(req, messageKey, thirdParty),
    });
};

module.exports = {
  buildDateOfBirthSchemas,
  buildPastDateSchema,
};
