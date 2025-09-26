/**
 * Using Rails-like standard naming convention for endpoints.
 * GET    /    ->    index
 */

;(function () {
  'use strict';

  const validate = require('validate.js');
  const _ = require('lodash');
  const secretsConfig = require('config');
  const filters = require('../../../components/filters');
  const textsEn = require('../../../../client/js/i18n/en.json');
  const textsCy = require('../../../../client/js/i18n/cy.json');
  const authComponent = require('../../../components/auth');
  const msgMappingsEn = require('../../../components/errors/message-mapping_en');
  const msgMappingsCy = require('../../../components/errors/message-mapping_cy');
  const utils = require('../../../lib/utils');

  module.exports.index = function (app) {
    return function (req, res) {
      let tmpErrors;
      let backLinkUrl;

      // If already logged in, redirect to inbox
      if (typeof res.locals.authentication !== 'undefined') {
        return res.redirect(app.namedRoutes.build('steps.your.details.get'));
      }

      // On first load of app we want to create a JWT that will be used for all API calls.
      //
      // It will have an empty body to begin with
      authComponent.createJWTToken(req, {}, secretsConfig.get('secrets.juror.public-jwtNoAuthKey'));


      // On load of page, we should clear any data
      if (typeof req.session.user === 'undefined' || typeof req.session.user.thirdParty === 'undefined') {
        return res.redirect(app.namedRoutes.build('steps.responder.type.get'));
      }

      // Reset user session data
      req.session.user = {
        thirdParty: req.session.user.thirdParty,
      };

      // Merge and then delete errors, prevents retention after pressing back link
      tmpErrors = _.cloneDeep(req.session.errors);
      delete req.session.errors;

      backLinkUrl = 'steps.responder.type.get';

      return res.render('steps/01-login/login.njk', {
        user: req.session.user,
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
      let tmpSession;

      let authSuccess = function (resp) {
        tmpSession = req.session;

        app.logger.info('Login attempt for juror number "' + req.body.jurorNumber + '" succeeded.', {
          jurorNumber: req.body.jurorNumber,
          response: resp,
        });

        // Regenerate session
        req.session.regenerate(function (err) {
          if (err) {
            throw err;
          }

          // Regenerate the session
          req.session.authToken = tmpSession.authToken;
          req.session.authKey = tmpSession.authKey;
          req.session.ulang = tmpSession.ulang;
          req.session.user = _.merge(tmpSession.user, {
            jurorNumber: req.body['jurorNumber'],
            jurorLastName: req.body['jurorLastName'],
            jurorPostcode: req.body['jurorPostcode'],
          });
          // redirect to confirmation of replying on behalf of someone`
          // if selected, otherwise move on to your details.
          if (req.session.user['thirdParty'] === 'Yes') {
            return res.redirect(app.namedRoutes.build('branches.third.party.details.name.get'));
          }
          return res.redirect(app.namedRoutes.build('steps.your.details.get'));
        });

      };

      let authFailure = function (err) {
        // eslint-disable-next-line max-len
        app.logger.crit('Login attempt for juror number "' + req.body.jurorNumber + '" responded with ' + err.statusCode, {
          jurorNumber: req.body.jurorNumber,
          error: (typeof err.originalError !== 'undefined') ? err.originalError : err,
        });

        // Add error feedback
        req.session.errors = {
          authentication: [{
            summary: (req.session.ulang === 'cy' ? msgMappingsCy : msgMappingsEn).logon[err.error],
          }],
        };

        if (err.error === 'USER_NOT_FOUND') {
          req.session.errors.jurorNumber = [{
            details: '',
          }];
          req.session.errors.jurorLastName = [{
            details: '',
          }];
          req.session.errors.jurorPostcode = [{
            details: '',
          }];
        }

        // Summons date has passed for the juror summons
        if (err.statusCode === 403 && err.error.startsWith('Not allowed. Court Date has already passed')) {
          // eslint-disable-next-line max-len
          return res.redirect(app.namedRoutes.build(utils.getRedirectUrl('steps.login.summons-date', req.session.user.thirdParty)));
        }
        // Too many login attempts - account locked - redirect to locked info page
        if (err.statusCode === 403 && err.error.startsWith('Juror account is locked')) {
          // eslint-disable-next-line max-len
          return res.redirect(app.namedRoutes.build(utils.getRedirectUrl('steps.login.locked', req.session.user.thirdParty)));
        }

        // Response already submitted - redirect to information page
        if (err.statusCode === 409) {
          // eslint-disable-next-line max-len
          return res.redirect(app.namedRoutes.build(utils.getRedirectUrl('steps.login.replied', req.session.user.thirdParty)));
        }
        // Other error - return to login page
        return res.redirect(app.namedRoutes.build(utils.getRedirectUrl('steps.login', req.session.user.thirdParty)));
      };

      // Reset error and saved field sessions
      delete req.session.errors;


      // Validate form submission
      req.body.jurorPostcode = req.body.jurorPostcode.trim();
      validatorResult = validate(req.body, require('../../../config/validation/login')(req));
      if (typeof validatorResult !== 'undefined') {
        req.session.errors = validatorResult;
        return res.redirect(app.namedRoutes.build(utils.getRedirectUrl('steps.login', req.session.user.thirdParty)));
      }

      // Send login to backend, callbacks will return as required
      authComponent.authenticate(req, app, authSuccess, authFailure);

    };
  };

  module.exports.getReplied = function () {
    return function (req, res) {

      // Reset user session data
      req.session.user = {
        thirdParty: req.session.user.thirdParty,
      };
      delete req.session.errors;

      return res.render('steps/01-login/replied.njk', {
        user: req.session.user,
      });
    };
  };

  module.exports.getSummonsDate = function () {
    return function (req, res) {

      // Reset user session data
      req.session.user = {
        thirdParty: req.session.user.thirdParty,
      };
      delete req.session.errors;

      return res.render('steps/01-login/summons-date.njk', {
        user: req.session.user,
      });
    };
  };

  module.exports.getLoginLocked = function () {
    return function (req, res) {

      // Reset user session data
      req.session.user = {
        thirdParty: req.session.user.thirdParty,
      };
      delete req.session.errors;

      return res.render('steps/01-login/locked.njk', {
        user: req.session.user,
      });
    };
  };

})();
