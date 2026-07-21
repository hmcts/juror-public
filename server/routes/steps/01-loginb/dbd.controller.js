/**
 * Digital by default information hub.
 */

;(function () {
  'use strict';

  const environmentConfig = require('../../../config/environment')();
  const jurorDetails = require('../../../objects/juror').jurorDetails;

  module.exports.index = function (app) {
    return function (req, res) {
      let startResponseRoute;
      let getDetailsSuccess;
      let getDetailsError;

      if (typeof req.session.user === 'undefined') {
        return res.redirect(app.namedRoutes.build('steps.responder.type.get'));
      }

      startResponseRoute = req.session.user.thirdParty === 'Yes'
        ? 'branches.third.party.details.name.get'
        : 'steps.your.details.get';

      if (!environmentConfig.digitalByDefaultEnabled || req.session.user.digitalDefault !== true) {
        return res.redirect(app.namedRoutes.build(startResponseRoute));
      }

      getDetailsSuccess = function (response) {
        app.logger.info('Fetched DBD information', {
          jurorNumber: req.session.user.jurorNumber,
          response: response,
        });

        return res.render('steps/01-loginb/dbd.njk', {
          user: req.session.user,
          dbd: {
            summonsDate: response.serviceStartDate,
            courtName: response.courtName,
          },
          startResponseUrl: app.namedRoutes.build(startResponseRoute),
        });
      };

      getDetailsError = function (err) {
        app.logger.crit('Failed to fetch DBD information', {
          jurorNumber: req.session.user.jurorNumber,
          statusCode: err.response ? err.response.status : err.statusCode,
          error: err.response && typeof err.response.data !== 'undefined' ? err.response.data : err.message || err,
        });

        return res.render('steps/01-loginb/dbd.njk', {
          user: req.session.user,
          dbd: {},
          startResponseUrl: app.namedRoutes.build(startResponseRoute),
        });
      };

      return jurorDetails.getDBDInformation(app, req.session.user.jurorNumber, req.session.authToken)
        .then(getDetailsSuccess, getDetailsError)
        .catch(getDetailsError);
    };
  };
})();
