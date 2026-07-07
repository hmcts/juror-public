const Joi = require('joi');
const textsEn = require('../../../client/js/i18n/en');
const textsCy = require('../../../client/js/i18n/cy');
const { message, validateJoiSchema } = require('./index');

module.exports = function (req, body) {
  const noValue = (req.session.ulang === 'cy' ? textsCy.QUALIFY_PAGE.NO : textsEn.QUALIFY_PAGE.NO);

  const schema = Joi.object({
    livedConsecutive: Joi.string()
      .empty('')
      .required()
      .messages({
        'any.required': message(req, 'VALIDATION.QUALIFY.WHERE_YOU_LIVE', req.session.user.thirdParty),
        'any.only': message(req, 'VALIDATION.QUALIFY.WHERE_YOU_LIVE', req.session.user.thirdParty),
      }),

    livedConsecutiveDetails: Joi.string()
      .empty('')
      .max(1000)
      .when('livedConsecutive', {
        is: noValue,
        then: Joi.required(),
      })
      .messages({
        'any.required': message(req, 'VALIDATION.QUALIFY.WHERE_YOU_LIVE_DETAILS', req.session.user.thirdParty),
        'string.max': message(req, 'VALIDATION.QUALIFY.WHERE_YOU_LIVE_LENGTH', req.session.user.thirdParty),
      }),
  });

  return validateJoiSchema(schema, body, {
    livedConsecutive: 'livedConsecutive-Yes',
  });
};
