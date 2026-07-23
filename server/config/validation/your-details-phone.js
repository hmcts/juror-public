const Joi = require('joi');
const { message, validateJoiSchema } = require('./index');
const { phoneSpaces, phone } = require('./regex-patterns');

module.exports = function (req, body) {
  const schema = Joi.object({
    primaryPhone: Joi.string()
      .empty('')
      .required()
      .pattern(phoneSpaces)
      .messages({
        'any.required': message(req, 'VALIDATION.YOUR_DETAILS.MAIN_PHONE_MISSING', req.session.user.thirdParty),
        'any.only': message(req, 'VALIDATION.YOUR_DETAILS.MAIN_PHONE_MISSING', req.session.user.thirdParty),
        'string.pattern.base': message(req, 'VALIDATION.YOUR_DETAILS.MAIN_PHONE_CHECK', req.session.user.thirdParty),
      }),
    secondaryPhone: Joi.string()
      .empty('')
      .pattern(phone)
      .messages({
        'string.pattern.base': message(req, 'VALIDATION.YOUR_DETAILS.OTHER_PHONE_CHECK', req.session.user.thirdParty),
      }),
  });

  return validateJoiSchema(schema, body);
};
