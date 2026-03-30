;(function() {
  'use strict';

  const _ = require('lodash');
  const { axiosInstance } = require('./axios-instance');
  const { replaceAllObjKeys } = require('../lib/utils');

  module.exports.auth = {
    resource: 'auth/juror',

    post: function(app, jwtToken, userDetails) {

      let url = this.resource;
      let options = {'method': 'post'};

      options.data = replaceAllObjKeys(userDetails, _.snakeCase);

      return axiosInstance(url, app, jwtToken, options);
    },
  };

})();
