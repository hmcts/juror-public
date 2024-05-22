; (function() {
  'use strict';
  
  const { axiosInstance } = require('./axios-instance');
  const urljoin = require('url-join')
  const secretsConfig = require('config');
  const jwt = require('jsonwebtoken');

  const pcqService = {
    getHealth: function(app) {

      let url = urljoin(app.pcqSettings.serviceUrl, 'health');

      return axiosInstance(url, app, null, null);
    },
  };

  module.exports.pcqService = pcqService;
})();
