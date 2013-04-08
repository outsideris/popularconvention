# Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
# Licensed under the MIT license.
# <http://outsider.mit-license.org/>

should = require 'should'
persistence = require '../src/persistence'

describe 'persistence >', ->

  before (done) ->
    persistence.open ->
      done()

  it 'do getTimeline', (done) ->
    persistence.getTimeline (err, docs) ->
      should.exist docs
      done()
