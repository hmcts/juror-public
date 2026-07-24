const Joi = require('joi');
const moment = require('moment');
const { message } = require('./index');
const filters = require('../../components/filters');

const deferralDatePattern = /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/;

const parseStrictDate = (value, format) => {
  if (moment.isMoment(value)) {
    return value.clone();
  }

  if (value instanceof Date) {
    return moment(value);
  }

  return moment(value, format, true);
};

const formatDisplayDate = (req, value) => filters.translateDate(
  moment(value).format('DD/MM/YYYY'),
  'DD/MM/YYYY',
  'D MMMM YYYY',
  req.session.ulang,
);

const messageWithDateRange = (req, key, thirdParty, earliestDate, latestDate) => {
  const translated = message(req, key, thirdParty);

  return translated
    .replace('[earliestDate]', formatDisplayDate(req, earliestDate))
    .replace('[latestDate]', formatDisplayDate(req, latestDate));
};

const buildDeferralDateSchema = (req, {
  thirdParty,
  missingKey,
  invalidKey,
  rangeKey,
}) => Joi.string()
  .empty('')
  .required()
  .custom((value, helpers) => {
    const data = helpers.state.ancestors[0] || {};
    const date = parseStrictDate(value, 'DD/MM/YYYY');
    const earliest = data.earliestDate;
    const latest = data.latestDate;
    const jurorDOB = parseStrictDate(data.jurorDOB);
    const ageLimit = data.ageLimit;
    const ageDateLimit = jurorDOB.clone().add(ageLimit, 'years');

    if (!value.trim()) {
      return helpers.error('any.required');
    }

    if (!deferralDatePattern.test(value) || !date.isValid() || date.isoWeekday() !== 1) {
      return helpers.error('string.pattern.base');
    }

    if (moment(date).isBefore(earliest)) {
      return helpers.error('date.lower', {
        rangeMessage: messageWithDateRange(req, rangeKey, thirdParty, earliest, latest),
      });
    }

    if (moment(date).isAfter(latest)) {
      return helpers.error('date.upper', {
        rangeMessage: messageWithDateRange(req, rangeKey, thirdParty, earliest, latest),
      });
    }

    if (date.isSameOrAfter(ageDateLimit)) {
      return helpers.error('date.age');
    }

    const allDates = ['date1', 'date2', 'date3']
      .map((key) => data[key])
      .filter((val) => typeof val !== 'undefined' && val.trim() !== '');

    const duplicates = allDates.filter((other) => parseStrictDate(other, 'DD/MM/YYYY').isSame(date));
    if (duplicates.length > 1) {
      return helpers.error('date.unique');
    }

    return value;
  })
  .messages({
    'any.required': message(req, missingKey, thirdParty),
    'any.only': message(req, missingKey, thirdParty),
    'string.pattern.base': message(req, invalidKey, thirdParty),
    'date.lower': '{{#rangeMessage}}',
    'date.upper': '{{#rangeMessage}}',
    'date.age': message(req, 'VALIDATION.DEFERRAL.DATE_AGE', thirdParty),
    'date.unique': message(req, 'VALIDATION.DEFERRAL.DATE_UNIQUE', thirdParty),
  });

module.exports = {
  buildDeferralDateSchema,
};
