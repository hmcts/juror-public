const Joi = require('joi');
const { message, validateJoiSchema } = require('./index');

module.exports = function (req, body) {
  const schema = Joi.object({
    addressConfirm: Joi.string()
      .empty('')
      .required()
      .messages({
        'any.required': message(req, 'VALIDATION.YOUR_DETAILS.ADDRESS_CONFIRM_MISSING', req.session.user.thirdParty),
        'any.only': message(req, 'VALIDATION.YOUR_DETAILS.ADDRESS_CONFIRM_MISSING', req.session.user.thirdParty),
      }),
  });

  return validateJoiSchema(schema, body, {
    summaryLinks: {
      addressConfirm: 'addressConfirm-Yes',
    },
  });
};
