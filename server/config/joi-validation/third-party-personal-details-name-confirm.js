const Joi = require('joi');
const { message, validateJoiSchema } = require('./index');

module.exports = function (req, body) {
  const schema = Joi.object({
    nameConfirm: Joi.string()
      .empty('')
      .required()
      .messages({
        'any.required': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_PERSONAL_DETAILS.NAME_CONFIRM_MISSING', req.session.user.thirdParty),
        'any.only': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_PERSONAL_DETAILS.NAME_CONFIRM_MISSING', req.session.user.thirdParty),
      }),
  });

  return validateJoiSchema(schema, body, {
    summaryLinks: {
      nameConfirm: 'nameConfirm-Yes',
    },
  });
};
