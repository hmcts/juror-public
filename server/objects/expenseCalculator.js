;(function(){
  'use strict';

  const { axiosInstance } = require('./axios-instance');

  const expenseCalculator = {
    resource: 'bureau/expenseCalculator/estimate',
    post: function(app, jwtToken, expenseData) {

      let url = this.resource;
      let options = {'method': 'post'};

      options.data = expenseData;

      return axiosInstance(url, app, jwtToken, options);
    },
  };

  module.exports.expenseCalculator = expenseCalculator;

})();
