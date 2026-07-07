const filters = require('../../components/filters');
const textsEn = require('../../../client/js/i18n/en.json');
const textsCy = require('../../../client/js/i18n/cy.json');

const validationOptions = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};

module.exports.message = (req, key, thirdParty = false) => filters.translate(
  key + (thirdParty === 'Yes' ? '_OB' : ''),
  (req.session.ulang === 'cy' ? textsCy : textsEn),
);

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

module.exports.validateJoiSchema = (schema, body, summaryLinks) => {
  const validationResult = schema.validate(body, validationOptions);

  return applySummaryLinks(validationResultToErrorMap(validationResult), summaryLinks);
};
