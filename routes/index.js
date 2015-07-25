var service = require('../src/service');

require('../src/batch');

exports.index = function(req, res) {
  service.findDescription(false, function(err, desc) {
    if (err) { res.send(500); }
    else {
      res.render('index', {
        desc: desc
      });
    }
  });
};

exports.fetcharchive = function(req, res) {
  var datetime = req.query.file;
  service.fetchGithubArchive(datetime, function(err) {
    if (err) {
      res.render('fetcharchive', {msg: 'Something is wrong!!!'});
    }
    else {
      res.render('fetcharchive', {msg: 'Registred'});
    }
  });
};

exports.progressTimeline = function(req, res) {
  service.progressTimeline(function() {
    res.render('fetcharchive', { msg: 'progressed' });
  });
};

exports.summarizeScore = function(req, res) {
  service.summarizeScore(function() {
    res.render('fetcharchive', { msg: 'summarized' });
  });
};

exports.findScore = function(req, res) {
  service.findScore(req.params.lang, function(err, data) {
    if (!err) {
      res.json(200, {results: data});
    } else if (err.message === req.params.lang + ' is not found') {
      res.json(404, {results: err.message});
    } else {
      res.send(500);
    }
  });
};
