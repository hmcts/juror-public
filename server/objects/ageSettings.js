; (function() {
  'use strict';

  const { axiosInstance } = require('./axios-instance');
  const secretsConfig = require('config');
  const jwt = require('jsonwebtoken');
  const { basicDataTransform2 } = require('../lib/utils');

  const ageSettings = {
    resource: 'auth/settings',
    get: function(app) {

      let url = this.resource;
      let jwtToken = jwt.sign({}, secretsConfig.get('secrets.juror.public-jwtNoAuthKey'), { expiresIn: secretsConfig.get('secrets.juror.public-jwtTTL') });

      return axiosInstance(url, app, jwtToken, { transform: basicDataTransform2 });
    },
  };

  module.exports.ageSettings = ageSettings;
})();
