const Joi = require('joi');
const { message, validateJoiSchema } = require('./index');
const { postcode } = require('./regex-patterns');

module.exports = function (req, body) {
  const schema = Joi.object({
    jurorNumber: Joi.string()
      .empty('')
      .required()
      .pattern(/^\d+$/)
      .length(9)
      .messages({
        'any.required': message(req, 'VALIDATION.LOGIN.JUROR_NUMBER_CHECK_SUM', req.session.user.thirdParty),
        'string.pattern.base': message(req, 'VALIDATION.LOGIN.JUROR_NUMBER_CHECK_SUM', req.session.user.thirdParty),
        'string.length': message(req, 'VALIDATION.LOGIN.JUROR_NUMBER_CHECK_SUM', req.session.user.thirdParty),
      }),

    jurorLastName: Joi.string()
      .empty('')
      .required()
      .pattern(/^[^|"]+$/)
      .messages({
        'any.required': message(req, 'VALIDATION.LOGIN.JUROR_CHECK_LAST_NAME_DETAILS', req.session.user.thirdParty),
        'string.pattern.base': message(req, 'VALIDATION.LOGIN.JUROR_CHECK_LAST_NAME_INVALID', req.session.user.thirdParty),
      }),

    jurorPostcode: Joi.string()
      .empty('')
      .required()
      .pattern(postcode)
      .messages({
        'any.required': message(req, 'VALIDATION.LOGIN.JUROR_CHECK_POSTCODE_DETAILS', req.session.user.thirdParty),
        'string.pattern.base': message(req, 'VALIDATION.LOGIN.JUROR_CHECK_POSTCODE_DETAILS_FORMAT', req.session.user.thirdParty),
      }),
  });

  return validateJoiSchema(schema, body);
};
