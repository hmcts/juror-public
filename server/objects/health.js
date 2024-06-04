;(function () {
  'use strict';

  const { axiosInstance } = require('./axios-instance');
  const jwt = require('jsonwebtoken');
  const secretsConfig = require('config');

  let health = {
    resource: '/actuator/health',
    get: function (app) {

      let jwtToken;
      let apiUserObj = {
        login: 'AUTO',
        userLevel: '1',
        daysToExpire: 6,
        passwordWarning: true,
        staff: {
          name: 'AUTO',
          rank: -1,
          active: 1,
          courts: [],
        },
      };

      jwtToken = jwt.sign(apiUserObj,
        secretsConfig.get('secrets.juror.public-jwtKeyBureau'),
        { expiresIn: secretsConfig.get('secrets.juror.public-jwtTTL') });

      let url = this.resource;

      return axiosInstance(url, app, jwtToken, null);

    },
  };

  module.exports.health = health;
})();
