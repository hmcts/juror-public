(function() {
  'use strict';

  const _ = require('lodash');
  const axios = require('axios');
  const config = require('../config/environment')();

  const transformers = {
    default: (response) => {
      return response.data;
    },
    withHeaders: (response) => {
      return { 'headers': response.headers, 'data': response.data };
    },
  };

  const defaultOptions = {
    method: 'get',
    transformer: 'default',
  };

  module.exports.axiosInstance = function(url, app, jwtToken, opts) {
    const options = _.clone(defaultOptions);
    const client = axios.create({
      baseURL: config.apiEndpoint,
      timeout: 5000,
      headers: {
        'Content-type': 'application/vnd.api+json',
        'Accept': 'application/json',
        'Authorization': jwtToken,
      },
    });
    let data = {};

    if (opts) {
      Object.keys(opts).forEach((key) => {
        options[key] = opts[key];
      });
    }

    if (options.data) {
      data = {...options.data};
    }

    client.interceptors.request.use(function(request) {
      app.logger.debug('Sending request to API: ', {
        baseUrl: request.baseURL,
        url: request.url,
        headers: request.headers,
        method: request.method,
      });
      return request;
    });

    client.interceptors.response.use(transformers[options.transformer]);

    return client[options.method](url, data);
  };

})();
