const Joi = require('joi');
const { message, validateJoiSchema } = require('./index');

module.exports = function (req, body) {
  const schema = Joi.object({
    confirmedDate: Joi.string()
      .empty('')
      .required()
      .messages({
        'any.required': message(req, 'VALIDATION.CONFIRM_DATE.CONFIRM', req.session.user.thirdParty),
        'any.only': message(req, 'VALIDATION.CONFIRM_DATE.CONFIRM', req.session.user.thirdParty),
      }),
  });

  return validateJoiSchema(schema, body);
};
