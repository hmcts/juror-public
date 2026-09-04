'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const cookieController = require('./cookie.controller');

test('maps enabled usage cookies to analytics consent', function() {
  const req = {
    cookies: {
      cookies_policy: JSON.stringify({ usage: true }),
    },
    session: {},
  };
  let renderContext;
  const res = {
    render: function(view, context) {
      renderContext = context;
    },
  };

  cookieController.getCookieSettings()(req, res);

  assert.equal(renderContext.analyticsCookie, 'yes');
});
