;(function() {
  'use strict';

  const _ = require('lodash');
  const { axiosInstance } = require('./axios-instance');

  module.exports.auth = {
    resource: 'auth/juror',

    post: function (app, jwtToken, userDetails) {

      let url = this.resource;
      let options = { 'method': 'post' };

      options.data = userDetails;


      app.logger.debug('Sending request to API for juror auth: ', {
        url: url,
        options: options,
      });

      return axiosInstance(url, app, jwtToken, options);
    },
  };

})();
