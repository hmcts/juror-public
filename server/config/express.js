/**
 * Express configuration
 */

;(function(){
  'use strict';

  const express = require('express');
  const session = require('express-session');
  const nunjucks = require('express-nunjucks').default;
  const njk = require('nunjucks');
  const cookieParser = require('cookie-parser');
  const csrf = require('csurf');
  const helmet = require('helmet');
  const referrerPolicy = require('referrer-policy');
  const compression = require('compression');
  const bodyParser = require('body-parser');
  const methodOverride = require('method-override');
  const errorHandler = require('errorhandler');
  const path = require('path');
  const i18n = require('i18n-express');
  const { createClient } = require('redis');
  const RedisStore = require('connect-redis').default;
  const filters = require('../components/filters');
  const textsEN = require('../../client/js/i18n/en.json');
  const textsCY = require('../../client/js/i18n/cy.json');
  const secretsConfig = require('config');
  const config = require('./environment')();
  const utils = require('../lib/utils.js');
  const menuBuilder = require(__dirname + '/../menubuilder');
  const sessionExpires = 10 * (60 * 60);
  const sessionName = 'juror_summons_reply_session';

  // Grab environment variables to enable/disable certain services
  const pkg = require(__dirname + '/../../package.json');
  const releaseVersion = pkg.version;

  // Basic Auth credentials
  const basicAuthUsername = process.env.USERNAME;
  const basicAuthPassword = process.env.PASSWORD;

  const generateNonce = () => {
    return require('crypto').randomBytes(16).toString('base64');
  };

  function configureSecurity(app) {
    app.use((req, res, next) => {
      const nonce = generateNonce();

      res.locals.nonce = nonce;

      helmet.contentSecurityPolicy({
        directives: {
          defaultSrc: ['\'self\'', 'https://vcc-eu4.8x8.com', '*.google-analytics.com'],
          styleSrc: ['\'self\'', '*.google-analytics.com', '*.googletagmanager.com', 'https://tagmanager.google.com', 'https://fonts.googleapis.com', 'https://vcc-eu4.8x8.com'],
          scriptSrc: ['\'self\'', `'nonce-${nonce}'`, 'cdnjs.cloudflare.com', '*.google-analytics.com', '*.googletagmanager.com', 'https://tagmanager.google.com', 'https://vcc-eu4.8x8.com', 'https://*.dynatrace.com'],
          fontSrc: ['\'self\'', 'https://fonts.gstatic.com', 'data:'],
          imgSrc: ['\'self\'', '*.google-analytics.com', '*.googletagmanager.com', 'https://ssl.gstatic.com', 'https://www.gstatic.com', 'https://vcc-eu4.8x8.com', 'https://fonts.gstatic.com', 'data:'],
          connectSrc: ['\'self\'', 'ws://localhost:*', '*.google-analytics.com', '*.analytics.google.com', '*.googletagmanager.com', '*.g.doubleclick.net', 'https://*.dynatrace.com'],
        },
      })(req, res, next);
    });
    app.use(helmet.dnsPrefetchControl());
    app.use(helmet.frameguard());
    app.use(helmet.hidePoweredBy());
    app.use(helmet.hsts());
    app.use(helmet.ieNoOpen());
    app.use(helmet.noCache());
    app.use(helmet.noSniff());
    app.use(helmet.xssFilter());
    app.use(referrerPolicy());
  }

  function configureRequests(app) {
    // Serve all static files
    app.use(express.static(app.get('appPath')));

    app.use(compression());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(methodOverride());
    app.use(cookieParser());
  }

  function configureSessionsDefault(app, isProduction) {
    // Configure sessions

    console.log('Redis connection string not defined, using default session store');

    let sessionConfig = {
      secret: secretsConfig.get('secrets.juror.public-sessionSecret'),
      resave: false,
      saveUninitialized: false,
      maxAge: sessionExpires,
      name : sessionName,
      cookie: {
        secure: isProduction,
        sameSite: 'lax',
        httpOnly: true,
      },
    };

    app.use(session(sessionConfig));

    // CSRF Protection
    app.use(csrf());

  }

  function configureSessionsRedis(app, isProduction, redisConnectionString) {

    var redisStore;
    var redisClient;

    // Configure Redis connection
    console.log('Attempting to connect to redis using connection string: ');
    console.log(redisConnectionString);

    redisClient = createClient({
      url: redisConnectionString,
      pingInterval: 5000,
      socket: {
        keepAlive: true,
      },
    });
    redisClient.connect()
      .catch(function(error) {
        console.log('Error connecting redis client: ', error);
      });

    // Initialise store
    redisStore = new RedisStore({
      client: redisClient,
      prefix: 'JurorPublic:',
    });

    redisClient.on('error', function(err) {
      console.log(new Date().toLocaleString() + ' - ' + 'Could not connect to redis ' + err);
    });
    redisClient.on('connect', function(err) {
      console.log(new Date().toLocaleString() + ' - ' + 'Connected to redis successfully');
    });

    // Configure session middleware
    app.use(session({
      store: redisStore,
      secret: secretsConfig.get('secrets.juror.public-sessionSecret'),
      resave: false,
      saveUninitialized: false,
      maxAge: sessionExpires,
      name : sessionName,
      cookie: {
        secure: isProduction,
        httpOnly: true,
      },
    }));

    // CSRF Protection
    app.use(csrf());
  }

  function configureTemplating(app) {
    // Configure translations
    app.use(i18n({
      translationsPath: path.join(config.root, 'client', 'js', 'i18n'),
      browserEnable: false,
      defaultLang: 'en',
      paramLangName: 'clang',
      siteLangs: ['en', 'cy'],
    }));

    // Setup templating engine
    app.set('view engine', 'njk');
    app.set('views', [
      'node_modules/govuk-frontend/',
      path.join(app.get('appPath'), 'templates'),
    ]);

    nunjucks(app, {
      autoescape: true,
      watch: true,
      noCache: true,
      filters: filters,
      loader: njk.FileSystemLoader, // Use synchronous loader templates
    });
  }


  module.exports = function(app) {
    // Used to show service title
    var serviceTitleExcludedUrls = ['/', '/start'];
    var isProduction;
    var env = process.env.NODE_ENV || 'development';
    var useAuth = process.env.USE_AUTH || config.useAuth;
    var dynatraceScriptUrl = '';
    var redisConnectionString = '';

    // Ensure provided environment values are lowercase
    env = env.toLowerCase();
    useAuth = useAuth.toLowerCase();

    // Base Path of the client folder
    app.set('appPath', path.join(config.root, 'client'));

    // Set up parts of express
    configureSecurity(app);
    configureRequests(app);


    console.log('Configuring session store...');
    isProduction = env === 'production';
    try {
      redisConnectionString = secretsConfig.get('secrets.juror.public-redisConnection');

      if (redisConnectionString){
        configureSessionsRedis(app, isProduction, redisConnectionString);
      } else {
        configureSessionsDefault(app, isProduction);
      }
    } catch (error) {
      console.log(error);
      configureSessionsDefault(app, isProduction);
    };

    // Get Dynatrace script url
    try {
      dynatraceScriptUrl = secretsConfig.get('secrets.juror.public-dynatraceScriptUrl');
    } catch (error) {
      console.log('Error retrieving Dynatrace script url: ', error);
    }
    if (!dynatraceScriptUrl){
      console.log('Dynatrace script url not defined');
    }

    configureTemplating(app);

    // Send data to all views
    app.use(function(req, res, next) {
      res.locals.assetPath = '/';
      res.locals.releaseVersion = 'v' + releaseVersion;
      res.locals.csrftoken = req.csrfToken();
      res.locals.trackingCode = config.trackingCode;
      res.locals.dynatraceScriptUrl = dynatraceScriptUrl;

      // eslint-disable-next-line
      res.locals.cookieText = filters.translate('INTERFACE.COOKIE_MESSAGE', (req.session.ulang === 'cy' ? textsCY : textsEN));

      if (serviceTitleExcludedUrls.indexOf(req.originalUrl) === -1) {
        // res.locals.serviceName = config.serviceName;
        res.locals.serviceName = filters.translate('INTERFACE.SERVICE_TITLE', (req.session.ulang === 'cy' ? textsCY : textsEN));
      }

      res.locals.IS_PRODUCTION = (config.env === 'production');

      // Construct our menu
      res.locals.headerMenu = menuBuilder(req, app, 'header');

      next();
    });

    if (env === 'production') {
      app.set('trust proxy', 1);
    }

    // Modify request body to strip out white spaces
    app.use(function(req, res, next) {
      var bodyKey;

      if (!req.body) {
        next();
      }

      for (bodyKey in req.body) {
        if (req.body.hasOwnProperty(bodyKey) && typeof req.body[bodyKey] === 'string' && req.body[bodyKey].length > 0) {
          req.body[bodyKey] = req.body[bodyKey].trim();
        }
      }

      next();
    });


    // Authenticate against the environment-provided credentials, if running
    // the app in production
    if (env === 'production' && useAuth === 'true'){
      app.use(utils.basicAuth(app.logger, basicAuthUsername, basicAuthPassword, require('basic-auth')));
    }


    // error handler
    app.use(function(err, req, res, next) {
      // If error is not csrf, then we don't need to handle it
      if (err.code !== 'EBADCSRFTOKEN') {
        return next(err);
      }

      // Ensure any template global variables needed are available.
      res.locals.assetPath = '/';
      res.locals.releaseVersion = 'v' + releaseVersion;
      res.locals.trackingCode = config.trackingCode;

      // eslint-disable-next-line
      res.locals.cookieText = filters.translate('INTERFACE.COOKIE_MESSAGE', (req.session.ulang === 'cy' ? texts_cy : texts_en));

      if (req.url.includes('expense-calculator')){
        return res.redirect(app.namedRoutes.build('start-expense-calculator.get'));
      }

      // handle CSRF token errors here
      return res.render('_errors/403.njk');
    });


    // Configure Error Handling, has to be last
    if ('development' === env || 'test' === env) {
      app.use(errorHandler());
    }


    // Check cookie preferences
    app.use(function(req, res, next) {
      // check if client sent cookie
      var cookie = req.cookies.cookies_policy,
        objCookie = null;

      // store return url used on cookie-settings page
      if (!(req.url.endsWith('cookie-settings') || req.url.endsWith('cookie-banner') || req.url.endsWith('cookies'))){
        req.session.cookieReturnUrl = req.url;
      }

      if (typeof cookie === 'undefined'){
        // consent cookie does not currently exist - show the cookie banner
        res.locals.showCookieBanner = true;
        res.locals.allowAnalytics = false;
      } else {
        // consent cookie exists - check analytics setting
        res.locals.showCookieBanner = false;
        res.locals.allowAnalytics = false;

        objCookie = JSON.parse(cookie);

        if (objCookie){
          if (objCookie['usage']){
            res.locals.allowAnalytics = true;
          } else {
            res.locals.allowAnalytics = false;
          }
        }
      }

      next(); // <-- important!
    });

  };

})();
