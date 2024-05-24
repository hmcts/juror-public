;(function() {
  'use strict';

  const { axiosInstance } = require('./axios-instance');

  module.exports.jurorResponse = {
    create: function(app, jwtToken, responseData) {

      let url = 'public/juror/respond';
      let options = {'method': 'post'};

      options.data = responseData;

      return axiosInstance(url, app, jwtToken, options);
    },
  };

})();
