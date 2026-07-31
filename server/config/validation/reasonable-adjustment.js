const Joi = require('joi');
const { message, validateJoiSchema } = require('./index');

module.exports = function (req, body) {
  const isThirdParty = req.session.user.thirdParty;
  const getAssistanceTypes = (value) => {
    if (typeof value === 'undefined' || value === null) {
      return [];
    }

    return Array.isArray(value) ? value : [value];
  };

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
        otherwise: Joi.optional(),
      })
      .messages({
        'any.required': message(req, 'VALIDATION.ASSISTANCE.DISSABILITY_OR_IMPAIRMENT', isThirdParty),
        'any.only': message(req, 'VALIDATION.ASSISTANCE.DISSABILITY_OR_IMPAIRMENT', isThirdParty),
      }),
    assistanceTypeDetails: Joi.when('assistanceNeeded', {
      is: 'Yes',
      then: Joi.any()
        .custom((value, helpers) => {
          const assistanceTypes = getAssistanceTypes(helpers.state.ancestors[0].assistanceType);
          const hasOther = assistanceTypes.includes('Other');
          const hasDetails = typeof value === 'string' && value.trim().length > 0;

          if (hasOther && !hasDetails) {
            return helpers.error('any.required');
          }

          if (typeof value === 'string' && value.length > 1000) {
            return helpers.error('string.max');
          }

          return value;
        })
        .messages({
          'any.required': message(req, 'VALIDATION.ASSISTANCE.ASSISTANCE_GIVE_DETAILS', isThirdParty),
          'string.max': message(req, 'VALIDATION.ASSISTANCE.ASSISTANCE_OTHER_LENGTH', isThirdParty),
        }),
      otherwise: Joi.any().strip(),
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
