;(function() {
  'use strict';

  const { axiosInstance } = require('./axios-instance');
  const { basicDataTransform2 } = require('../lib/utils');

  module.exports.auth = {
    resource: 'auth/juror',

    post: function(app, jwtToken, userDetails) {

      let url = this.resource;
      let options = {'method': 'post', transform: basicDataTransform2};

      options.data = userDetails;

      return axiosInstance(url, app, jwtToken, options);
    }
  };

})();
