; (function() {
  'use strict';

  const { axiosInstance } = require('./axios-instance');
  const secretsConfig = require('config');
  const jwt = require('jsonwebtoken');

  const ageSettings = {
    resource: 'auth/settings',
    get: function(app) {

      let url = this.resource;
      let jwtToken = jwt.sign({}, secretsConfig.get('secrets.juror-digital-vault.public-jwtNoAuthKey'), { expiresIn: secretsConfig.get('secrets.juror-digital-vault.public-jwtTTL') });

      return axiosInstance(url, app, jwtToken, null);
    },
  };

  module.exports.ageSettings = ageSettings;
})();
