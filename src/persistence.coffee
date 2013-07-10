# # manage persistence layer
#
# Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
# Licensed under the MIT license.
# <http://outsider.mit-license.org/>

MongoClient = (require 'mongodb').MongoClient
logger = (require './helpers').logger

worklogs = null
conventions = null
score = null
scoreCache  = null

dbserver = null

module.exports =
  open: (callback) ->
    MongoClient.connect "mongodb://#{process.env['MONGODB_HOST']}:#{process.env['MONGODB_PORT']}/popular_convention", (err, db) ->
      return callback(err) if err?
      dbserver = db
      worklogs = dbserver.collection 'worklogs'
      conventions = dbserver.collection 'conventions'
      score = dbserver.collection 'score'
      scoreCache = dbserver.collection 'scorecache'

      if process.env['NODE_ENV'] is 'production'
        db.authenticate process.env["MONGODB_USER"], process.env["MONGODB_PASS"], (err, result) ->
          return callback(err) if err? or result isnt true

          # ensure index
          dbserver.ensureIndex 'conventions', {timestamp: 1}, (err) ->
            return callback(err) if err?
            dbserver.ensureIndex 'score', {shortfile: 1, lang: 1, file: 1}, (err) ->
              return callback(err) if err?

              callback()
      else
        # ensure index
        dbserver.ensureIndex 'conventions', {timestamp: 1}, (err) ->
          return callback(err) if err?
          dbserver.ensureIndex 'score', {shortfile: 1, lang: 1, file: 1}, (err) ->
            return callback(err) if err?

            callback()

  insertWorklogs: (doc, callback) ->
    worklogs.insert doc, callback

  processWorklog: (id, callback) ->
    worklogs.update {_id: id}, {$set: {inProcess: true}}, callback

  completeWorklog: (id, callback) ->
    worklogs.update {_id: id}, {$set: {completed: true, completeDate: new Date}}, callback

  summarizeWorklog: (id, callback) ->
    worklogs.update {_id: id}, {$set: {summarize: true}}, callback

  findOneWorklogToProcess: (callback) ->
    worklogs.findOne({
      "inProcess": false
      "completed": false
    }, callback)

  findOneWorklogToSummarize: (callback) ->
    worklogs.findOne({
      "completed": true
      "summarize": false
    }, callback)

  findTimeline: (coll, callback) ->
    dbserver.collection(coll).find {type: 'PushEvent', repository: {$exists: true}},
      {sort: {repository: {watchers: 1, forks: 1}}}, callback

  dropTimeline: (coll, callback) ->
    dbserver.collection(coll).drop callback

  insertConvention: (conv, callback) ->
    conventions.insert conv, callback

  findConvention: (file, callback) ->
    conventions.find {
      "file": file
    }, callback

  insertScore: (data, callback) ->
    score.insert data, callback

  findScore: (lang, callback) ->
    map = ->
      emit @shortfile, @convention

    reduce = (shortfile, scores) ->
      keys = (obj) ->
        arr = []
        has = Object.prototype.hasOwnProperty
        arr.push i for i of obj when has.call(obj, i)
        arr

      result = null
      (
        if keys(score).length > 1
          if result?
            (if key isnt 'lang'
              result[key].column.forEach (elem) ->
                result[key][elem.key] += score[key][elem.key]
              result[key].commits += score[key].commits
            ) for key of score
          else
            result = score
      ) for score in scores

      result

    score.mapReduce map, reduce, {out: 'tempmr2', query: {lang: lang}}, (err, coll) ->
      logger.error "findScore MR: ", {err: err} if err?
      coll.find callback

  findLastestScore: (callback) ->
    lastest = null
    score.findOne {}, {sort: [['file', -1]]}, (err, item) ->
      if err?
        callback err
      else if item?
        lastest = item
        score.findOne {file: new RegExp(lastest.shortfile + '-2[0-3]')}, {sort: [['file', -1]]}, (err, item) ->
          if err?
            callback err
          else if item?
            callback null, item
          else
            score.findOne {file: new RegExp(lastest.shortfile + '-1[0-9]')}, {sort: [['file', -1]]}, (err, item) ->
              if err?
                callback err
              else if item?
                callback null, item
              else
                callback null, lastest
      else
        callback null, null


  findPeriodOfScore: (callback) ->
    score.group(['shortfile'], {}, {}, "function() {}", callback)

  findTotalCommits: (callback) ->
    map = () ->
      unique = (arr) ->
        u = {}
        a = []

        (a.push(el); u[el] = 1) for el in arr when not u.hasOwnProperty(el)
        a

      result = []
      (
        if key isnt 'lang'
          result = result.concat @convention[key].commits
          result = unique result
      ) for key of @convention
      emit @file, result

    reduce = (file, commits) ->
      unique = (arr) ->
        u = {}
        a = []

        (a.push(el); u[el] = 1) for el in arr when not u.hasOwnProperty(el)
        a

      totalCommits = []
      (
        totalCommits = totalCommits.concat commit
      ) for commit in commits
      (unique totalCommits).length

    score.mapReduce map, reduce, {out: 'tempmr'}, (err, coll) ->
      coll.find callback

  getTimeline: (callback) ->
    conventions.find().limit 10, callback

  upsertScoreCache: (data, lang, callback) ->
    d =
      _id: lang
      ts: new Date
      data: data
    scoreCache.update {_id: lang}, d, {upsert: true}, callback

  findScoreCache: (lang, callback) ->
    scoreCache.findOne {_id: lang}, callback
