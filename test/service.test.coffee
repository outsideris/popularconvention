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
      console.log('called callback')
      setTimeout (->
        done()
      ), 200000
