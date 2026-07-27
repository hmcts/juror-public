const Joi = require('joi');
const textsEn = require('../../../client/js/i18n/en');
const textsCy = require('../../../client/js/i18n/cy');
const { message, validateJoiSchema } = require('./index');

module.exports = function (req, body) {
  const yesValue = (req.session.ulang === 'cy' ? textsCy.QUALIFY_PAGE.YES : textsEn.QUALIFY_PAGE.YES);

  const schema = Joi.object({
    mentalHealthCapacity: Joi.string()
      .empty('')
      .required()
      .messages({
        'any.required': message(req, 'VALIDATION.QUALIFY.MENTAL_HEALTH_CAPACITY', req.session.user.thirdParty),
        'any.only': message(req, 'VALIDATION.QUALIFY.MENTAL_HEALTH_CAPACITY', req.session.user.thirdParty),
      }),

    mentalHealthCapacityDetails: Joi.string()
      .empty('')
      .max(1000)
      .when('mentalHealthCapacity', {
        is: yesValue,
        then: Joi.required(),
      })
      .messages({
        'any.required': message(req, 'VALIDATION.QUALIFY.MENTAL_HEALTH_CAPACITY_DETAILS', req.session.user.thirdParty),
        'string.max': message(req, 'VALIDATION.QUALIFY.MENTAL_HEALTH_CAPACITY_LENGTH', req.session.user.thirdParty),
      }),
  });

  return validateJoiSchema(schema, body, {
    summaryLinks: {
      mentalHealthCapacity: 'mentalHealthCapacity-Yes',
    },
  });
};
