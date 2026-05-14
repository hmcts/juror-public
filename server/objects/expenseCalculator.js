;(function(){
  'use strict';

  const _ = require('lodash');
  const { axiosInstance } = require('./axios-instance');
  const { replaceAllObjKeys } = require('../lib/utils');

  const expenseCalculator = {
    resource: 'bureau/expenseCalculator/estimate',
    post: function(app, jwtToken, expenseData) {

      let url = this.resource;
      let options = {
        'method': 'post',
        transformer: 'camelCase',
      };

      options.data = replaceAllObjKeys(expenseData, _.snakeCase);

      return axiosInstance(url, app, jwtToken, options);
    },
  };

  module.exports.expenseCalculator = expenseCalculator;

})();
