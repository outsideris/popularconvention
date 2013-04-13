# # manage persistence layer
#
# Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
# Licensed under the MIT license.
# <http://outsider.mit-license.org/>

MongoClient = (require 'mongodb').MongoClient
logger = (require './helpers').logger

worklogs = null
conventions = null

dbserver = null

module.exports =
  open: (callback) ->
    MongoClient.connect 'mongodb://localhost:27017/popular_convention', (err, db) ->
      return callback(err) if err
      dbserver = db
      worklogs = dbserver.collection 'worklogs'
      conventions = dbserver.collection 'conventions'
      callback()

  insertWorklogs: (doc, callback) ->
    worklogs.insert doc, callback

  progressWorklog: (id, callback) ->
    worklogs.update {_id: id}, {$set: {inProgress: true}}, callback

  completeWorklog: (id, callback) ->
    worklogs.update {_id: id}, {$set: {completed: true}}, callback

  findOneWorklogs: (callback) ->
    worklogs.findOne({
      "inProgress": false
      "completed": false
    }, callback)

  findTimeline: (coll, callback) ->
    dbserver.collection(coll).find {type: 'PushEvent', repository: {$exists: true}},
      {sort: {repository: {watchers: 1, forks: 1}}}, callback

  insertConvention: (conv, callback) ->
    conventions.insert conv, callback

  getTimeline: (callback) ->
    conventions.find().limit 10, callback
