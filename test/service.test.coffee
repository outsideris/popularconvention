# Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
# Licensed under the MIT license.
# <http://outsider.mit-license.org/>

should = require 'should'
service = require '../src/service'
timeline = require '../src/timeline'
parser = require '../src/parser/parser'

describe 'service >', ->

  before (done) ->
    setTimeout (->
      done()
    ), 1000


  it.skip 'fetch githubarchive', (done) ->
    service.fetchGithubArchive "2013-04-01-15", (err) ->
      done()

  it 'progress timeline', (done) ->
    service.progressTimeline (err) ->
      setTimeout (->
        done()
      ), 200000

  it 'summarize score', (done) ->
    service.summarizeScore (err) ->
      setTimeout (->
        done()
      ), 10000

  it 'find score', (done) ->
    service.findScore 'js', (err, scores) ->
      #console.log(require('util').inspect(scores, false, 5));
      done()

  it 'parsing commit test', (done) ->
    process.on 'uncaughtException', (err) ->
      console.log('Caught exception: ' + err);

    item =
      repository:
        owner: 'infinispan'
        name: 'infinispan'
      payload:
        shas: [[
          "c1f3fcbf538ee809396b968fe1965573fa5e3bd8"
        ]]

    urls = timeline.getCommitUrls item
    timeline.getCommitInfo urls[0], (err, commit) ->
      conventions = parser.parse commit
      console.log conventions
      done()

  it 'find desc', (done) ->
    service.findDescription (err, desc) ->
      console.log desc
      done()

