const Joi = require('joi');
const filters = require('../../components/filters');
const textsEn = require('../../../client/js/i18n/en.json');
const textsCy = require('../../../client/js/i18n/cy.json');
const { validateJoiSchema } = require('./index');

const postcodePattern = /^(([gG][iI][rR]\s?0[aA]{2})|((([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y]?[0-9][0-9]?)|(([a-pr-uwyzA-PR-UWYZ][0-9][a-hjkstuwA-HJKSTUW])|([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y][0-9][abehmnprv-yABEHMNPRV-Y])))\s?[0-9][abd-hjlnp-uw-zABD-HJLNP-UW-Z]{2}))$/;

const message = (req, key) => filters.translate(
  key + (req.session.user.thirdParty === 'Yes' ? '_OB' : ''),
  (req.session.ulang === 'cy' ? textsCy : textsEn),
);

module.exports = function (req, body) {
  const schema = Joi.object({
    jurorNumber: Joi.string()
      .empty('')
      .required()
      .pattern(/^\d+$/)
      .length(9)
      .messages({
        'any.required': message(req, 'VALIDATION.LOGIN.JUROR_NUMBER_CHECK_SUM'),
        'string.pattern.base': message(req, 'VALIDATION.LOGIN.JUROR_NUMBER_CHECK_SUM'),
        'string.length': message(req, 'VALIDATION.LOGIN.JUROR_NUMBER_CHECK_SUM'),
      }),

    jurorLastName: Joi.string()
      .empty('')
      .required()
      .pattern(/^[^|"]+$/)
      .messages({
        'any.required': message(req, 'VALIDATION.LOGIN.JUROR_CHECK_LAST_NAME_DETAILS'),
        'string.pattern.base': message(req, 'VALIDATION.LOGIN.JUROR_CHECK_LAST_NAME_INVALID'),
      }),

    jurorPostcode: Joi.string()
      .empty('')
      .required()
      .pattern(postcodePattern)
      .messages({
        'any.required': message(req, 'VALIDATION.LOGIN.JUROR_CHECK_POSTCODE_DETAILS'),
        'string.pattern.base': message(req, 'VALIDATION.LOGIN.JUROR_CHECK_POSTCODE_DETAILS_FORMAT'),
      }),
  });

  return validateJoiSchema(schema, body);
};
