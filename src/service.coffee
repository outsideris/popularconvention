# # service layer
#
# Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
# Licensed under the MIT license.
# <http://outsider.mit-license.org/>

logger = (require './helpers').logger
helpers = (require './helpers')
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
hljs = require 'highlight.js'

persistence.open (err) ->
  return logger.error 'mongodb is not connected', {err: err} if err?
  logger.info 'mongodb is connected'

archiveDir = "#{__dirname}/archive"
fs.exists archiveDir, (exist) ->
  if not exist then fs.mkdirSync archiveDir

service = module.exports =
  totalDesc:
    lastUpdate: null
    startDate: null
    endDate: null
    commitCount: 0
    regdate: null

  fetchGithubArchive: (datetime, callback) ->
    (http.get "http://data.githubarchive.org/#{datetime}.json.gz", (res) ->
      gzip = zlib.createGunzip()
      fstream = fs.createWriteStream "#{archiveDir}/#{datetime}.json"
      unzip = res.pipe gzip
      unzip.pipe fstream
      unzip.on 'end', ->
        logger.info "downloaded #{datetime}.json"
        importIntoMongodb(datetime, callback)
    ).on 'error', (e) ->
      logger.error 'fetch githubarchive: ', {err: e}

  progressTimeline: (callback) ->
    persistence.findOneWorklogToProgress (err, worklog) ->
      logger.error 'findOneWorklogToProgress: ', {err: err} if err?
      return callback() if err? or not worklog?

      logger.debug "found worklog to progress : #{worklog.file}"

      timeline.checkApiLimit (remainingCount) ->
        if remainingCount > 2500
          persistence.progressWorklog worklog._id, (err) ->
            if err?
              logger.error 'findOneWorklogs: ', {err: err}
              return callback err

            logger.debug "start progressing : #{worklog.file}"
            persistence.findTimeline worklog.file, (err, cursor) ->
              if err?
                logger.error 'findOneWorklogs: ', {err: err}
                return callback err

              logger.debug "found timeline : #{worklog.file}"

              cursor.count (err, count) ->
                logger.debug "timer #{worklog.file} has #{count}"

              isCompleted = false
              progressCount = 0

              innerLoop = (cur, concurrency) ->
                innerLoop(cur, concurrency - 1) if concurrency? and concurrency > 1
                logger.debug "start batch ##{concurrency}" if concurrency? and concurrency > 1
                progressCount += 1

                cur.nextObject (err, item) ->
                  if err?
                    logger.error "in nextObject: ", {err: err}
                    return

                  if item?
                    logger.debug "found item", {item: item._id}

                    urls = timeline.getCommitUrls item
                    logger.debug "urls: #{urls.length} - ", {urls: urls}

                    if urls.length is 0
                      innerLoop cur
                      return

                    invokedInnerLoop = false
                    urls.forEach (url) ->
                      timeline.getCommitInfo url, (err, commit) ->
                        if err?
                          logger.error 'getCommitInfo: ', {err: err, limit: /^API Rate Limit Exceeded/.test(err.message), isCompleted: isCompleted, progressCount: progressCount}
                          if /^API Rate Limit Exceeded/.test(err.message) and not isCompleted and progressCount > 2000
                            isCompleted = true
                            persistence.completeWorklog worklog._id, (err) ->
                              if err?
                                isCompleted = false
                                logger.error 'completeWorklog: ', {err: err}
                              logger.debug 'completed worklog', {file: worklog.file}
                          else if not /^API Rate Limit Exceeded/.test(err.message)
                            innerLoop cur
                        else
                          logger.debug "parsing commit #{url} : ", {commit: commit}
                          conventions = parser.parse commit
                          logger.debug "get conventions ", {convention: conventions}
                          conventions.forEach (conv) ->
                            data =
                              file: worklog.file
                              lang: conv.lang
                              convention: conv
                              regdate: new Date()
                            persistence.insertConvention data, (err) ->
                              logger.error 'insertConvention', {err: err} if err?
                              logger.info "insered convention - #{progressCount}"

                          logger.debug "before callback #{invokedInnerLoop} - #{item._id}"
                          if not invokedInnerLoop
                            logger.debug "call recurrsive - #{item._id}"
                            innerLoop cur
                            invokedInnerLoop = true
                  else
                    logger.debug "no item - #{progressCount}"
                    if not isCompleted and progressCount > 2000
                      isCompleted = true
                      persistence.completeWorklog worklog._id, (err) ->
                        if err?
                          isCompleted = false
                          logger.error 'completeWorklog: ', {err: err}
                        logger.debug 'completed worklog', {file: worklog.file}

              innerLoop(cursor, 5)

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
                    if doc.convention[key]?
                      baseConv.convention[key].column.forEach (elem) ->
                        baseConv.convention[key][elem.key] += doc.convention[key][elem.key]
                      baseConv.convention[key].commits = _.uniq(baseConv.convention[key].commits.concat doc.convention[key].commits)
                )for key, value of baseConv.convention
              else
                delete doc._id
                doc.regdate = new Date
                doc.shortfile = doc.file.substr 0, doc.file.lastIndexOf '-'

                sum.push doc
            persistence.insertScore sum, (err) ->
              if err?
                logger.error 'insertScore', {err: err}
                return
              logger.info 'inserted score'
              persistence.summarizeWorklog worklog._id, (err) ->
                if err?
                  logger.error 'summarizeWorklog', {err: err}
                  return
                logger.info 'summarized worklog', {file: worklog.file}

                persistence.dropTimeline worklog.file, (err) ->
                  if err?
                    logger.error 'drop timeline collection', {err: err}
                    return
                  logger.info 'dropped timeline collection', {collection: worklog.file}

            callback()
      else callback()

  findScore: (lang, callback) ->
    isCalledCallback = false
    persistence.findScoreCache lang, (err, cache) ->
      if cache?.data?
        isCalledCallback = true
        makeResult lang, cache.data, callback
      if not cache? or (new Date) - cache?.ts > 1800000 # 30min
        persistence.findScore lang, (err, cursor) ->
          if err?
            logger.error 'findScore', {err: err}
            return callback(err)

          languageDescription = parser.getParser(".#{lang}").parse("", {}, "")

          dailyData = []
          cursor.toArray (err, docs) ->
            logger.error "findScore toArray", {err: err} if err?
            if docs?.length
              docs.forEach (doc) ->
                # set convention description from parser
                (if key isnt 'lang'
                  doc.value[key].title = languageDescription[key].title
                  doc.value[key].column = languageDescription[key].column
                ) for key of doc.value
                score =
                  lang: lang
                  file: doc._id
                  convention: doc.value
                dailyData.push score

              # caching
              persistence.upsertScoreCache dailyData, lang, (err) ->

              makeResult(lang, dailyData, callback) if not isCalledCallback
            else
              callback new Error "#{lang} is not found" if not isCalledCallback

    makeResult = (lang, dailyData, callback) ->
      sumData =
        lang: lang
        period: []
        raw: dailyData

      dailyData.forEach (data) ->
        if not sumData.scores?
          sumData.scores = data.convention
          sumData.period.push data.file
        else
          (if key isnt 'lang'
            sumData.scores[key].column.forEach (elem) ->
              sumData.scores[key][elem.key] += data.convention[key][elem.key]
            sumData.scores[key].commits += data.convention[key].commits
          ) for key of sumData.scores

          sumData.period.push data.file

      # get total for percentage
      (if key isnt 'lang'
        total = 0
        sumData.scores[key].column.forEach (elem) ->
          total += sumData.scores[key][elem.key]
          elem.code = hljs.highlight(getHighlightName(lang), elem.code).value
        sumData.scores[key].total = total
      ) for key of sumData.scores

      callback null, sumData


  findDescription: (force, callback) ->
    # get commit count from cacahing when cache value is exist and in 1 hour
    if not force and service.totalDesc.regdate? and (new Date - service.totalDesc.regdate) < 3600000
      callback null, service.totalDesc
    else
      desc = {}
      persistence.findLastestScore (err, item) ->
        if err?
          logger.error 'findLastestScore', {err: err}
          return callback err

        desc.lastUpdate = item.file
        # caching
        service.totalDesc.lastUpdate = item.file

        persistence.findPeriodOfScore (err, docs) ->
          if err?
            logger.error 'findPeriodOfScore', {err: err}
            return callback err

          if docs?.length > 0
            docs.sort (a, b) ->
              if a.shortfile > b.shortfile then 1 else -1
            desc.startDate = docs[0].shortfile
            desc.endDate = docs[docs.length - 1].shortfile
            # caching
            service.totalDesc.startDate = docs[0].shortfile
            service.totalDesc.endDate = docs[docs.length - 1].shortfile

          persistence.findTotalCommits (err, cursor) ->
            if err?
              logger.error "findTotlaCommits", {err: err}
              return callback err

            cursor.toArray (err, docs) ->
              if err?
                logger.error "findTotlaCommits:toArray", {err: err}
                return callback err

              commitCount = 0
              docs.forEach (doc) ->
                commitCount += doc.value

              desc.commitCount = commitCount
              # caching
              service.totalDesc.commitCount = commitCount
              service.totalDesc.regdate = new Date

              callback null, desc

# private
progressRule = new schedule.RecurrenceRule()
progressRule.hour = [new schedule.Range(0, 23)]
progressRule.minute = [10, 30, 50]

schedule.scheduleJob progressRule, ->
  service.progressTimeline ->
    logger.info "progressTimeline is DONE!!!"

summarizeRule = new schedule.RecurrenceRule()
summarizeRule.hour = [new schedule.Range(0, 23)]
summarizeRule.minute = [5, 25, 45]

schedule.scheduleJob summarizeRule, ->
  service.summarizeScore ->
    logger.info "summarizeScore is DONE!!!"

descriptionRule = new schedule.RecurrenceRule()
descriptionRule.hour = [new schedule.Range(0, 23)]
descriptionRule.minute = [0]

schedule.scheduleJob descriptionRule, ->
  service.findDescription true, ->

hasLang = (sum, elem) ->
  sum.some (el) ->
    el.lang is elem.lang

getConventionByLang = (lang, sum) ->
  result = null
  sum.forEach (elem) ->
    result = elem if elem.lang is lang
  result

getHighlightName = (lang) ->
  map =
    js: 'javascript'
    java: 'java'
    py: 'python'
    scala: 'scala'
  map[lang]

importIntoMongodb = (datetime, callback) ->
  console.log "datetime #{datetime}"

  mongoImportCmd = ""

  which = spawn 'which', ["mongoimport"]
  which.stdout.on 'data', (data) ->
    mongoImportCmd = data.toString()
  which.on 'exit', (code) ->
    if (code is 0)
      args = [
        '--host', process.env['MONGODB_HOST']
        '--port', process.env['MONGODB_PORT']
        '--db', 'popular_convention'
        '--collection', datetime
        '--file', "#{archiveDir}/#{datetime}.json"
        '--type', 'json'
      ]
      if process.env['NODE_ENV'] is 'production'
        args = args.concat [
          '--username', process.env["MONGODB_USER"]
          '--password', process.env["MONGODB_PASS"]
        ]

      # remove trailing new line
      mongoImportCmd = mongoImportCmd.match(/([\w\/]+)/)[0]

      mongoimport = spawn mongoImportCmd, args
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

        deleteArchiveFile(datetime)
    else
      logger.error "mongoimport doesn't exist."
      callback(code)

deleteArchiveFile = (datetime) ->
  fs.unlink "#{archiveDir}/#{datetime}.json", (err) ->
    logger.error "delete #{archiveDir}/#{datetime}.json" if err

getYesterday = ->
  now = new Date
  year = now.getFullYear()
  month = "0#{now.getMonth() + 1}".slice(-2)
  date = "0#{now.getDate() - 1}".slice(-2)
  time = now.toLocaleTimeString().substr(0, 2) * 1
  "#{year}-#{month}-#{date}-#{time}"

archiveRule = new schedule.RecurrenceRule()
archiveRule.hour = [new schedule.Range(0, 23)]
archiveRule.minute = [10]

schedule.scheduleJob archiveRule, ->
  datetime = getYesterday()
  service.fetchGithubArchive datetime, (err) ->
    if err?
      logger.error "fetcharchive", {err: err}
    else
      logger.info 'fetched githubarchive', {datetime: datetime}
