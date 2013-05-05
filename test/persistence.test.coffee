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

  it 'find lastest score', (done) ->
    persistence.findLastestScore (err, item) ->
      console.log(item);
      done()

  it 'find period', (done) ->
    persistence.findPeriodOfScore (err, item) ->
      item.sort (a, b) ->
        if a.shortfile > b.shortfile then 1 else -1

      console.log item[0]
      console.log item[item.length - 1]
      done()
