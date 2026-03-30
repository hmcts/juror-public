;(function() {
  'use strict';

  const _ = require('lodash');
  const { axiosInstance } = require('./axios-instance');
  const { replaceAllObjKeys, basicDataTransform2 } = require('../lib/utils');

  module.exports.auth = {
    resource: 'auth/juror',

    post: function(app, jwtToken, userDetails) {

      let url = this.resource;
      let options = {'method': 'post', transform: basicDataTransform2};

      options.data = replaceAllObjKeys(userDetails, _.snakeCase);

      return axiosInstance(url, app, jwtToken, options);
    },
  };

})();
