const Joi = require('joi');
const { message } = require('../validation');

const amountPattern = /^[0-9]+(\.[0-9]{1,2})?$/;

const buildRequiredChoiceSchema = (req, messageKey) => Joi.string()
  .trim()
  .empty('')
  .required()
  .messages({
    'any.required': message(req, messageKey),
    'any.only': message(req, messageKey),
    'string.base': message(req, messageKey),
    'string.empty': message(req, messageKey),
  });

const buildCurrencyAmountSchema = (req, missingKey, invalidKey) => Joi.string()
  .trim()
  .empty('')
  .required()
  .pattern(amountPattern)
  .messages({
    'any.required': message(req, missingKey),
    'any.only': message(req, missingKey),
    'string.base': message(req, missingKey),
    'string.empty': message(req, missingKey),
    'string.pattern.base': message(req, invalidKey),
  });

module.exports = {
  amountPattern,
  buildCurrencyAmountSchema,
  buildRequiredChoiceSchema,
};
