;(function(){
  'use strict';

  require('./custom-validation');

  module.exports.yourDetails = require('./your-details');
  module.exports.yourDetailsConfirm = require('././your-details-confirm');
  module.exports.qualify = require('./convictions');
  module.exports.deferral = require('./deferral');
  module.exports.cjsEmployed = require('./cjs-employed');
  module.exports.reasonableAdjustment = require('./reasonable-adjustment');
})();
