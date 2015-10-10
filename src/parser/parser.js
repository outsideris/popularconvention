'use strict';

// parsing source
var helpers = require('../helpers'),
    path = require('path'),
    logger = (require('../helpers')).logger,
    jsParser = require('./js-parser'),
    javaParser = require('./java-parser'),
    pythonParser = require('./python-parser'),
    scalaParser = require('./scala-parser'),
    rubyParser = require('./ruby-parser'),
    csharpParser = require('./csharp-parser'),
    phpParser = require('./php-parser');

var supportExts = [
  '.js',
  '.java',
  '.py',
  '.scala',
  '.rb',
  '.cs',
  '.php'
];

var isSupportExt = function(ext) {
  return supportExts.some(function(elem) {
    return elem === ext;
  });
};

var parser = module.exports = {
  parsePatch: function(commit) {
    if ('string' === helpers.extractType(commit)) {
      commit = JSON.parse(commit);
    }
    return commit.files;
  },
  parseAdditionTokens: function(patch) {
    patch = patch.split('\n');

    var results = [];
    patch.forEach(function(line) {
      if (line.charAt(0) === '+') {
        results.push(line.substr(1));
      }
    });
    return results;
  },
  parse: function(commit) {
    var conventions = [];
    try {
      if ('string' === helpers.extractType(commit)) { commit = JSON.parse(commit); }

      commit.files.forEach(function(file) {
        var convention, key, lines, psr;
        var ext = path.extname(file.filename);
        if (isSupportExt(ext) && !!file.patch) {
          convention = { lang: ext.substr(1) };

          psr = parser.getParser(ext);
          lines = parser.parseAdditionTokens(file.patch);
          lines.forEach(function(line) {
            convention = psr.parse(line, convention, commit.html_url);
          });
          // delete convention description
          for (key in convention) {
            delete convention[key].title;
            delete convention[key].column;
          }
          if (Object.keys(convention).length > 1) { conventions.push(convention); }
        }
      });
      return conventions;
    } catch (_error) {
      var err = _error;
      logger.error('parsing', { err: err });
      return [];
    }
  },
  getParser: function(ext) {
    switch (ext) {
      case '.js':
        return jsParser;
      case '.java':
        return javaParser;
      case '.py':
        return pythonParser;
      case '.scala':
        return scalaParser;
      case '.rb':
        return rubyParser;
      case '.cs':
        return csharpParser;
      case '.php':
        return phpParser;
    }
  }
};


