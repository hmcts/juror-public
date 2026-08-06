const Joi = require('joi');
const { message, validateJoiSchema } = require('./index');

module.exports = function (req, body) {
  const schema = Joi.object({
    informationConfirmed: Joi.boolean()
      .valid(true)
      .required()
      .messages({
        'any.required': message(req, 'VALIDATION.CONFIRM_INFO.CONFIRM_CORRECT', req.session.user.thirdParty),
        'any.only': message(req, 'VALIDATION.CONFIRM_INFO.CONFIRM_CORRECT', req.session.user.thirdParty),
      }),
  });

  return validateJoiSchema(schema, body);
};
