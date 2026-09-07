/**
 * Digital by default information hub.
 */

;(function () {
  'use strict';

  const environmentConfig = require('../../../config/environment')();
  const jurorDetails = require('../../../objects/juror').jurorDetails;
  const utils = require('../../../lib/utils');
  const moment = require('moment');

  const titleCase = function (string) {
    if (!string) {
      return '';
    }

    const parts = string.split(' ');

    const capitalizedParts = parts.map(function(part) {
      return part.trim().charAt(0).toUpperCase() + part.trim().slice(1).toLowerCase();
    });

    return capitalizedParts.join(' ');
  };

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
      const backLinkUrl = utils.getRedirectUrl('steps.login', req.session.user.thirdParty);

      if (!environmentConfig.featureFlags.digitalByDefault || req.session.user.digitalByDefault !== true) {
        return res.redirect(app.namedRoutes.build(responseStartRoute));
      }

      getDetailsSuccess = function (response) {
        app.logger.info('Fetched DBD information', {
          jurorNumber: req.session.user.jurorNumber,
          response: response,
        });

        let courtAttendTime = null;
        if (response['courtAttendTime'] && moment(response['courtAttendTime'], 'HH:mm').isValid()) {
          courtAttendTime = moment(response['courtAttendTime'], 'HH:mm').format('H:mma');
        }

        let courtAddress = null;
        courtAddress = [
          titleCase(response['courtAddress1']),
          titleCase(response['courtAddress2']),
          titleCase(response['courtAddress3']),
          titleCase(response['courtAddress4']),
          titleCase(response['courtAddress5']),
          response['courtPostcode'],
        ].filter(function (val) {
          return val;
        }).join('<br/> ');

        req.session.user['responseStartInfo'] = {
          summonsDate: response.serviceStartDate,
          courtName: response.courtName,
          courtAttendTime: courtAttendTime,
          courtAddress: courtAddress,
        };

        return res.render('steps/01-response-start/response-start.njk', {
          user: req.session.user,
          responseStart: {
            summonsDate: response.serviceStartDate,
            courtName: response.courtName,
          },
          responseStartUrl: app.namedRoutes.build(responseStartRoute),
          backLinkUrl: backLinkUrl,
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
          backLinkUrl: backLinkUrl,
        });
      };

      return jurorDetails.getResponseStartInformation(app, req.session.user.jurorNumber, req.session.authToken)
        .then(getDetailsSuccess, getDetailsError)
        .catch(getDetailsError);
    };
  };

  

})();
