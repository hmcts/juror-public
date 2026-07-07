const Joi = require('joi');
const textsEn = require('../../../client/js/i18n/en.json');
const textsCy = require('../../../client/js/i18n/cy.json');
const { message, validateJoiSchema } = require('./index');

module.exports = function (req, body) {
  const yesValue = (req.session.ulang === 'cy' ? textsCy.QUALIFY_PAGE.YES : textsEn.QUALIFY_PAGE.YES);
  const noValue = (req.session.ulang === 'cy' ? textsCy.QUALIFY_PAGE.NO : textsEn.QUALIFY_PAGE.NO);

  const schema = Joi.object({
    onBail: Joi.string()
      .valid(yesValue, noValue)
      .required()
      .messages({
        'any.required': message(req, 'VALIDATION.QUALIFY.ON_BAIL', req.session.user.thirdParty),
        'any.only': message(req, 'VALIDATION.QUALIFY.ON_BAIL', req.session.user.thirdParty),
      }),

    onBailDetails: Joi.string()
      .empty('')
      .max(1000)
      .when('onBail', {
        is: yesValue,
        then: Joi.required(),
      })
      .messages({
        'any.required': message(req, 'VALIDATION.QUALIFY.ON_BAIL_DETAILS', req.session.user.thirdParty),
        'string.max': message(req, 'VALIDATION.QUALIFY.ON_BAIL_LENGTH', req.session.user.thirdParty),
      }),
  });

  return validateJoiSchema(schema, body, {
    onBail: 'onBail-Yes',
  });
};
