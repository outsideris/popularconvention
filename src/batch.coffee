# # service layer
#
# Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
# Licensed under the MIT license.
# <http://outsider.mit-license.org/>

logger = (require './helpers').logger
schedule = require 'node-schedule'
service = require './service'

helpers = (require './helpers')
http = require 'http'
fs = require 'fs'
zlib = require 'zlib'
path = require 'path'
spawn = require('child_process').spawn
persistence = require './persistence'
timeline = require './timeline'
parser = require './parser/parser'
_ = require 'underscore'
hljs = require 'highlight.js'
moment = require 'moment'

# directory for temporary download json files from github archive
archiveDir = "#{__dirname}/archive"
fs.exists archiveDir, (exist) ->
  if not exist then fs.mkdirSync archiveDir

# batch to process timetile imported from github archive
processRule = new schedule.RecurrenceRule()
processRule.hour = [new schedule.Range(0, 23)]
processRule.minute = [10, 30, 50]

schedule.scheduleJob processRule, ->
  service.processTimeline ->
    logger.info "processTimeline is DONE!!!"

# batch to summarize convention score by same time
summarizeRule = new schedule.RecurrenceRule()
summarizeRule.hour = [new schedule.Range(0, 23)]
summarizeRule.minute = [5, 25, 45]

schedule.scheduleJob summarizeRule, ->
  service.summarizeScore ->
    logger.info "summarizeScore is DONE!!!"

# batch to cache total description for footer
descriptionRule = new schedule.RecurrenceRule()
descriptionRule.hour = [new schedule.Range(0, 23)]
descriptionRule.minute = [0]

schedule.scheduleJob descriptionRule, ->
  service.findDescription true, ->

# batch to fetch json file from githubarchive and import to mongoDB
archiveRule = new schedule.RecurrenceRule()
archiveRule.hour = [new schedule.Range(0, 23)]
archiveRule.minute = [10]

schedule.scheduleJob archiveRule, ->
  datetime = getOneDayAgo()
  service.fetchGithubArchive datetime, (err) ->
    if err?
      logger.error "fetcharchive", {err: err}
    else
      logger.info 'fetched githubarchive', {datetime: datetime}

getOneDayAgo = ->
  moment().add('d', -1).format("YYYY-MM-DD-H")
