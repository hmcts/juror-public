const filters = require('../../components/filters');
const textsEn = require('../../../client/js/i18n/en.json');
const textsCy = require('../../../client/js/i18n/cy.json');

const defaultValidationOptions = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};

module.exports.message = (req, key, thirdParty = false) => {
  let translation;

  translation = filters.translate(
    key + (thirdParty === 'Yes' ? '_OB' : ''),
    (req.session.ulang === 'cy' ? textsCy : textsEn),
  );

  if (!translation || translation === '') {
    translation = filters.translate(
      key,
      (req.session.ulang === 'cy' ? textsCy : textsEn),
    );
  }
  
  return translation;
};

const validationResultToErrorMap = (validationResult) => {
  if (!validationResult.error) {
    return undefined;
  }

  return validationResult.error.details.reduce((errors, detail) => {
    const key = detail.path.join('.') || detail.context?.label || 'form';

    if (!errors[key]) {
      errors[key] = [{
        summary: detail.message,
        details: detail.message,
      }];
    }

    return errors;
  }, {});
};

const normaliseSummaryMessage = (message) => {
  if (typeof message === 'undefined') {
    return undefined;
  }

  if (Array.isArray(message)) {
    return typeof message[0] !== 'undefined' ? message[0] : message[1];
  }

  if (typeof message === 'object' && message !== null) {
    return typeof message.summary !== 'undefined' ? message.summary : message.details;
  }

  return message;
};

const applyMessages = (errors, messages) => {
  if (typeof errors === 'undefined' || typeof messages === 'undefined') {
    return errors;
  }

  return Object.keys(errors).reduce((mappedErrors, key) => {
    const message = typeof messages === 'function'
      ? messages(key, errors[key])
      : messages[key];

    const normalisedMessage = normaliseSummaryMessage(message);

    if (typeof normalisedMessage !== 'undefined') {
      mappedErrors[key][0].summary = normalisedMessage;
    }

    return mappedErrors;
  }, errors);
};

const applySummaryLinks = (errors, summaryLinks) => {
  if (typeof errors === 'undefined' || typeof summaryLinks === 'undefined') {
    return errors;
  }

  return Object.keys(errors).reduce((mappedErrors, key) => {
    const summaryLink = typeof summaryLinks === 'function'
      ? summaryLinks(key, errors[key])
      : summaryLinks[key];

    if (typeof summaryLink !== 'undefined') {
      mappedErrors[key][0].summaryLink = summaryLink;
    }

    return mappedErrors;
  }, errors);
};

module.exports.validateJoiSchema = (schema, body, options) => {
  const { errorMessageSummary, summaryLinks, validationOptions: customValidationOptions } = options || {};
  const validationOptions = { ...defaultValidationOptions, ...customValidationOptions };
  const validationResult = schema.validate(body, validationOptions);
  const errors = validationResultToErrorMap(validationResult);

  return applySummaryLinks(applyMessages(errors, errorMessageSummary), summaryLinks);
};
