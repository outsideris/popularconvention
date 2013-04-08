# # manage persistence layer
#
# Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
# Licensed under the MIT license.
# <http://outsider.mit-license.org/>

MongoClient = (require 'mongodb').MongoClient
logger = (require './helpers').logger

worklogs = null
archives = null
conventions = null

dbserver = null

module.exports =
  open: (callback) ->
    MongoClient.connect 'mongodb://localhost:27017/popular_convention', (err, db) ->
      return callback(err) if err
      dbserver = db
      worklogs = dbserver.collection 'worklogs'
      archives = dbserver.collection 'archives'
      conventions = dbserver.collection 'conventions'
      callback()

  insertWorklogs: (doc, callback) ->
    worklogs.insert doc, callback

  progressWorklog: () ->
    worklogs.update

  completeWorklog: ->
    worklogs.update

  getTimeline: (callback) ->
    conventions.find().limit 10, callback
