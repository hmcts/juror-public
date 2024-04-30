;(function(){
  'use strict';

  const { axiosInstance } = require('./axios-instance');

  const deferralHoliday = {
    resource: 'public/deferral-dates',
    post: function(app, deferralDates, jwtToken) {

      let url = this.resource;
      let options = {'method': 'post'};

      options.data = deferralDates;

      return axiosInstance(url, app, jwtToken, options);
    },
  };

  module.exports.deferralHoliday = deferralHoliday;

})();
