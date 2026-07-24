const Joi = require('joi');
const textsEn = require('../../../client/js/i18n/en.json');
const textsCy = require('../../../client/js/i18n/cy.json');
const { message, validateJoiSchema } = require('./index');
const { optionalString } = require('./custom-validation');

const cjsEmployerValues = [
  'Police Force',
  'HM Prison Service',
  'National Crime Agency',
  'Judiciary',
  'HMCTS',
  'Other',
];

const employerIncludes = (employerValue) => Joi.alternatives().try(
  Joi.string().valid(employerValue),
  Joi.array().has(Joi.valid(employerValue)),
);

module.exports = function (req, body) {
  const yesValue = (req.session.ulang === 'cy' ? textsCy.EMPLOYED_PAGE.YES : textsEn.EMPLOYED_PAGE.YES);

  const employerSchema = Joi.object({
    cjsEmployed: Joi.string()
      .empty('')
      .required()
      .messages({
        'any.required': message(req, 'VALIDATION.CJS_EMPLOYED.EMPLOYED', req.session.user.thirdParty),
        'any.only': message(req, 'VALIDATION.CJS_EMPLOYED.EMPLOYED', req.session.user.thirdParty),
      }),

    cjsEmployer: Joi.array()
      .items(Joi.string().valid(...cjsEmployerValues))
      .single()
      .when('cjsEmployed', {
        is: yesValue,
        then: Joi.required(),
      })
      .messages({
        'any.required': message(req, 'VALIDATION.CJS_EMPLOYED.CHOOSE_ONE_OR_MORE', req.session.user.thirdParty),
        'any.only': message(req, 'VALIDATION.CJS_EMPLOYED.CHOOSE_ONE_OR_MORE', req.session.user.thirdParty),
      }),
  });

  const detailsSchema = Joi.object({
    cjsPoliceDetails: optionalString()
      .max(1000)
      .when('cjsEmployer', {
        is: employerIncludes('Police Force'),
        then: Joi.required(),
        otherwise: Joi.optional(),
      })
      .messages({
        'any.required': message(req, 'VALIDATION.CJS_EMPLOYED.POLICE', req.session.user.thirdParty),
        'string.max': message(req, 'VALIDATION.CJS_EMPLOYED.POLICE_DETAILS_LENGTH', req.session.user.thirdParty),
      }),

    cjsPrisonDetails: optionalString()
      .max(1000)
      .when('cjsEmployer', {
        is: employerIncludes('HM Prison Service'),
        then: Joi.required(),
        otherwise: Joi.optional(),
      })
      .messages({
        'any.required': message(req, 'VALIDATION.CJS_EMPLOYED.PRISON_SERVICE', req.session.user.thirdParty),
        'string.max': message(req, 'VALIDATION.CJS_EMPLOYED.PRISON_SERVICE_LENGTH', req.session.user.thirdParty),
      }),

    cjsEmployed: Joi.string()
      .empty('')
      .required()
      .messages({
        'any.required': message(req, 'VALIDATION.CJS_EMPLOYED.EMPLOYED', req.session.user.thirdParty),
        'any.only': message(req, 'VALIDATION.CJS_EMPLOYED.EMPLOYED', req.session.user.thirdParty),
      }),

    cjsEmployerDetails: optionalString()
      .max(1000)
      .when('cjsEmployer', {
        is: employerIncludes('Other'),
        then: Joi.required(),
        otherwise: Joi.optional(),
      })
      .messages({
        'any.required': message(req, 'VALIDATION.CJS_EMPLOYED.OTHER', req.session.user.thirdParty),
        'string.max': message(req, 'VALIDATION.CJS_EMPLOYED.OTHER_LENGTH', req.session.user.thirdParty),
      }),
  });

  const employerValidation = validateJoiSchema(employerSchema, body, {
    errorMessageSummary: {
      cjsEmployer: message(req, 'VALIDATION.CJS_EMPLOYED.WORKED_FOR', req.session.user.thirdParty),
    },
    summaryLinks: {
      cjsEmployed: 'employedCjs-Yes',
      cjsEmployer: 'cjsEmployer-police',
    },
  });

  if (typeof employerValidation !== 'undefined') {
    return employerValidation;
  }

  if (body.cjsEmployed === yesValue) {
    return validateJoiSchema(detailsSchema, body);
  }
};
