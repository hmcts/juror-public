;(function () {
  'use strict';

  const path = require('path');
  const _ = require('lodash');
  const pkg = require(path.resolve(__dirname, '../../../', 'package.json'));

  const health = require('../../objects/health').health;

  const sendResponse = function (res, status, resp) {
    let fullResponse = _.merge(resp, {
      frontend: {
        status: 'UP',
        hello: 'world',
        name: pkg.name,
        version: pkg.version,
      },
    });
    return res.status(status).json(fullResponse);
  };

  module.exports.health = function (app) {
    return function (req, res) {
      health.get(app)
        .then(function (response) {
          return sendResponse(res, response.status, JSON.parse(response.body));
        })
        .catch(function (error) {
          let parsedJson;

          try {
            parsedJson = JSON.parse(error.response.data);
          } catch (e) {
            parsedJson = error.response.data;
          }
          return sendResponse(res, 500, _.merge({ status: 'DOWN' }, parsedJson));
        });
    };
  };

})();
