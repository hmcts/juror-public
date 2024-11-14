/**
 * Using Rails-like standard naming convention for endpoints.
 * GET    /    ->    index
 */

;(function () {
  'use strict';

  const _ = require('lodash');
  const validate = require('validate.js');
  const moment = require('moment');
  const filters = require('../../../components/filters');
  const textsEn = require('../../../../client/js/i18n/en.json');
  const textsCy = require('../../../../client/js/i18n/cy.json');

  const jurorDetails = require('../../../objects/juror').jurorDetails;
  const utils = require('../../../lib/utils');


  module.exports.index = function (app) {
    return function (req, res) {

      let getDetailsSuccess = function (response) {

        utils.setRespondantDetails(app, req, response);

        app.logger.info('Fetched and parsed summoned juror details on third party route', {
          jurorNumber: req.session.user.jurorNumber,
          jwt: req.session.authToken,
          response: response,
        });

        // Reset error and saved field sessions
        delete req.session.errors;
        delete req.session.formFields;

        return res.redirect(app.namedRoutes.build('branches.third.party.personal.details.name.get'));

      };

      let getDetailsError = function (err) {
        app.logger.crit('Failed to fetch and parse summoned juror details on third party route: '
          + err.response.status, {
          jurorNumber: req.session.user.jurorNumber,
          jwt: req.session.authToken,
          error: (typeof err.response.data !== 'undefined') ? err.response.data : err,
        });

        res.redirect(app.namedRoutes.build(utils.getRedirectUrl('steps.login', req.session.user.thirdParty)));
      };

      jurorDetails.get(app, req.session.user.jurorNumber, req.session.authToken)
        .then(getDetailsSuccess, getDetailsError)
        .catch(getDetailsError);
    };
  };

  //
  // Name Functions
  //

  module.exports.changeName = function (app) {
    return function (req, res) {
      req.session.change = true;
      res.redirect(app.namedRoutes.build('branches.third.party.personal.details.name-change.get'));
    };
  };

  // Name confirm/change pages
  module.exports.getNameConfirm = function () {
    return function (req, res) {

      let nameError;
      let tmpErrors;
      let mergedUser;
      let backLinkUrl;

      if (typeof req.session.errors !== 'undefined') {
        nameError = (
          typeof req.session.errors['title'] !== 'undefined' ||
          typeof req.session.errors['firstName'] !== 'undefined' ||
          typeof req.session.errors['lastName'] !== 'undefined'
        );
      }

      // Merge and then delete form fields and errors, prevents retention after pressing back link
      mergedUser = _.merge(_.cloneDeep(req.session.user), _.cloneDeep(req.session.formFields));
      tmpErrors = _.cloneDeep(req.session.errors);

      // Reset error and saved field sessions
      delete req.session.errors;
      delete req.session.formFields;

      // Set back link URL
      if (req.session.change === true) {
        backLinkUrl = 'steps.confirm.information.tp.get';
      } else {
        backLinkUrl = 'branches.third.party.reason.get';
      }

      return res.render('branches/03-third-party-personal-details/name.njk', {
        user: mergedUser,
        errors: {
          title: filters.translate('VALIDATION.ERROR_TITLE', (req.session.ulang === 'cy' ? textsCy : textsEn)),
          message: '',
          count: typeof tmpErrors !== 'undefined' ? Object.keys(tmpErrors).length : 0,
          items: tmpErrors,
          nameError: nameError,
        },
        backLinkUrl: backLinkUrl,
      });

    };
  };

  module.exports.createNameConfirm = function (app) {
    return function (req, res) {
      let validatorResult;
      let redirectPage;

      // Reset error and saved field sessions
      delete req.session.errors;
      delete req.session.formFields;

      // Validate form submission
      validatorResult = validate(
        req.body, require('../../../config/validation/third-party-personal-details-name-confirm')(req));
      if (typeof validatorResult !== 'undefined') {
        req.session.errors = validatorResult;
        req.session.formFields = req.body;

        return res.redirect(app.namedRoutes.build('branches.third.party.personal.details.name.get'));
      }

      // JDB-2961 - only redirect to confirm information page if thirdPartyContactDetails page has been completed
      if (req.session.change === true && (typeof req.session.user.useJurorPhoneDetails !== 'undefined'
        || typeof req.session.user.useJurorEmailDetails !== 'undefined')) {
        return res.redirect(app.namedRoutes.build('steps.confirm.information.tp.get'));
      }

      if (req.body['nameConfirm'] === 'Yes') {
        redirectPage = 'branches.third.party.personal.details.address.get';
      } else {
        redirectPage = 'branches.third.party.personal.details.name-change.get';
      }

      return res.redirect(app.namedRoutes.build(redirectPage));
    };
  };

  module.exports.getNameChange = function () {
    return function (req, res) {

      let nameError;
      let tmpErrors;
      let mergedUser;
      let backLinkUrl;

      if (typeof req.session.errors !== 'undefined') {
        nameError = (
          typeof req.session.errors['title'] !== 'undefined' ||
          typeof req.session.errors['firstName'] !== 'undefined' ||
          typeof req.session.errors['lastName'] !== 'undefined'
        );
      }

      // Merge and then delete form fields and errors, prevents retention after pressing back link
      mergedUser = _.merge(_.cloneDeep(req.session.user), _.cloneDeep(req.session.formFields));
      tmpErrors = _.cloneDeep(req.session.errors);

      // Reset error and saved field sessions
      delete req.session.errors;
      delete req.session.formFields;

      // Set back link URL
      if (req.session.change === true) {
        backLinkUrl = 'steps.confirm.information.tp.get';
      } else {
        backLinkUrl = 'branches.third.party.personal.details.name.get';
      }

      return res.render('branches/03-third-party-personal-details/name-change.njk', {
        user: mergedUser,
        errors: {
          title: filters.translate('VALIDATION.ERROR_TITLE', (req.session.ulang === 'cy' ? textsCy : textsEn)),
          message: '',
          count: typeof tmpErrors !== 'undefined' ? Object.keys(tmpErrors).length : 0,
          items: tmpErrors,
          nameError: nameError,
        },
        backLinkUrl: backLinkUrl,
      });

    };
  };

  module.exports.createNameChange = function (app) {
    return function (req, res) {

      let validatorResult;
      // Join parts of name
      let nameRender = [
        req.body['title'],
        req.body['firstName'],
        req.body['lastName'],
      ].filter(function (val) {
        return val;
      }).join(' ');

      // Reset error and saved field sessions
      delete req.session.errors;
      delete req.session.formFields;

      // Validate form submission
      validatorResult = validate(req.body,
        require('../../../config/validation/third-party-personal-details-name')(req));
      if (typeof validatorResult !== 'undefined') {
        req.session.errors = validatorResult;
        req.session.formFields = req.body;
        req.session.formFields.nameRender = nameRender;

        return res.redirect(app.namedRoutes.build('branches.third.party.personal.details.name-change.get'));
      }

      // Input validated, store information in session
      // Update name
      req.session.user['nameRender'] = nameRender;
      req.session.user['title'] = req.body['title'];
      req.session.user['firstName'] = req.body['firstName'];
      req.session.user['lastName'] = req.body['lastName'];

      // JDB-2961 - only redirect to confirm information page if thirdPartyContactDetails page has been completed
      if (req.session.change === true
        && (typeof req.session.user.useJurorPhoneDetails !== 'undefined'
        || typeof req.session.user.useJurorEmailDetails !== 'undefined')) {
        return res.redirect(app.namedRoutes.build('steps.confirm.information.tp.get'));
      }

      return res.redirect(app.namedRoutes.build('branches.third.party.personal.details.address.get'));
    };
  };

  //
  // Address Functions
  //

  module.exports.changeAddress = function (app) {
    return function (req, res) {
      req.session.change = true;
      res.redirect(app.namedRoutes.build('branches.third.party.personal.details.address-change.get'));
    };
  };

  module.exports.getAddressConfirm = function () {
    return function (req, res) {

      let addressError;
      let tmpErrors;
      let mergedUser;
      let backLinkUrl;

      if (typeof req.session.errors !== 'undefined') {
        addressError = (
          typeof req.session.errors['address'] !== 'undefined' ||
          typeof req.session.errors['addressLineOne'] !== 'undefined' ||
          typeof req.session.errors['addressLineTwo'] !== 'undefined' ||
          typeof req.session.errors['addressLineThree'] !== 'undefined' ||
          typeof req.session.errors['addressTown'] !== 'undefined' ||
          typeof req.session.errors['addressCounty'] !== 'undefined' ||
          typeof req.session.errors['addressPostcode'] !== 'undefined'
        );
      }

      // Merge and then delete form fields and errors, prevents retention after pressing back link
      mergedUser = _.merge(_.cloneDeep(req.session.user), _.cloneDeep(req.session.formFields));
      tmpErrors = _.cloneDeep(req.session.errors);

      // Reset error and saved field sessions
      delete req.session.errors;
      delete req.session.formFields;

      // Set back link URL
      if (req.session.change === true) {
        backLinkUrl = 'steps.confirm.information.tp.get';
      } else {
        backLinkUrl = 'branches.third.party.personal.details.name.get';
      }

      return res.render('branches/03-third-party-personal-details/address.njk', {
        user: mergedUser,
        errors: {
          title: filters.translate('VALIDATION.ERROR_TITLE', (req.session.ulang === 'cy' ? textsCy : textsEn)),
          message: '',
          count: typeof tmpErrors !== 'undefined' ? Object.keys(tmpErrors).length : 0,
          items: tmpErrors,
          addressError: addressError,
        },
        backLinkUrl: backLinkUrl,
      });

    };
  };

  module.exports.createAddressConfirm = function (app) {
    return function (req, res) {
      let validatorResult;
      let redirectPage;

      // Reset error and saved field sessions
      delete req.session.errors;
      delete req.session.formFields;

      // Validate form submission
      validatorResult = validate(req.body,
        require('../../../config/validation/third-party-personal-details-address-confirm')(req));
      if (typeof validatorResult !== 'undefined') {
        req.session.errors = validatorResult;
        req.session.formFields = req.body;

        return res.redirect(app.namedRoutes.build('branches.third.party.personal.details.address.get'));
      }

      // JDB-2961 - only redirect to confirm information page if thirdPartyContactDetails page has been completed
      if (req.session.change === true
        && (typeof req.session.user.useJurorPhoneDetails !== 'undefined'
        || typeof req.session.user.useJurorEmailDetails !== 'undefined')) {
        return res.redirect(app.namedRoutes.build('steps.confirm.information.tp.get'));
      }

      if (req.body['addressConfirm'] === 'No') {
        redirectPage = 'branches.third.party.personal.details.address-change.get';
      } else {

        // Check that address is valid
        let addressDetails = {
          addressLineOne: req.session.user['addressLineOne'],
          addressLineTwo: req.session.user['addressLineTwo'],
          addressLineThree: req.session.user['addressLineThree'],
          addressTown: req.session.user['addressTown'],
          addressCounty: req.session.user['addressCounty'],
          addressPostcode: req.session.user['addressPostcode'],
        };

        validatorResult = validate(addressDetails, require('../../../config/validation/your-details-address.js')(req));

        if (typeof validatorResult !== 'undefined') {
          req.session.errors = validatorResult;
          redirectPage = 'branches.third.party.personal.details.address-change.get';
        } else {
          redirectPage = 'branches.third.party.personal.details.date-of-birth.get';
        }

      };

      return res.redirect(app.namedRoutes.build(redirectPage));

    };
  };

  module.exports.getAddressChange = function () {
    return function (req, res) {

      let addressError;
      let tmpErrors;
      let mergedUser;
      let backLinkUrl;

      if (typeof req.session.errors !== 'undefined') {
        addressError = (
          typeof req.session.errors['address'] !== 'undefined' ||
          typeof req.session.errors['addressLineOne'] !== 'undefined' ||
          typeof req.session.errors['addressLineTwo'] !== 'undefined' ||
          typeof req.session.errors['addressLineThree'] !== 'undefined' ||
          typeof req.session.errors['addressTown'] !== 'undefined' ||
          typeof req.session.errors['addressCounty'] !== 'undefined' ||
          typeof req.session.errors['addressPostcode'] !== 'undefined'
        );
      }

      // Merge and then delete form fields and errors, prevents retention after pressing back link
      mergedUser = _.merge(_.cloneDeep(req.session.user), _.cloneDeep(req.session.formFields));
      tmpErrors = _.cloneDeep(req.session.errors);

      // Reset error and saved field sessions
      delete req.session.errors;
      delete req.session.formFields;

      // Set back link URL
      if (req.session.change === true) {
        backLinkUrl = 'steps.confirm.information.tp.get';
      } else {
        backLinkUrl = 'branches.third.party.personal.details.address.get';
      }

      return res.render('branches/03-third-party-personal-details/address-change.njk', {
        user: mergedUser,
        errors: {
          title: filters.translate('VALIDATION.ERROR_TITLE', (req.session.ulang === 'cy' ? textsCy : textsEn)),
          message: '',
          count: typeof tmpErrors !== 'undefined' ? Object.keys(tmpErrors).length : 0,
          items: tmpErrors,
          addressError: addressError,
        },
        backLinkUrl: backLinkUrl,
      });

    };
  };

  module.exports.createAddressChange = function (app) {
    return function (req, res) {
      let validatorResult;
      // Join parts of address
      let addressRender = [
        req.body['addressLineOne'],
        req.body['addressLineTwo'],
        req.body['addressLineThree'],
        req.body['addressTown'],
        req.body['addressCounty'],
        req.body['addressPostcode'],
      ].filter(function (val) {
        return val;
      }).join('<br>');

      // Reset error and saved field sessions
      delete req.session.errors;
      delete req.session.formFields;

      // Validate form submission
      validatorResult = validate(
        req.body, require('../../../config/validation/third-party-personal-details-address')(req));
      if (typeof validatorResult !== 'undefined') {
        req.session.errors = validatorResult;
        req.session.formFields = req.body;
        req.session.formFields.addressRender = addressRender;

        return res.redirect(app.namedRoutes.build('branches.third.party.personal.details.address-change.get'));
      }

      // Input validated, store information in session
      // Update address
      req.session.user['addressLineOne'] = req.body['addressLineOne'];
      req.session.user['addressLineTwo'] = req.body['addressLineTwo'];
      req.session.user['addressLineThree'] = req.body['addressLineThree'];
      req.session.user['addressTown'] = req.body['addressTown'];
      req.session.user['addressCounty'] = req.body['addressCounty'];
      req.session.user['addressPostcode'] = req.body['addressPostcode'];

      req.session.user['addressRender'] = addressRender;

      // JDB-2961 - only redirect to confirm information page if thirdPartyContactDetails page has been completed
      if (req.session.change === true
        && (typeof req.session.user.useJurorPhoneDetails !== 'undefined'
        || typeof req.session.user.useJurorEmailDetails !== 'undefined')) {
        return res.redirect(app.namedRoutes.build('steps.confirm.information.tp.get'));
      }

      return res.redirect(app.namedRoutes.build('branches.third.party.personal.details.date-of-birth.get'));
    };
  };

  //
  // DOB Functions
  //

  module.exports.getDateOfBirth = function () {
    return function (req, res) {

      let tmpErrors;
      let mergedUser;
      let backLinkUrl;

      // Merge and then delete form fields and errors, prevents retention after pressing back link
      mergedUser = _.merge(_.cloneDeep(req.session.user), _.cloneDeep(req.session.formFields));
      tmpErrors = _.cloneDeep(req.session.errors);

      // Reset error and saved field sessions
      delete req.session.errors;
      delete req.session.formFields;

      // Set back link URL
      if (req.session.change === true) {
        backLinkUrl = 'steps.confirm.information.tp.get';
      } else {
        backLinkUrl = 'branches.third.party.personal.details.address.get';
      }

      return res.render('branches/03-third-party-personal-details/date-of-birth.njk', {
        user: mergedUser,
        errors: {
          title: filters.translate('VALIDATION.ERROR_TITLE', (req.session.ulang === 'cy' ? textsCy : textsEn)),
          message: '',
          count: typeof tmpErrors !== 'undefined' ? Object.keys(tmpErrors).length : 0,
          items: tmpErrors,
        },
        backLinkUrl: backLinkUrl,
      });

    };
  };

  module.exports.createDateOfBirth = function (app) {
    return function (req, res) {
      let validatorResult;
      let dobValue;

      // Reset error and saved field sessions
      delete req.session.errors;
      delete req.session.formFields;

      // Add dob fields into single dob object & calculate if age will be valid
      if (req.body['dobDay'].length > 0 && req.body['dobMonth'].length > 0 && req.body['dobYear'].length > 0) {
        dobValue = moment([req.body['dobYear'], req.body['dobMonth'], req.body['dobDay']].filter(function (val) {
          return val;
        }).join('-'), 'YYYY-MM-DD');

        // Add dobValue to req.body for validation
        req.body['dateOfBirth'] = dobValue;
        req.body['ageTimeOfHearing'] = utils.calculateAgeAtHearing(
          req.body['dateOfBirth'],
          req.session.user['hearingDateTimestamp'],
        );
      }

      // Validate form submission
      validatorResult = validate(
        req.body, require('../../../config/validation/third-party-personal-details-date-of-birth')(req));
      if (typeof validatorResult !== 'undefined') {

        // Only show 1 error at a time for the DOB
        // Report the first error item if multiple errors were raised

        if (validatorResult.dobDay) {
          delete validatorResult.dobMonth;
          delete validatorResult.dobYear;
          delete validatorResult.dateOfBirth;
        }
        if (validatorResult.dobMonth) {
          delete validatorResult.dobYear;
          delete validatorResult.dateOfBirth;
        }
        if (validatorResult.dobYear) {
          delete validatorResult.dateOfBirth;
        }

        req.session.errors = validatorResult;
        req.session.formFields = req.body;

        return res.redirect(app.namedRoutes.build('branches.third.party.personal.details.date-of-birth.get'));
      }

      // Input validated, store information in session
      // Store DOB info
      req.session.user['dateOfBirth'] = dobValue;
      req.session.user['dobDay'] = req.body['dobDay'];
      req.session.user['dobMonth'] = req.body['dobMonth'];
      req.session.user['dobYear'] = req.body['dobYear'];

      // reset ineligibleAge
      req.session.user['ineligibleAge'] = false;

      // redirect to dob confirmation if under lower age limit or above higher age limit
      if (req.body['ageTimeOfHearing'] < app.ageSettings.lowerAgeLimit
        || req.body['ageTimeOfHearing'] >= app.ageSettings.upperAgeLimit) {
        return res.redirect(app.namedRoutes.build('steps.your.details.confirm.tp.get'));
      }

      // JDB-2961 - only redirect to confirm information page if thirdPartyContactDetails page has been completed
      if (req.session.change === true
        && (typeof req.session.user.useJurorPhoneDetails !== 'undefined'
        || typeof req.session.user.useJurorEmailDetails !== 'undefined')) {
        return res.redirect(app.namedRoutes.build('steps.confirm.information.tp.get'));
      }

      return res.redirect(app.namedRoutes.build('branches.third.party.contact.details.get'));
    };
  };

  module.exports.changeDateOfBirth = function (app) {
    return function (req, res) {
      req.session.change = true;
      res.redirect(app.namedRoutes.build('branches.third.party.personal.details.date-of-birth.get'));
    };
  };


})();
