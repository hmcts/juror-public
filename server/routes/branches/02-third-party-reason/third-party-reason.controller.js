/**
 * Using Rails-like standard naming convention for endpoints.
 * GET    /    ->    index
 */

;(function () {
  'use strict';

  const _ = require('lodash');
  const validate = require('validate.js');
  const filters = require('../../../components/filters');
  const textsEn = require('../../../../client/js/i18n/en.json');
  const textsCy = require('../../../../client/js/i18n/cy.json');

  module.exports.index = function () {
    return function (req, res) {
      let tmpErrors;
      let mergedUser;
      let backLinkUrl;

      // Make sure the user session exists
      if (typeof req.session.user === 'undefined') {
        req.session.user = {};
      }

      // Merge and then delete form fields and errors, prevents retention after pressing back link
      mergedUser = _.merge(_.cloneDeep(req.session.user), _.cloneDeep(req.session.formFields));
      tmpErrors = _.cloneDeep(req.session.errors);

      delete req.session.errors;
      delete req.session.formFields;

      // Set back link URL
      if (req.session.change === true) {
        backLinkUrl = 'steps.confirm.information.tp.get';
      } else {
        backLinkUrl = 'branches.third.party.details.contact.get';
      }

      return res.render('branches/02-third-party-reason/index.njk', {
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

  module.exports.create = function (app) {
    return function (req, res) {
      let validatorResult;

      // Reset error and saved field sessions
      delete req.session.errors;
      delete req.session.formFields;

      if (req.body.thirdPartyReason !== 'other') {
        req.body.thirdPartyOtherReason = '';
      }

      // Validate form submission
      validatorResult = validate(req.body, require('../../../config/validation/third-party-reason')(req));
      if (typeof validatorResult !== 'undefined') {
        req.session.errors = validatorResult;
        req.session.formFields = req.body;

        req.session.formFields.thirdPartyDetails = {
          thirdPartyReason: req.body.thirdPartyReason,
          thirdPartyOtherReason: req.body.thirdPartyOtherReason,
        };

        return res.redirect(app.namedRoutes.build('branches.third.party.reason.get'));
      }

      // Input validated, store information in session
      if (typeof req.session.user.thirdPartyDetails === 'undefined') {
        req.session.user.thirdPartyDetails = {};
      }

      req.session.user.thirdPartyDetails.thirdPartyReason = req.body.thirdPartyReason;
      req.session.user.thirdPartyDetails.thirdPartyOtherReason = req.body.thirdPartyOtherReason;

      req.session.user.ineligibleDeceased = (req.session.user.thirdPartyDetails.thirdPartyReason === 'deceased');

      if (req.session.user.thirdPartyDetails.thirdPartyReason === 'deceased') {
        return res.redirect(app.namedRoutes.build('steps.confirm.information.tp.get'));
      }

      return res.redirect(app.namedRoutes.build('branches.third.party.personal.details.get'));

    };
  };

  module.exports.change = function (app) {
    return function (req, res) {
      req.session.change = true;
      res.redirect(app.namedRoutes.build('branches.third.party.reason.get'));
    };
  };

})();
