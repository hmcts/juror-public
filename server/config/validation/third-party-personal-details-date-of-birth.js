const { validateJoiSchema } = require('./index');
const { buildDateOfBirthSchemas } = require('./date-validation');

module.exports = function (req, body) {
  return validateJoiSchema(buildDateOfBirthSchemas(req, {
    thirdParty: req.session.user.thirdParty,
    missingPrefix: 'VALIDATION.YOUR_DETAILS_CONFIRM',
  }), body, {
    summaryLinks: {
      dobDay: 'dobDay',
      dobMonth: 'dobMonth',
      dobYear: 'dobYear',
      dateOfBirth: 'dobDay',
    },
  });
};
