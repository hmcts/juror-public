const Joi = require('joi');
const { message, validateJoiSchema } = require('./index');

module.exports = function (req, body) {
  const schema = Joi.object({
    firstName: Joi.string()
      .empty('')
      .required()
      .max(50)
      .messages({
        'any.required': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_DETAILS.FIRST_NAME_CHECK_MISSING', req.session.user.thirdParty),
        'any.only': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_DETAILS.FIRST_NAME_CHECK_MISSING', req.session.user.thirdParty),
        'string.max': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_DETAILS.FIRST_NAME_CHECK_INVALID', req.session.user.thirdParty),
      }),
    lastName: Joi.string()
      .empty('')
      .required()
      .max(50)
      .messages({
        'any.required': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_DETAILS.LAST_NAME_CHECK_MISSING', req.session.user.thirdParty),
        'any.only': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_DETAILS.LAST_NAME_CHECK_MISSING', req.session.user.thirdParty),
        'string.max': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_DETAILS.LAST_NAME_CHECK_INVALID', req.session.user.thirdParty),
      }),
  });

  return validateJoiSchema(schema, body);
};
