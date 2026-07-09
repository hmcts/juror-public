const Joi = require('joi');
const moment = require('moment');
const { message, validateJoiSchema } = require('./index');

const isMonday = (value) => moment(value, 'DD/MM/YYYY').isValid() && moment(value, 'DD/MM/YYYY').isoWeekday() === 1;

module.exports = function (req, body) {
  const isThirdParty = req.session.user.thirdParty;

  const buildDateSchema = (dateKey, fieldKey, missingKey, invalidKey, rangeKey) => Joi.string()
    .empty('')
    .required()
    .custom((value, helpers) => {
      const data = helpers.state.ancestors[0] || {};
      const date = moment(value, 'DD/MM/YYYY');
      const earliest = data.earliestDate;
      const latest = data.latestDate;
      const jurorDOB = moment(data.jurorDOB);
      const ageLimit = data.ageLimit;
      const ageDateLimit = jurorDOB.clone().add(ageLimit, 'years');

      if (!value.trim()) {
        return helpers.error('any.required');
      }

      if (!/^([0-9]{2}\/[0-9]{2}\/[0-9]{4})$/.test(value) || !date.isValid() || !isMonday(value)) {
        return helpers.error('string.pattern.base');
      }

      if (moment(date).isBefore(earliest)) {
        return helpers.error('date.lower');
      }

      if (moment(date).isAfter(latest)) {
        return helpers.error('date.upper');
      }

      if (date.isSameOrAfter(ageDateLimit)) {
        return helpers.error('date.age');
      }

      const others = ['date1', 'date2', 'date3']
        .filter((key) => key !== dateKey)
        .map((key) => data[key])
        .filter((val) => typeof val !== 'undefined' && val.trim() !== '');

      if (others.some((other) => moment(other, 'DD/MM/YYYY').isSame(date))) {
        return helpers.error('date.unique');
      }

      return value;
    })
    .messages({
      'any.required': message(req, missingKey, isThirdParty),
      'any.only': message(req, missingKey, isThirdParty),
      'string.pattern.base': message(req, invalidKey, isThirdParty),
      'date.lower': message(req, rangeKey, isThirdParty),
      'date.upper': message(req, rangeKey, isThirdParty),
      'date.age': message(req, 'VALIDATION.DEFERRAL.DATE_AGE', isThirdParty),
      'date.unique': message(req, 'VALIDATION.DEFERRAL.DATE_UNIQUE', isThirdParty),
    });

  const schema = Joi.object({
    date1: buildDateSchema('date1', 'date1FieldId', 'VALIDATION.DEFERRAL.DATE_ONE_MISSING', 'VALIDATION.DEFERRAL.DATE_ONE_FORMAT', 'VALIDATION.DEFERRAL.DATE_ONE_RANGE'),
    date2: buildDateSchema('date2', 'date2FieldId', 'VALIDATION.DEFERRAL.DATE_TWO_MISSING', 'VALIDATION.DEFERRAL.DATE_TWO_FORMAT', 'VALIDATION.DEFERRAL.DATE_TWO_RANGE'),
    date3: buildDateSchema('date3', 'date3FieldId', 'VALIDATION.DEFERRAL.DATE_THREE_MISSING', 'VALIDATION.DEFERRAL.DATE_THREE_FORMAT', 'VALIDATION.DEFERRAL.DATE_THREE_RANGE'),
    date1FieldId: Joi.string().optional(),
    date2FieldId: Joi.string().optional(),
    date3FieldId: Joi.string().optional(),
    earliestDate: Joi.any().required(),
    latestDate: Joi.any().required(),
    ageLimit: Joi.number().required(),
    jurorDOB: Joi.any().required(),
  });

  return validateJoiSchema(schema, body, {
    summaryLinks: {
      date1: 'deferDate1',
      date2: 'deferDate2',
      date3: 'deferDate3',
    },
  });
};
