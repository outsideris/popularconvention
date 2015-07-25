// Handle github timeline
var restler = require('restler'),
    _ = require('underscore'),
    path = require('path'),
    fs = require('fs'),
    helpers = require('./helpers'),
    logger = helpers.logger;

var githubHost = 'https://api.github.com';
// github.json contained token should be in .tokens directory
// ex: { "cliendId": "", "clientSecret": "" }
// WARRING: MUST NOT commit github.json file
var tokenPath = path.resolve("#{__dirname}", "../.tokens");
var token = JSON.parse(fs.readFileSync(tokenPath+'/github.json', 'utf8'));
var postfix = '?client_id='+token.cliendId+'&client_secret='+token.clientSecret;

// private
var generateApiUrl = function(url) {
  return githubHost + url + postfix;
};

module.exports = {
  getCommitUrls: function(timeline) {
    // GET /repos/:owner/:repo/commits/:sha
    if (helpers.extractType(timeline) === 'string') {
      timeline = JSON.parse(timeline);
    }

    var repo = timeline.repository;
    _.map(timeline.payload.shas, function(sha) {
      return '/repos/'+repo.owner+'/'+repo.name+'/commits/'+sha[0];
    });
  },
  getCommitInfo: function(url, callback) {
    restler.get(generateApiUrl(url))
      .on('success', function (data, res) {
        // 'x-ratelimit-limit': '5000',
        // 'x-ratelimit-remaining': '4986',
        if (res.headers['x-ratelimit-remaining'] % 50 === 0) {
          logger.info('github api limit: ' + res.headers['x-ratelimit-remaining']);
        }
        if (res.headers['x-ratelimit-remaining'] < '10') {
          logger.error('github api limit: ' + res.headers['x-ratelimit-remaining']);
        }
        callback(null, data, res);
      })
      .on('fail', function (data) {
        callback(data);
      })
      .on('complete', function (err) {
        if (err instanceof Error) {
          callback(err);
        }
      });
  },
  checkApiLimit: function(callback) {
    restler.get(generateApiUrl('/users/whatever'))
      .on('success', function(data, res) {
        logger.debug('API rate ramained ' + res.headers['x-ratelimit-remaining']);
        callback(res.headers['x-ratelimit-remaining']);
      })
      .on('fail', function(data, res) {
        logger.debug('API rate ramained ' + res.headers['x-ratelimit-remaining']);
        callback(res.headers['x-ratelimit-remaining']);
      });
  }
};



