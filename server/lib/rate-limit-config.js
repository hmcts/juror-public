const secretsConfig = require('config');
const { createClient } = require('redis');
const rateLimit = require('express-rate-limit');
const rateLimitRedisStore = require('rate-limit-redis').RedisStore;

module.exports.RateLimitConfig = class RateLimitConfig {
  constructor() {
    this._redisClient = null;
  }

  start(app, rateLimitSettings) {
    const redisConnectionString = this._getRedisConnectionString();

    let config = {
      windowMs: rateLimitSettings.time,
      limit: rateLimitSettings.max,
      message: rateLimitSettings.message,
      //standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
      //legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    };

    if (redisConnectionString) {
      this.redisClient(redisConnectionString);

      config.store = new rateLimitRedisStore({
        prefix: 'JurorPublicRL',
        sendCommand: async(...args) => this._redisClient.sendCommand(args),
      });
    } else {
      console.log('Redis connection string not defined, using default store for rate limiter');
    }

    let limiter = rateLimit(config);

    if (limiter){
      app.use(limiter);

      console.log('Rate limiter settings: ' + JSON.stringify(config));
    }
  }

  redisClient(redisConnectionUrl) {

    this._redisClient = createClient({
      url: redisConnectionUrl,
      pingInterval: 5000,
      socket: {
        keepAlive: true,
      },
    });
  
    console.log('Attempting to connect to redis for rate limiter using connection string:');
    console.log(redisConnectionUrl);
  
    this._redisClient.connect()
      .catch(function(error) {
        console.log('Error connecting to redis client for rate limiter: ' + error);
      });

    this._redisClient.on('error', function(err) {
      console.log(new Date().toLocaleString() + ' - ' + 'Could not connect to redis for rate limiter: ' + err);
    });
    this._redisClient.on('connect', function() {
      console.log(new Date().toLocaleString() + ' - ' + 'Connected to redis for rate limiter');
    });
  }

  _getRedisConnectionString() {
    let redisConnectionString;
  
    try {
      redisConnectionString = secretsConfig.get('secrets.juror.public-redisConnection');
      return redisConnectionString;
    } catch (err) {
      console.log('Unable to retrieve Redis connection string, using default store for rate limiter');
      return;
    }
  }

}
