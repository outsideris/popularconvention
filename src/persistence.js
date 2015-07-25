// persistence layer
var MongoClient = require('mongodb').MongoClient;

var worklogs = null,
    conventions = null,
    score = null,
    dbserver = null;

module.exports = {
  open: function(callback) {
    MongoClient.connect('mongodb://'+process.env['MONGODB_HOST']+':'+process.env['MONGODB_PORT']+'/popular_convention2', function(err, db) {
      if (err) {
        return callback(err);
      }
      dbserver = db;
      worklogs = dbserver.collection('worklogs');
      conventions = dbserver.collection('conventions');
      score = dbserver.collection('score');


      if (process.env['NODE_ENV'] === 'production') {
        db.authenticate(process.env['MONGODB_USER'], process.env['MONGODB_PASS'], function(err, result) {
          if (err || result !== true) {
            return callback(err);
          }

          // ensure index
          dbserver.ensureIndex('conventions', {timestamp: 1}, function(err) {
            if (err) {
              return callback(err);
            }
            dbserver.ensureIndex('score', {shortfile: 1, lang: 1, file: 1}, function(err) {
              if (err) {
                return callback(err);
              }
              callback();
            });
          });
        });
      } else {
        // ensure index
        dbserver.ensureIndex('conventions', {timestamp: 1}, function(err) {
          if (err) {
            return callback(err);
          }
          dbserver.ensureIndex('score', {shortfile: 1, lang: 1, file: 1}, function(err) {
            if (err) {
              return callback(err);
            }
            callback();
          });
        });
      }
    });
  },
  insertWorklogs: function(doc, callback) {
    worklogs.insert(doc, callback);
  },
  processWorklog: function(id, callback) {
    worklogs.update({_id: id}, {$set: {inProcess: true}}, callback);
  },
  completeWorklog: function(id, callback) {
    worklogs.update({_id: id}, {$set: {completed: true, completeDate: new Date()}}, callback);
  },
  summarizeWorklog: function(id, callback) {
    worklogs.update({_id: id}, {$set: {summarize: true}}, callback);
  },
  findOneWorklogToProcess: function(callback) {
    worklogs.findOne({
      'inProcess': false,
      'completed': false
    }, callback);
  },
  findOneWorklogToSummarize: function(callback) {
    worklogs.findOne({
      'completed': true,
      'summarize': false
    }, callback);
  },
  findTimeline: function(coll, callback) {
    dbserver.collection(coll).find({type: 'PushEvent', repository: {$exists: true}}, {sort: {repository: {watchers: 1, forks: 1}}}, callback);
  },
  dropTimeline: function(coll, callback) {
    dbserver.collection(coll).drop(callback);
  },
  insertConvention: function(conv, callback) {
    conventions.insert(conv, callback);
  },
  findConvention: function(file, callback)  {
    conventions.find({
      'file': file
    }, callback);
  },
  upsertScore: function(data, callback) {
    score.update({_id: data._id}, data, {upsert: true}, callback);
  },
  findScoreByLang: function(lang, callback) {
    score.find({lang: lang}, {sort: [['shortfile', -1]]}, callback);
  },
  findLastestScore: function(callback) {
    var lastest = null;
    score.findOne({}, {sort: [['file', -1]]}, function(err, item) {
      if (err) {
        callback(err);
      } else if (item) {
        lastest = item;
        score.findOne({file: new RegExp(lastest.shortfile + '-2[0-3]')}, {sort: [['file', -1]]}, function (err, item) {
          if (err) {
            callback(err);
          } else if (item) {
            callback(null, item);
          } else {
            score.findOne({file: new RegExp(lastest.shortfile + '-1[0-9]')}, {sort: [['file', -1]]}, function (err, item) {
              if (err) {
                callback(err);
              } else if (item) {
                callback(null, item);
              } else {
                callback(null, lastest);
              }
            });
          }
        });
      } else {
        callback(null, null);
      }
    });
  },
  findScoreByFileAndLang: function(file, lang, callback) {
    score.findOne({shortfile: file, lang: lang}, callback);
  },
  findPeriodOfScore: function(callback) {
    score.group(['shortfile'], {}, {}, "function() {}", callback);
  },
  getTimeline: function(callback) {
    conventions.find().limit(10, callback);
  }
};
