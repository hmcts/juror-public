;(function () {
  'use strict';

  const filters = require('../../components/filters');
  const textsEn = require('../../../client/js/i18n/en.json');
  const textsCy = require('../../../client/js/i18n/cy.json');

  module.exports = function (req) {

    const langText = (req.session.ulang === 'cy' ? textsCy : textsEn);
    const thirdPartyInd = (req.session.user.thirdParty === 'Yes' ? '_OB' : '');
    const earliestDate = filters.translateDate(req.session.user.deferral.dateRange.earliestDateShort,
      'D MM YYYY', 'D MMMM YYYY', req.session.ulang);
    const latestDate = filters.translateDate(req.session.user.deferral.dateRange.latestDateShort,
      'D MM YYYY', 'D MMMM YYYY', req.session.ulang);

    return {
      date1: {
        deferralDateValid: {
          index: 1,
          jurorDOB: req.session.user.dateOfBirth,
          message: {
            missingDate: filters.translate('VALIDATION.DEFERRAL.DATE_ONE_MISSING' + thirdPartyInd, langText),
            invalidDate: filters.translate('VALIDATION.DEFERRAL.DATE_ONE_FORMAT' + thirdPartyInd, langText),
            dateLowerLimit: filters.translate('VALIDATION.DEFERRAL.DATE_ONE_RANGE' + thirdPartyInd,
              langText).replace('[earliestDate]', earliestDate).replace('[latestDate]', latestDate),
            dateUpperLimit: filters.translate('VALIDATION.DEFERRAL.DATE_ONE_RANGE' + thirdPartyInd,
              langText).replace('[earliestDate]', earliestDate).replace('[latestDate]', latestDate),
            dateAgeLimit: filters.translate('VALIDATION.DEFERRAL.DATE_AGE' + thirdPartyInd, langText),
            dateUnique: filters.translate('VALIDATION.DEFERRAL.DATE_UNIQUE' + thirdPartyInd, langText),
          },
        },
      },

      date2: {
        deferralDateValid: {
          index: 2,
          jurorDOB: req.session.user.dateOfBirth,
          message: {
            missingDate: filters.translate('VALIDATION.DEFERRAL.DATE_TWO_MISSING' + thirdPartyInd, langText),
            invalidDate: filters.translate('VALIDATION.DEFERRAL.DATE_TWO_FORMAT' + thirdPartyInd, langText),
            dateLowerLimit: filters.translate('VALIDATION.DEFERRAL.DATE_TWO_RANGE' + thirdPartyInd,
              langText).replace('[earliestDate]', earliestDate).replace('[latestDate]', latestDate),
            dateUpperLimit: filters.translate('VALIDATION.DEFERRAL.DATE_TWO_RANGE' + thirdPartyInd,
              langText).replace('[earliestDate]', earliestDate).replace('[latestDate]', latestDate),
            dateAgeLimit: filters.translate('VALIDATION.DEFERRAL.DATE_AGE' + thirdPartyInd, langText),
            dateUnique: filters.translate('VALIDATION.DEFERRAL.DATE_UNIQUE' + thirdPartyInd, langText),
          },
        },
      },

      date3: {
        deferralDateValid: {
          index: 3,
          jurorDOB: req.session.user.dateOfBirth,
          message: {
            missingDate: filters.translate('VALIDATION.DEFERRAL.DATE_THREE_MISSING' + thirdPartyInd, langText),
            invalidDate: filters.translate('VALIDATION.DEFERRAL.DATE_THREE_FORMAT' + thirdPartyInd, langText),
            dateLowerLimit: filters.translate('VALIDATION.DEFERRAL.DATE_THREE_RANGE' + thirdPartyInd,
              langText).replace('[earliestDate]', earliestDate).replace('[latestDate]', latestDate),
            dateUpperLimit: filters.translate('VALIDATION.DEFERRAL.DATE_THREE_RANGE' + thirdPartyInd,
              langText).replace('[earliestDate]', earliestDate).replace('[latestDate]', latestDate),
            dateAgeLimit: filters.translate('VALIDATION.DEFERRAL.DATE_AGE' + thirdPartyInd, langText),
            dateUnique: filters.translate('VALIDATION.DEFERRAL.DATE_UNIQUE' + thirdPartyInd, langText),
          },
        },
      },

    };
  };

})();
