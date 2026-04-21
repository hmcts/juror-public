;(function(){
  'use strict';

  const _ = require('lodash');
  const { axiosInstance } = require('./axios-instance');
  const { replaceAllObjKeys } = require('../lib/utils');

  const deferralHoliday = {
    resource: 'public/deferral-dates',
    post: function(app, deferralDates, jwtToken) {

      let url = this.resource;
      let options = {'method': 'post', transformer: 'camelCase' };

      console.log('Deferral dates being sent to API:', deferralDates);

      options.data = replaceAllObjKeys(deferralDates, _.snakeCase);

      return axiosInstance(url, app, jwtToken, options);
    },
  };

  module.exports.deferralHoliday = deferralHoliday;

})();
