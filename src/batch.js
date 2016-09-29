var logger = require('./helpers').logger,
    schedule = require('node-schedule'),
    service = require('./service'),

    fs = require('fs'),
    moment = require('moment');

// directory for temporary download json files from github archive
var archiveDir = __dirname+'/archive';
fs.exists(archiveDir, function(exist) {
  if (!exist) {
    fs.mkdirSync(archiveDir);
  }
});

// batch to process timetile imported from github archive
var processRule = new schedule.RecurrenceRule();
processRule.hour = [new schedule.Range(0, 23)];
processRule.minute = [10, 30, 50];

schedule.scheduleJob(processRule, function() {
  service.processTimeline(function() {
    logger.info('processTimeline is DONE!!!');
  });
});

// batch to summarize convention score by same time
var summarizeRule = new schedule.RecurrenceRule();
summarizeRule.hour = [new schedule.Range(0, 23)];
summarizeRule.minute = [5, 25, 45];

schedule.scheduleJob(summarizeRule, function() {
  service.summarizeScore(function() {
    logger.info('summarizeScore is DONE!!!');
  });
});

// batch to cache total description for footer
var descriptionRule = new schedule.RecurrenceRule();
descriptionRule.hour = [new schedule.Range(0, 23)];
descriptionRule.minute = [0];

schedule.scheduleJob(descriptionRule, function() {
  service.findDescription(true, function() {});
});

//var getOneDayAgo = function() {
//  return moment().add('d', -1).format("YYYY-MM-DD-H");
//};

// batch to fetch json file from githubarchive and import to mongoDB
//var archiveRule = new schedule.RecurrenceRule();
//archiveRule.hour = [new schedule.Range(0, 23)];
//archiveRule.minute = [5];
//
//schedule.scheduleJob(archiveRule, function() {
//  var datetime = getOneDayAgo();
//  service.fetchGithubArchive(datetime, function(err) {
//    if (err) {
//      logger.error('fetcharchive', {err: err});
//    } else {
//      logger.info('fetched githubarchive', {datetime: datetime});
//    }
//  });
//});
