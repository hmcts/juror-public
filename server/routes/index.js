/**
 * Main application routes
 */

;(function () {
  'use strict';

  const errors = require('./../components/errors');
  const Router = require('named-routes');

  const router = new Router();

  module.exports = function (app) {

    // Set up named routes
    router.extendExpress(app);
    router.registerAppHelpers(app);

    // Insert routes below
    require('./actuator')(app);
    require('./start')(app);
    require('./cookies')(app);
    require('./privacy')(app);
    require('./accessibility-statement')(app);
    require('./contact')(app);

    require('./steps/00-responder-type')(app);
    require('./steps/01-login')(app);
    require('./steps/02-your-details')(app);
    require('./steps/03-qualify')(app);
    require('./steps/04-confirm-date')(app);
    // step 05-cjs-employed moved into 03-qualify
    require('./steps/06-assistance')(app);
    require('./steps/07-confirm-information')(app);
    require('./steps/08-confirmation')(app);

    require('./branches/01-third-party-details')(app);
    require('./branches/02-third-party-reason')(app);
    require('./branches/03-third-party-personal-details')(app);
    require('./branches/04-third-party-contact-details')(app);

    // Expense Calculator modules
    require('./start-expense-calculator')(app);
    require('./expense-calculator/earnings')(app);
    require('./expense-calculator/extra-costs')(app);
    require('./expense-calculator/travel')(app);
    require('./expense-calculator/confirm-information')(app);
    require('./expense-calculator/total')(app);


    // Configuration screen by default requires javascript to autopopulate
    // Fallback without JS will be to go to this page which prepopulates the
    // fields.
    app.get('/autoconfigure', function (req, res) {
      res.render('configure.njk', {
        title: 'Mr',
        firstName: 'John',
        lastName: 'Appleseed',
        addressLineOne: '10 High Street',
        addressLineTwo: '',
        addressLineThree: '',
        addressTown: 'Small Town',
        addressCounty: 'Eastshire',
        addressPostcode: 'EA12 3YZ',
      });
    });

    app.route('/health')
      .get(function (req, res) {
        return errors(req, res, 200);
      });

    app.route('/health/*')
      .get(function (req, res) {
        return errors(req, res, 200);
      });

    // All undefined asset or api routes should return a 404
    app.route('/:url(api|auth|components|app|bower_components|assets)/*')
      .get(function (req, res) {
        return errors(req, res, 404);
      });


    // Reaching this point implys to URL matches have been made, we can render standard 404.
    app.route('/*')
      .get(function (req, res) {
        return errors(req, res, 404);
      });
  };

})();
