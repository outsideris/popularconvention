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

dbserver = null

module.exports =
  open: (callback) ->
    MongoClient.connect "mongodb://#{process.env['MONGODB_HOST']}:#{process.env['MONGODB_PORT']}/popular_convention", (err, db) ->
      return callback(err) if err?
      dbserver = db
      worklogs = dbserver.collection 'worklogs'
      conventions = dbserver.collection 'conventions'
      score = dbserver.collection 'score'

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

  upsertScore: (data, callback) ->
    score.update {_id: data._id}, data, {upsert: true}, callback

  findScoreByLang: (lang, callback) ->
    score.find {lang: lang}, {sort: [['shortfile', -1]]}, callback

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

  findScoreByFileAndLang: (file, lang, callback) ->
    score.findOne {shortfile: file, lang: lang}, callback

  findPeriodOfScore: (callback) ->
    score.group(['shortfile'], {}, {}, "function() {}", callback)

  getTimeline: (callback) ->
    conventions.find().limit 10, callback
