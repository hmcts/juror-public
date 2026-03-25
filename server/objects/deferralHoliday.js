;(function(){
  'use strict';

  const _ = require('lodash');
  const { axiosInstance } = require('./axios-instance');
  const { replaceAllObjKeys, basicDataTransform2 } = require('../lib/utils');

  const deferralHoliday = {
    resource: 'public/deferral-dates',
    post: function(app, deferralDates, jwtToken) {

      let url = this.resource;
      let options = {'method': 'post', transform: basicDataTransform2};

      options.data = replaceAllObjKeys(deferralDates, _.snakeCase);

      return axiosInstance(url, app, jwtToken, options);
    },
  };

  module.exports.deferralHoliday = deferralHoliday;

})();
