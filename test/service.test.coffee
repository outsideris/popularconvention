# Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
# Licensed under the MIT license.
# <http://outsider.mit-license.org/>

should = require 'should'
service = require '../src/service'

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
      console.log(require('util').inspect(scores, false, 5));
      done()
