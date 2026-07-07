const Joi = require('joi');
const { message, validateJoiSchema } = require('./index');

module.exports = function (req, body) {
  const schema = Joi.object({
    thirdParty: Joi.string()
      .empty('')
      .required()
      .messages({
        'any.required': message(req, 'VALIDATION.RESPONDER_TYPE.MISSING'),
      }),
  });

  return validateJoiSchema(schema, body, {
    thirdParty: 'thirdParty_No',
  });
};
