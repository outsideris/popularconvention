# # service layer
#
# Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
# Licensed under the MIT license.
# <http://outsider.mit-license.org/>

logger = (require './helpers').logger
http = require 'http'
fs = require 'fs'
zlib = require 'zlib'
path = require 'path'
spawn = require('child_process').spawn
persistence = require './persistence'
timeline = require './timeline'
parser = require './parser/parser'
schedule = require 'node-schedule'
_ = require 'underscore'

persistence.open ->
  logger.info 'mongodb is connected'

archiveDir = "#{__dirname}/archive"
fs.exists archiveDir, (exist) ->
  if not exist then fs.mkdirSync archiveDir

service = module.exports =

  fetchGithubArchive: (datetime, callback) ->
    (http.get "http://data.githubarchive.org/#{datetime}.json.gz", (res) ->
      gzip = zlib.createGunzip()
      fstream = fs.createWriteStream "#{archiveDir}/#{datetime}.json"
      unzip = res.pipe gzip
      unzip.pipe  fstream
      unzip.on 'end', ->
        logger.info "downloaded #{datetime}.json"
        args = [
          '--host', '127.0.0.1'
          '--port', '27017'
          '--db', 'popular_convention'
          '--collection', datetime
          '--file', "#{archiveDir}/#{datetime}.json"
          '--type', 'json'
        ]
        mongoimport = spawn '/Users/outsider/bin/mongoimport', args
        mongoimport.stderr.on 'data', (data) ->
          logger.error "mongoimport error occured"
        mongoimport.on 'exit', (code) ->
          logger.info "mongoimport exited with code #{code}"
          doc =
            file: datetime
            inProgress: false
            completed: false
            summarize: false
          persistence.insertWorklogs doc, (->
            callback()) if code is 0
          callback(code) if code isnt 0
          fs.unlink "#{archiveDir}/#{datetime}.json", (err) ->
            logger.error "delete #{archiveDir}/#{datetime}.json" if err
    ).on 'error', (e) ->
      logger.error 'fetch githubarchive: ', {err: e}

  progressTimeline: (callback) ->
    persistence.findOneWorklogToProgress (err, worklog) ->
      logger.error 'findOneWorklogToProgress: ', {err: err} if err?
      return callback() if err? or not worklog?

      persistence.progressWorklog worklog._id, (err) ->
        if err?
          logger.error 'findOneWorklogs: ', {err: err}
          return callback err

        persistence.findTimeline worklog.file, (err, cursor) ->
          if err?
            logger.error 'findOneWorklogs: ', {err: err}
            return callback err

          cursor.batchSize(3000).each (err, item) ->
            if item?
              urls = timeline.getCommitUrls item
              urls.forEach (url) ->
                timeline.getCommitInfo url, (err, commit) ->
                  if err?
                    logger.error 'getCommitInfo: ', {err: err}
                  else
                    conventions = parser.parse commit
                    conventions.forEach (conv) ->
                      data =
                        timestamp: worklog.file
                        lang: conv.lang
                        convention: conv
                        regdate: new Date()
                        sha: commit.sha
                      persistence.insertConvention data, (err) ->
                        logger.error 'insertConvention', {err: err} if err?
                        logger.info 'insered convention'
                    persistence.completeWorklog worklog._id, (err) ->
                      if err?
                        logger.error 'completeWorklog: ', {err: err}
          callback()

  summarizeScore: (callback) ->
    persistence.findOneWorklogToSummarize (err, worklog) ->
      logger.error 'findOneWorklogToSummarize: ', {err: err} if err?
      return callback() if err? or not worklog?

      # summarize score in case of completed 2 hours ago
      if new Date - worklog.completeDate > 7200000
        persistence.findConvention worklog.file, (err, cursor) ->
          if err?
            logger.error 'findConvention: ', {err: err}
            return

          cursor.toArray (err, docs) ->
            sum = []
            docs.forEach (doc, index) ->
              if hasLang(sum, doc)
                baseConv = getConventionByLang doc.lang, sum
                (
                  if key isnt 'lang'
                    baseConv.convention[key].column.forEach (elem) ->
                      if doc.convention[key]?
                        baseConv.convention[key][elem.key] += doc.convention[key][elem.key]
                        baseConv.shas.push doc.sha
                        baseConv.shas = _.uniq baseConv.shas
                )for key, value of baseConv.convention
              else
                doc.shas = []
                doc.shas.push doc.sha
                delete doc.sha
                sum.push doc
            callback()

# private
progressRule = new schedule.RecurrenceRule()
progressRule .hour = [new schedule.Range(0, 23)]
progressRule .minute = 0

schedule.scheduleJob progressRule , ->
  service.progressTimeline ->
    logger.info "progressTimeline is DONE!!!"

summarizeRule = new schedule.RecurrenceRule()
summarizeRule.hour = [new schedule.Range(0, 23)]
summarizeRule.minute = [0, 30]

schedule.scheduleJob summarizeRule, ->
  service.summarizeScore ->
    logger.info "summarizeScore is DONE!!!"

hasLang = (sum, elem) ->
  sum.some (el) ->
    el.lang is elem.lang

getConventionByLang = (lang, sum) ->
  result = null
  sum.forEach (elem) ->
    result = elem if elem.lang is lang
  result
