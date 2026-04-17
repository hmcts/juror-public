;(function() {
  'use strict';

  const _ = require('lodash');
  const { axiosInstance } = require('./axios-instance');

  module.exports.jurorResponse = {
    create: function(app, jwtToken, responseData) {

      let url = 'public/juror/respond';
      let options = {'method': 'post', transformer: 'camelCase'};

      options.data = _.mapKeys(responseData, (value, key) => _.snakeCase(key));

      return axiosInstance(url, app, jwtToken, options);
    },
  };

})();
