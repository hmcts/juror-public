const Joi = require('joi');
const { message } = require('../validation');

const buildCurrencyAmountSchema = (req, missingKey, invalidKey) => Joi.string()
  .trim()
  .empty('')
  .required()
  .pattern(/^[0-9]+(\.[0-9]{1,2})?$/)
  .messages({
    'any.required': message(req, missingKey),
    'any.only': message(req, missingKey),
    'string.base': message(req, missingKey),
    'string.empty': message(req, missingKey),
    'string.pattern.base': message(req, invalidKey),
  });

module.exports = {
  buildCurrencyAmountSchema,
};
