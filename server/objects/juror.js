;(function(){
  'use strict';

  const { axiosInstance } = require('./axios-instance');
  const { basicDataTransform2 } = require('../lib/utils');

  let urljoin = require('url-join');

  const jurorDetails = {
    resource: 'public/juror',
    get: function(app, jurorNumber, jwtToken) {

      let url = urljoin(this.resource, jurorNumber);

      let options = {'method': 'get', transform: basicDataTransform2};

      options.transformer = 'getSingle';

      return axiosInstance(url, app, jwtToken, options);
    },
  };

  module.exports.jurorDetails = jurorDetails;

})();
