const Joi = require('joi');
const { message, validateJoiSchema } = require('./index');
const { name } = require('./regex-patterns');

module.exports = function (req, body) {
  const schema = Joi.object({
    title: Joi.string()
      .empty('')
      .max(10)
      .pattern(name)
      .messages({
        'string.max': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_PERSONAL_DETAILS.TITLE_CHECK_INVALID', req.session.user.thirdParty),
        'string.pattern.base': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_PERSONAL_DETAILS.TITLE_CHECK_INVALID', req.session.user.thirdParty),
      }),
    firstName: Joi.string()
      .empty('')
      .required()
      .max(20)
      .pattern(name)
      .messages({
        'any.required': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_PERSONAL_DETAILS.FIRST_NAME_CHECK_MISSING', req.session.user.thirdParty),
        'any.only': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_PERSONAL_DETAILS.FIRST_NAME_CHECK_MISSING', req.session.user.thirdParty),
        'string.max': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_PERSONAL_DETAILS.FIRST_NAME_CHECK_INVALID', req.session.user.thirdParty),
        'string.pattern.base': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_PERSONAL_DETAILS.FIRST_NAME_CHECK_INVALID', req.session.user.thirdParty),
      }),
    lastName: Joi.string()
      .empty('')
      .required()
      .max(25)
      .pattern(name)
      .messages({
        'any.required': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_PERSONAL_DETAILS.LAST_NAME_CHECK_MISSING', req.session.user.thirdParty),
        'any.only': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_PERSONAL_DETAILS.LAST_NAME_CHECK_MISSING', req.session.user.thirdParty),
        'string.max': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_PERSONAL_DETAILS.LAST_NAME_CHECK_INVALID', req.session.user.thirdParty),
        'string.pattern.base': message(req, 'VALIDATION.ON_BEHALF.THIRD_PARTY_PERSONAL_DETAILS.LAST_NAME_CHECK_INVALID', req.session.user.thirdParty),
      }),
  });

  return validateJoiSchema(schema, body);
};
