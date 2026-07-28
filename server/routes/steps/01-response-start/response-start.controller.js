/**
 * Digital by default information hub.
 */

;(function () {
  'use strict';

  const environmentConfig = require('../../../config/environment')();
  const jurorDetails = require('../../../objects/juror').jurorDetails;

  module.exports.index = function (app) {
    return function (req, res) {
      let getDetailsSuccess;
      let getDetailsError;

      if (typeof req.session.user === 'undefined') {
        return res.redirect(app.namedRoutes.build('steps.responder.type.get'));
      }

      const responseStartRoute = req.session.user.thirdParty === 'Yes'
        ? 'branches.third.party.details.name.get'
        : 'steps.your.details.get';

      if (!environmentConfig.featureFlags.digitalByDefault || req.session.user.digitalByDefault !== true) {
        return res.redirect(app.namedRoutes.build(responseStartRoute));
      }

      getDetailsSuccess = function (response) {
        app.logger.info('Fetched DBD information', {
          jurorNumber: req.session.user.jurorNumber,
          response: response,
        });

        return res.render('steps/01-response-start/response-start.njk', {
          user: req.session.user,
          responseStart: {
            summonsDate: response.serviceStartDate,
            courtName: response.courtName,
          },
          responseStartUrl: app.namedRoutes.build(responseStartRoute),
        });
      };

      getDetailsError = function (err) {
        app.logger.crit('Failed to fetch DBD information', {
          jurorNumber: req.session.user.jurorNumber,
          statusCode: err.response ? err.response.status : err.statusCode,
          error: err.response && typeof err.response.data !== 'undefined' ? err.response.data : err.message || err,
        });

        return res.render('steps/01-response-start/response-start.njk', {
          user: req.session.user,
          responseStart: {},
          responseStartUrl: app.namedRoutes.build(responseStartRoute),
        });
      };

      return jurorDetails.getResponseStartInformation(app, req.session.user.jurorNumber, req.session.authToken)
        .then(getDetailsSuccess, getDetailsError)
        .catch(getDetailsError);
    };
  };
})();
