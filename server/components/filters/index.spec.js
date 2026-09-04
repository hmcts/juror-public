'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');

const { transformCourtName } = require('./index');

test('transformCourtName converts an uppercase comma-separated court name to title case', function() {
  assert.equal(transformCourtName('EXAMPLE, CROWN COURT'), 'Example Crown Court');
});
