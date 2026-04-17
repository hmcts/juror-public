;(function() {
  'use strict';

  const _ = require('lodash');
  const { axiosInstance } = require('./axios-instance');
  const { basicDataTransform2 } = require('../lib/utils');

  module.exports.jurorResponse = {
    create: function(app, jwtToken, responseData) {

      let url = 'public/juror/respond';
      let options = {'method': 'post', transform: basicDataTransform2};

      options.data = _.mapKeys(responseData, (value, key) => _.snakeCase(key));

      return axiosInstance(url, app, jwtToken, options);
    },
  };

})();
