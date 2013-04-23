# # Handle github timeline
#
# Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
# Licensed under the MIT license.
# <http://outsider.mit-license.org/>

restler = require 'restler'
path = require 'path'
fs = require 'fs'
helpers = require './helpers'
logger = helpers.logger

githubHost = 'https://api.github.com'
# github.json contained token should be in .tokens directory
# ex: { "cliendId": "", "clientSecret": "" }
# WARRING: MUST NOT commit github.json file
tokenPath = path.resolve "#{__dirname}", "../.tokens"
token = JSON.parse(fs.readFileSync "#{tokenPath}/github.json", 'utf8')
postfix = "?client_id=#{token.cliendId}&client_secret=#{token.clientSecret}"

tl = module.exports =
  getCommitUrls: (timeline) ->
    # GET /repos/:owner/:repo/commits/:sha
    timeline = JSON.parse timeline if 'string' is helpers.extractType timeline

    repo = timeline.repository
    "/repos/#{repo.owner}/#{repo.name}/commits/#{sha[0]}" for sha in timeline.payload.shas

  getCommitInfo: (url, callback) ->
    restler.get(generateApiUrl url)
           .on 'success', (data, res) ->
             #'x-ratelimit-limit': '5000',
             #'x-ratelimit-remaining': '4986',
             logger.info "github api limit: #{res.headers['x-ratelimit-remaining']}" if res.headers['x-ratelimit-remaining'] % 50 is 0
             logger.error "github api limit: #{res.headers['x-ratelimit-remaining']}" if res.headers['x-ratelimit-remaining'] < '10'
             callback null, data, res
           .on 'fail', (data, res) ->
             callback data

  checkApiLimit: (callback) ->
    restler.get(generateApiUrl "/users/whatever")
           .on 'success', (data, res) ->
              logger.debug "API rate ramained #{res.headers['x-ratelimit-remaining']}"
              callback res.headers['x-ratelimit-remaining']
           .on 'fail', (data, res) ->
              logger.debug "API rate ramained #{res.headers['x-ratelimit-remaining']}"
              callback res.headers['x-ratelimit-remaining']

# private
generateApiUrl = (url) ->
  "#{githubHost}#{url}#{postfix}"
