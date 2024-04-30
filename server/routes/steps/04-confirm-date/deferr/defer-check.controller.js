;(function(){
  'use strict';

  var _ = require('lodash')
    , validate = require('validate.js')
    , filters = require('../../../../components/filters')
    , textsEn = require('../../../../../client/js/i18n/en.json')
    , textsCy = require('../../../../../client/js/i18n/cy.json')
    , deferralHoliday = require('../../../../objects/deferralHoliday').deferralHoliday
    , utils = require('../../../../lib/utils')
    , moment = require('moment');

  module.exports.index = function() {
    return function(req, res) {
      var tmpErrors
        , mergedUser
        , backLinkUrl
        , displayDates={};

      // Merge and then delete form fields and errors, prevents retention after pressing back link
      mergedUser = _.merge(_.cloneDeep(req.session.user), _.cloneDeep(req.session.formFields));
      tmpErrors = _.cloneDeep(req.session.errors);

      delete req.session.errors;
      delete req.session.formFields;

      // Retrieve and format the deferral dates
      if (req.session.user.deferral.dates) {
        req.session.user.deferral.dates.split(',')
          .forEach(function(dateStr, index) {
            displayDates['date' + (index + 1)] = dateStr;
          });
      }

      // Set back link URL
      backLinkUrl = utils.getRedirectUrl('steps.confirm.date.deferral-dates', req.session.user.thirdParty);

      return res.render('steps/04-confirm-date/defer-check.njk', {
        user: mergedUser,
        displayDates: displayDates,
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

  module.exports.create = function(app) {
    return function(req, res) {

      // Validate form submission
      var validatorResult
        , dateCheckProceed

        , checkDatesSuccess = function(response) {
          var redirectUrl
            , dateMatchesCount;

          app.logger.debug('Holiday dates API response: ', JSON.stringify(response));

          dateMatchesCount = response.matchingHolidayDates.publicHolidayDates.length;

          if (dateMatchesCount > 0){
            req.session.user.deferral['deferralDatesPublicHoliday'] = true;
            redirectUrl = utils.getRedirectUrl('steps.confirm.date.deferral-holiday', req.session.user.thirdParty);
          } else {
            req.session.user.deferral['deferralDatesPublicHoliday'] = false;

            if (req.session.change === true) {
              redirectUrl = utils.getRedirectUrl('steps.confirm.information', req.session.user.thirdParty);
            } else {
              redirectUrl = utils.getRedirectUrl('steps.assistance', req.session.user.thirdParty);
            }
          }

          return res.redirect(app.namedRoutes.build(redirectUrl));

        }

        , checkDatesError = function(err) {
          var redirectUrl;

          app.logger.crit('Error calling Holiday Dates API: ', {
            error: (typeof err.response.data !== 'undefined') ? err.response.data : err,
          });

          req.session.user.deferral['deferralDatesPublicHoliday'] = false;

          if (req.session.change === true) {
            redirectUrl = utils.getRedirectUrl('steps.confirm.information', req.session.user.thirdParty);
          } else {
            redirectUrl = utils.getRedirectUrl('steps.assistance', req.session.user.thirdParty);
          }

          return res.redirect(app.namedRoutes.build(redirectUrl));

        }

        , deferralDate
        , deferralDateList = []
        , holidayAPIData
        , redirectUrl;


      // Reset error and saved field sessions
      delete req.session.errors;
      delete req.session.formFields;

      // set public holiday flag (used in page navigation)
      req.session.user.deferral['deferralDatesPublicHoliday'] = false;

      // Validate form submission
      validatorResult = validate(req.body, require('../../../../config/validation/deferral-dates-check')(req));
      if (typeof validatorResult !== 'undefined') {
        req.session.errors = validatorResult;
        req.session.formFields = req.body;
        return res.redirect(app.namedRoutes.build(
          utils.getRedirectUrl('steps.confirm.date.deferral-check', req.session.user.thirdParty)
        ));
      }

      // parse radio selection
      if (req.body['deferralDateCheck'].toLowerCase() === 'yes'){
        dateCheckProceed = true;
      } else {
        dateCheckProceed = false;
      }

      // process navigation
      if (dateCheckProceed === false){
        // return to defer dates page
        redirectUrl = utils.getRedirectUrl('steps.confirm.date.deferral-dates', req.session.user.thirdParty);
        return res.redirect(app.namedRoutes.build(redirectUrl));
      }

      // format deferral dates as JSON data object to pass to API
      deferralDateList = [];

      if (req.session.user.deferral.dates) {
        req.session.user.deferral.dates.split(',')
          .forEach(function(dateStr) {
            deferralDate = moment(dateStr, 'DD/MM/YYYY');
            deferralDateList.push(deferralDate.format('YYYY-MM-DD'));
          });
      }

      holidayAPIData = {
        'holidaysDate': deferralDateList,
      };

      // call API
      deferralHoliday.post(app, holidayAPIData, req.session.authToken)
        .then(checkDatesSuccess)
        .catch(checkDatesError);

    };
  };

})();
