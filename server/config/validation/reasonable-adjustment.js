const Joi = require('joi');
const { message, validateJoiSchema } = require('./index');

module.exports = function (req, body) {
  const isThirdParty = req.session.user.thirdParty;

  const schema = Joi.object({
    assistanceNeeded: Joi.string()
      .empty('')
      .required()
      .messages({
        'any.required': message(req, 'VALIDATION.ASSISTANCE.ASSISTANCE_REQUIRED', isThirdParty),
        'any.only': message(req, 'VALIDATION.ASSISTANCE.ASSISTANCE_REQUIRED', isThirdParty),
      }),
    assistanceType: Joi.array()
      .single()
      .when('assistanceNeeded', {
        is: 'Yes',
        then: Joi.required(),
      })
      .messages({
        'any.required': message(req, 'VALIDATION.ASSISTANCE.DISSABILITY_OR_IMPAIRMENT', isThirdParty),
        'any.only': message(req, 'VALIDATION.ASSISTANCE.DISSABILITY_OR_IMPAIRMENT', isThirdParty),
      }),
    assistanceTypeDetails: Joi.string()
      .empty('')
      .max(1000)
      .when('assistanceType', {
        is: Joi.alternatives().try(
          Joi.string().valid('Other'),
          Joi.array().has(Joi.valid('Other')),
        ),
        then: Joi.required(),
      })
      .messages({
        'any.required': message(req, 'VALIDATION.ASSISTANCE.ASSISTANCE_GIVE_DETAILS', isThirdParty),
        'string.max': message(req, 'VALIDATION.ASSISTANCE.ASSISTANCE_OTHER_LENGTH', isThirdParty),
      }),
    assistanceSpecialArrangements: Joi.string()
      .empty('')
      .max(1000)
      .messages({
        'string.max': message(req, 'VALIDATION.ASSISTANCE.SPECIAL_ARRANGEMENTS_LENGTH', isThirdParty),
      }),
  });

  return validateJoiSchema(schema, body, {
    summaryLinks: {
      assistanceNeeded: 'assistanceNeeded-Yes',
      assistanceType: 'assistanceType-mobility',
    },
  });
};
