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

# connect MongoDB
persistence.open (err) ->
  return logger.error 'mongodb is not connected', {err: err} if err?
  logger.info 'mongodb is connected'

# directory for temporary download json files from github archive
archiveDir = "#{__dirname}/archive"
fs.exists archiveDir, (exist) ->
  if not exist then fs.mkdirSync archiveDir

service = module.exports =
  # description object to display infomation footer in site
  totalDesc:
    lastUpdate: null
    startDate: null
    endDate: null
    regdate: null

  # download timeline json file from github archive
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

  processTimeline: (callback) ->
    persistence.findOneWorklogToProcess (err, worklog) ->
      logger.error 'findOneWorklogToProcess: ', {err: err} if err?
      return callback() if err? or not worklog?

      logger.debug "found worklog to process : #{worklog.file}"

      timeline.checkApiLimit (remainingCount) ->
        if remainingCount > 2500
          persistence.processWorklog worklog._id, (err) ->
            if err?
              logger.error 'findOneWorklogs: ', {err: err}
              return callback err

            logger.debug "start processing : #{worklog.file}"
            persistence.findTimeline worklog.file, (err, cursor) ->
              if err?
                logger.error 'findOneWorklogs: ', {err: err}
                return callback err

              logger.debug "found timeline : #{worklog.file}"

              cursor.count (err, count) ->
                logger.debug "timer #{worklog.file} has #{count}"

              isCompleted = false
              processCount = 0

              innerLoop = (cur, concurrency) ->
                innerLoop(cur, concurrency - 1) if concurrency? and concurrency > 1
                logger.debug "start batch ##{concurrency}" if concurrency? and concurrency > 1
                processCount += 1

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
                          logger.error 'getCommitInfo: ', {err: err, limit: /^API Rate Limit Exceeded/i.test(err.message), isCompleted: isCompleted, processCount: processCount}
                          if /^API Rate Limit Exceeded/i.test(err.message) and not isCompleted and processCount > 2000
                            isCompleted = true
                            persistence.completeWorklog worklog._id, (err) ->
                              if err?
                                isCompleted = false
                                logger.error 'completeWorklog: ', {err: err}
                              logger.debug 'completed worklog', {file: worklog.file}
                          else if not /^API Rate Limit Exceeded/i.test(err.message)
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
                              logger.info "insered convention - #{processCount}"

                          logger.debug "before callback #{invokedInnerLoop} - #{item._id}"
                          if not invokedInnerLoop
                            logger.debug "call recurrsive - #{item._id}"
                            innerLoop cur
                            invokedInnerLoop = true
                  else
                    logger.debug "no item - #{processCount}"
                    if not isCompleted and processCount > 2000
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
            conventionList = []
            docs.forEach (doc) ->
              if hasLang(conventionList , doc)
                baseConv = getConventionByLang doc.lang, conventionList

                mergeConvention baseConv.convention, doc.convention
              else
                delete doc._id
                doc.regdate = new Date
                doc.shortfile = doc.file.substr 0, doc.file.lastIndexOf '-'

                conventionList.push doc

            # convert commits to commit count
            (
              (
                value.commits = value.commits.length if value.commits?
              ) for key, value of item.convention
            ) for item in conventionList

            fileOfDay = worklog.file.substr 0, worklog.file.lastIndexOf '-'
            # merge convention if convention of same is exist
            mergeInExistConvention = (convList) ->
              if convList.length
                conv = convList.pop()
                persistence.findScoreByFileAndLang fileOfDay, conv.lang, (err, item) ->
                  if err?
                    logger.error 'findScoreByFile', {err: err}
                    return
                  logger.debug 'findScoreByFileAndLang', {item: item}
                  if item?
                    mergeConvention conv.convention, item.convention,
                    conv._id = item._id

                  persistence.upsertScore conv, (err) ->
                    if err?
                      logger.error 'upsertScore', {err: err}
                    logger.info 'upserted score', {conv: conv}
                    mergeInExistConvention convList
              else
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

            mergeInExistConvention conventionList

            callback()
      else callback()

  findScore: (lang, callback) ->
    persistence.findScoreByLang lang, (err, cursor) ->
      if err?
        logger.error 'findScoreByLang', {err: err}
        return callback(err)

      langParser = parser.getParser(".#{lang}")
      if (langParser)
        languageDescription = parser.getParser(".#{lang}").parse("", {}, "")
      else
        callback new Error "#{lang} is not found"

      dailyData = []
      cursor.toArray (err, docs) ->
        logger.error "findScoreByLang toArray", {err: err} if err?
        logger.debug "findByLang", {docs: docs}
        if docs?.length
          docs.forEach (doc) ->
            # set convention description from parser
            (if key isnt 'lang'
              doc.convention[key].title = languageDescription[key].title
              doc.convention[key].column = languageDescription[key].column
            ) for key of doc.convention
            score =
              lang: lang
              file: doc.shortfile
              convention: doc.convention
            dailyData.push score

          makeResult(lang, dailyData, callback)
        else
          callback new Error "#{lang} is not found"

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

        if item?
          # caching
          service.totalDesc.lastUpdate = item.file

          persistence.findPeriodOfScore (err, docs) ->
            if err?
              logger.error 'findPeriodOfScore', {err: err}
              return callback err

            if docs?.length > 0
              docs.sort (a, b) ->
                if a.shortfile > b.shortfile then 1 else -1
              # caching
              service.totalDesc.startDate = docs[0].shortfile
              service.totalDesc.endDate = docs[docs.length - 1].shortfile
              service.totalDesc.regdate = new Date

              callback null, service.totalDesc
        else
          callback null, service.totalDesc

# private
hasLang = (sum, elem) ->
  sum.some (el) ->
    el.lang is elem.lang

getConventionByLang = (lang, convList) ->
  result = null
  convList.forEach (elem) ->
    result = elem if elem.lang is lang
  result

getHighlightName = (lang) ->
  map =
    js: 'javascript'
    java: 'java'
    py: 'python'
    scala: 'scala'
    rb: 'ruby'
  map[lang]

mongoImportCmd = ""
findMongoImportCmd = (datetime, callback) ->
  if (mongoImportCmd)
    callback null, mongoImportCmd
  else
    which = spawn 'which', ["mongoimport"]
    which.stdout.on 'data', (data) ->
      mongoImportCmd = data.toString()
    which.on 'exit', (code) ->
      if (code is 0)
        # remove trailing new line
        mongoImportCmd = mongoImportCmd.match(/([\w\/]+)/)[0]
        callback null, mongoImportCmd
      else
        logger.error "mongoimport doesn't exist."
        callback(code)

importIntoMongodb = (datetime, callback) ->
  findMongoImportCmd datetime, (err, mongoCmd) ->
    if err?
      logger.error "error occured during mongoimport"
    else
      args = [
        '--host', process.env['MONGODB_HOST']
        '--port', process.env['MONGODB_PORT']
        '--db', 'popular_convention2'
        '--collection', datetime
        '--file', "#{archiveDir}/#{datetime}.json"
        '--type', 'json'
      ]
      if process.env['NODE_ENV'] is 'production'
        args = args.concat [
          '--username', process.env["MONGODB_USER"]
          '--password', process.env["MONGODB_PASS"]
        ]

      mongoimport = spawn mongoCmd, args
      mongoimport.stderr.on 'data', (data) ->
        logger.error "mongoimport error occured"
      mongoimport.on 'close', (code) ->
        logger.info "mongoimport exited with code #{code}"
        doc =
          file: datetime
          inProcess: false
          completed: false
          summarize: false
        persistence.insertWorklogs doc, (->
          callback()) if code is 0
        callback(code) if code isnt 0

        deleteArchiveFile(datetime)

deleteArchiveFile = (datetime) ->
  fs.unlink "#{archiveDir}/#{datetime}.json", (err) ->
    logger.error "delete #{archiveDir}/#{datetime}.json" if err

mergeConvention = (baseConvention, newConvention) ->
  (
    if key isnt 'lang'
      if newConvention[key]?
        conv[k] += newConvention[key][k] for k of conv when k isnt 'commits'
        if conv.commits.concat?
          conv.commits = _.uniq(conv.commits.concat newConvention[key].commits)
        else
          conv.commits = conv.commits + newConvention[key].commits
  )for key, conv of baseConvention

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
        if (data.convention[key]?)
          sumData.scores[key].column.forEach (elem) ->
            sumData.scores[key][elem.key] += data.convention[key][elem.key]
          sumData.scores[key].commits += data.convention[key].commits
      ) for key of sumData.scores
      # add new field not exist
      (
        sumData.scores[key] = data.convention[key]
      ) for key in Object.keys(data.convention).filter (x) ->
        !~Object.keys(sumData.scores).indexOf x

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
