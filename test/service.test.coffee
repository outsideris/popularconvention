# Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
# Licensed under the MIT license.
# <http://outsider.mit-license.org/>

should = require 'should'
service = require '../src/service'

describe 'service >', ->

  it.skip 'fetch githubarchive', (done) ->
    service.fetchGithubArchive "2013-04-01-15", (err) ->
      done()
