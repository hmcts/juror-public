;(function(){
  'use strict';

  const { axiosInstance } = require('./axios-instance');

  let urljoin = require('url-join');

  const jurorDetails = {
    resource: 'public/juror',
    get: function(app, jurorNumber, jwtToken) {

      let url = urljoin(this.resource, jurorNumber);

      let options = {'method': 'get'};

      options.transformer = 'getSingle';

      return axiosInstance(url, app, jwtToken, options);
    },
  };

  module.exports.jurorDetails = jurorDetails;

})();
