const validationOptions = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
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

module.exports.validateJoiSchema = (schema, body) => {
  const validationResult = schema.validate(body, validationOptions);

  return validationResultToErrorMap(validationResult);
};
