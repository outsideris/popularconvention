// service layer
var logger = require('./helpers').logger,
    http = require('http'),
    fs = require('fs'),
    zlib = require('zlib'),
    spawn = require('child_process').spawn,
    persistence = require('./persistence'),
    timeline = require('./timeline'),
    parser = require('./parser/parser'),
    _ = require('underscore'),
    hljs = require('highlight.js');

// connect MongoDB
persistence.open(function(err) {
  if (err) {
    return logger.error('mongodb is not connected', {err: err});
  }
  logger.info('mongodb is connected');
});

// directory for temporary download json files from github archive
var archiveDir = __dirname + '/archive';
fs.exists(archiveDir, function(exist) {
  if (!exist) {
    fs.mkdirSync(archiveDir);
  }
});

// private
var hasLang = function(sum, elem) {
  sum.some(function(el) {
    return el.lang === elem.lang;
  });
};

var getConventionByLang = function(lang, convList) {
  var result = null;
  convList.forEach(function(elem) {
    if (elem.lang === lang) {
      result = elem;
    }
  });
  return result;
};

var getHighlightName = function(lang) {
  var map = {
    js: 'javascript',
    java: 'java',
    py: 'python',
    scala: 'scala',
    rb: 'ruby',
    cs: 'cs',
    php: 'php'
  };
  return map[lang];
};

var mongoImportCmd = "";
var findMongoImportCmd = function(datetime, callback) {
  if (mongoImportCmd) {
    callback(null, mongoImportCmd);
  } else {
    var which = spawn('which', ['mongoimport']);

    which.stdout.on('data', function(data) {
      mongoImportCmd = data.toString();
    });

    which.on('exit', function(code) {
      if (code === 0) {
        // remove trailing new line
        if (mongoImportCmd.match(/([\w\/]+)/)) {
          mongoImportCmd = mongoImportCmd.match(/([\w\/]+)/)[0];
        }
        callback(null, mongoImportCmd);
      } else {
        logger.error('mongoimport doesn\'t exist.');
        callback(code);

      }
    });
  }
};

var deleteArchiveFile = function(datetime) {
  fs.unlink(archiveDir+'/'+datetime+'.json', function(err) {
    if (err) {
      logger.error('delete '+archiveDir+'/'+datetime+'.json');
    }
  });
};

var importIntoMongodb = function(datetime, callback) {
  findMongoImportCmd(datetime, function(err, mongoCmd) {
    if (err) {
      logger.error('error occured during mongoimport');
    } else {
      var args = [
        '--host', process.env['MONGODB_HOST'],
        '--port', process.env['MONGODB_PORT'],
        '--db', 'popular_convention2',
        '--collection', datetime,
        '--file', "#{archiveDir}/#{datetime}.json",
        '--type', 'json'
      ];
      if (process.env['NODE_ENV'] === 'production') {
        args = args.concat([
          '--username', process.env['MONGODB_USER'],
          '--password', process.env['MONGODB_PASS']
        ]);
      }
      var mongoimport = spawn(mongoCmd, args);
      mongoimport.stderr.on('data', function() {
        logger.error('mongoimport error occured');
      });
      mongoimport.on('close', function(code) {
        logger.info('mongoimport exited with code '+code);
        var doc = {
          file: datetime,
          inProcess: false,
          completed: false,
          summarize: false
        };
        if (code === 0) {
          persistence.insertWorklogs(doc, function() {
              callback();
          });
        } else {
          callback(code);
        }
        deleteArchiveFile(datetime);
      });
    }
  });
};

var mergeConvention = function(baseConvention, newConvention) {
  for (var key in baseConvention) {
    var conv = baseConvention[key];
    if (key !== 'lang') {
      if (newConvention[key]) {
        for (var k in conv) {
          if (k !== 'commits') {
            conv[k] += newConvention[key][k];
          }
        }
        if (conv.commits.concat) {
          conv.commits = _.uniq(conv.commits.concat(newConvention[key].commits));
        } else {
          conv.commits = conv.commits + newConvention[key].commits;
        }
      }
    }
  }
};

var makeResult = function(lang, dailyData, callback) {
  var sumData = { lang: lang, period: [], raw: dailyData };
  dailyData.forEach(function(data) {
    if (!sumData.scores) {
      sumData.scores = data.convention;
      sumData.period.push(data.file);
    } else {
      for (var key in sumData.scores) {
        if (key !== 'lang') {
          if (data.convention[key]) {
            sumData.scores[key].column.forEach(function(elem) {
              sumData.scores[key][elem.key] += data.convention[key][elem.key];
            });
            sumData.scores[key].commits += data.convention[key].commits;
          }
        }
      }
      // add new field not exist
      var o = Object.keys(data.convention).filter(function(x) {
        return !~Object.keys(sumData.scores).indexOf(x);
      });
      for (key in o) {
        sumData.scores[key] = data.convention[key];
      }
      sumData.period.push(data.file);
    }
  });

  // get total for percentage
  for (var key in sumData.scores) {
    if (key !== 'lang') {
      var total = 0;
      sumData.scores[key].column.forEach(function(elem) {
        total += sumData.scores[key][elem.key];
        elem.code = hljs.highlight(getHighlightName(lang), elem.code).value;
      });
      sumData.scores[key].total = total;
    }
  }

  callback(null, sumData);
};


var service = module.exports = {
  // description object to display infomation footer in site
  totalDesc: {
    lastUpdate: null,
    startDate: null,
    endDate: null,
    regdate: null
  },
  // download timeline json file from github archive
  fetchGithubArchive: function(datetime, callback) {
    http.get('http://data.githubarchive.org/'+datetime+'.json.gz', function(res) {
      var gzip = zlib.createGunzip(),
          fstream = fs.createWriteStream(archiveDir+'/'+datetime+'.json'),
          unzip = res.pipe(gzip);
      unzip.pipe(fstream);
      unzip.on('end', function() {
        logger.info('downloaded '+datetime+'.json');
        importIntoMongodb(datetime, callback);
      });
    })
    .on('error', function(e) {
        logger.error('fetch githubarchive: ', {err: e});
    });
  },
  processTimeline: function(callback) {
    persistence.findOneWorklogToProcess(function(err, worklog) {
      if (err) {
        logger.error('findOneWorklogToProcess: ', {err: err});
      }
      if (err || !worklog) {
        return callback();
      }

      logger.debug('found worklog to process : '+worklog.file);

      timeline.checkApiLimit(function(remainingCount) {
        if (remainingCount > 2500) {
          persistence.processWorklog(worklog._id, function(err) {
            if (err) {
              logger.error('findOneWorklogs: ', {err: err});
              return callback(err);
            }
            logger.debug('start processing : '+worklog.file);
            persistence.findTimeline(worklog.file, function(err, cursor) {
              if (err) {
                logger.error('findOneWorklogs: ', {err: err});
                return callback(err);
              }

              logger.debug('found timeline : '+worklog.file);

              cursor.count(function(err, count) {
                logger.debug('timer '+worklog.file+' has '+count);
              });

              var isCompleted = false;
              var processCount = 0;

              var innerLoop = function(cur, concurrency) {
                if (concurrency && concurrency > 1) {
                  innerLoop(cur, concurrency - 1);
                  logger.debug('start batch #'+concurrency);
                }
                processCount += 1;

                cur.nextObject(function(err, item) {
                  if (err) {
                    logger.error('in nextObject: ', {err: err});
                    return;
                  }
                  if (item) {
                    logger.debug('found item', {item: item._id});

                    var urls = timeline.getCommitUrls(item);
                    logger.debug('urls: '+urls.length+' - ', {urls: urls});

                    if (urls.length === 0) {
                      innerLoop(cur);
                      return;
                    }

                    var invokedInnerLoop = false;
                    urls.forEach(function(url) {
                      timeline.getCommitInfo(url, function(err, commit) {
                        if (err) {
                          logger.error('getCommitInfo: ', {err: err, limit: /^API Rate Limit Exceeded/i.test(err.message), isCompleted: isCompleted, processCount: processCount});
                          if (/^API Rate Limit Exceeded/i.test(err.message) && !isCompleted && processCount > 2000) {
                            isCompleted = true;
                            persistence.completeWorklog(worklog._id, function(err) {
                              if (err) {
                                isCompleted = false;
                                logger.error('complete Worklog: ', {err: err});
                              }
                              logger.debug('completed worklog', {file: worklog.file});
                            });
                          } else if (!/^API Rate Limit Exceeded/i.test(err.message)) {
                            innerLoop(cur);
                          }
                        } else {
                          logger.debug('parsing commit '+url+' : ', {commit: commit});
                          var conventions = parser.parse(commit);
                          logger.debug('get conventions ', {convention: conventions});
                          conventions.forEach(function(conv) {
                            var data = {
                              file: worklog.file,
                              lang: conv.lang,
                              convention: conv,
                              regdate: new Date()
                            };
                            persistence.insertConvention(data, function(err)  {
                              if (err) {
                                logger.error('insertConvention', {err: err});
                              }
                              logger.info('insered convention - '+processCount);
                            });
                          });
                          logger.debug('before callback '+invokedInnerLoop+' - '+item._id);
                          if (!invokedInnerLoop) {
                            logger.debug('call recurrsive - '+item._id);
                            innerLoop(cur);
                            invokedInnerLoop = true;
                          }
                        }
                      });
                    });
                  } else {
                    logger.debug('no item - '+processCount);
                    if (!isCompleted && processCount > 2000) {
                      isCompleted = true;
                      persistence.completeWorklog(worklog._id, function(err) {
                        if (err) {
                          isCompleted = false;
                          logger.error('completeWorklog: ', {err: err});
                        }
                        logger.debug('completed worklog', {file: worklog.file});
                      });
                    }
                  }
                });
              };
              innerLoop(cursor, 5);

              callback();
            });
          });
        }
      });
    });
  },
  summarizeScore: function(callback) {
    persistence.findOneWorklogToSummarize(function(err, worklog) {
      if (err) {
        logger.error('findOneWorklogToSummarize: ', {err: err});
        if (!worklog) {
          return callback();
        }
      }

      // summarize score in case of completed 2 hours ago
      if (new Date() - worklog.completeDate > 7200000) {
        persistence.findConvention(worklog.file, function(err, cursor) {
          if (err) {
            logger.error('findConvention: ', {err: err});
            return;
          }

          cursor.toArray(function(err, docs) {
            var conventionList = [];
            docs.forEach(function(doc) {
              if (hasLang(conventionList , doc)) {
                var baseConv = getConventionByLang(doc.lang, conventionList);
                mergeConvention(baseConv.convention, doc.convention);
              } else {
                delete doc._id;
                doc.regdate = new Date();
                doc.shortfile = doc.file.substr(0, doc.file.lastIndexOf('-'));

                conventionList.push(doc);
              }
            });
            // convert commits to commit count
            conventionList.forEach(function(item) {
              for (var key in item.convention) {
                var value = item.convention[key];
                if (value.commits) {
                  value.commits = value.commits.length;
                }
              }
            });
            var fileOfDay = worklog.file.substr(0, worklog.file.lastIndexOf('-'));
            // merge convention if convention of same is exist
            var mergeInExistConvention = function(convList) {
              if (convList.length) {
                var conv = convList.pop();
                persistence.findScoreByFileAndLang(fileOfDay, conv.lang, function(err, item) {
                  if (err) {
                    logger.error('findScoreByFile', {err: err});
                    return;
                  }
                  logger.debug('findScoreByFileAndLang', {item: item});
                  if (item) {
                    mergeConvention(conv.convention, item.convention);
                    conv._id = item._id;
                  }
                  persistence.upsertScore(conv, function(err) {
                    if (err) {
                      logger.error('upsertScore', {err: err});
                    }
                    logger.info('upserted score', {conv: conv});
                  });
                  mergeInExistConvention(convList);
                });
              } else {
                persistence.summarizeWorklog(worklog._id, function(err) {
                  if (err) {
                    logger.error('summarizeWorklog', {err: err});
                    return;
                  }
                  logger.info('summarized worklog', {file: worklog.file});


                  persistence.dropTimeline(worklog.file, function(err) {
                    if (err) {
                      logger.error('drop timeline collection', {err: err});
                      return;
                    }
                    logger.info('dropped timeline collection', {collection: worklog.file});

                  });
                });
              }
            };
            mergeInExistConvention(conventionList);

            callback();
          });
        });
      } else {
        callback();
      }
    });
  },
  findScore: function(lang, callback) {
    persistence.findScoreByLang(lang, function(err, cursor) {
      if (err) {
        logger.error('findScoreByLang', {err: err});
        return callback(err);
      }

      var langParser = parser.getParser('.'+lang);
      var languageDescription;
      if (langParser) {
        languageDescription = parser.getParser('.'+lang).parse('', {}, '');
      } else {
        callback(new Error(lang+' is not found'));
      }

      var dailyData = [];
      cursor.toArray(function(err, docs) {
        if (err) {
          logger.error('findScoreByLang toArray', {err: err});
        }
        logger.debug('findByLang', {docs: docs});
        if (docs && docs.length) {
          docs.forEach(function(doc) {
            // set convention description from parser
            for (var key in doc.convention) {
              if (key !== 'lang') {
                doc.convention[key].title = languageDescription[key].title;
                doc.convention[key].column = languageDescription[key].column;
              }
            }
            var score = {
              lang: lang,
              file: doc.shortfile,
              convention: doc.convention
            };
            dailyData.push(score);
          });
          makeResult(lang, dailyData, callback);
        } else {
          callback(new Error(lang+' is not found'));
        }
      });
    });
  },
  findDescription: function(force, callback) {
    // get commit count from cacahing when cache value is exist and in 1 hour
    if (!force && service.totalDesc.regdate && (new Date() - service.totalDesc.regdate) < 3600000) {
      callback(null, service.totalDesc);
    } else {
      persistence.findLastestScore(function(err, item) {
        if (err) {
          logger.error('findLastestScore', {err: err});
          return callback(err);
        }

        if (item) {
          // caching
          service.totalDesc.lastUpdate = item.file;

          persistence.findPeriodOfScore(function(err, docs) {
            if (err) {
              logger.error('findPeriodOfScore', {err: err});
              return callback(err);
            }

            if (docs && docs.length > 0) {
              docs.sort(function(a, b) {
                if (a.shortfile > b.shortfile) {
                  return 1;
                } else {
                  return -1;
                }
              });
              // caching
              service.totalDesc.startDate = docs[0].shortfile;
              service.totalDesc.endDate = docs[docs.length - 1].shortfile;
              service.totalDesc.regdate = new Date();

              callback(null, service.totalDesc);
            }
          });
        } else {
          callback(null, service.totalDesc);
        }
      });
    }
  }
};
