'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { transformCourtName } = require('./index');

test('transformCourtName formats an uppercase, comma-separated court name', function() {
  assert.equal(transformCourtName('EXAMPLE, CROWN COURT'), 'Example Crown Court');
});
