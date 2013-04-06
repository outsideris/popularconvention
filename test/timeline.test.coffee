# Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
# Licensed under the MIT license.
# <http://outsider.mit-license.org/>

should = require 'should'
fs = require 'fs'
timeline = require '../src/timeline'

describe 'timeline >', ->
  timelineFixture = ''

  before ->
    timelineFixture  = fs.readFileSync "#{__dirname}/fixture/timelineFixture.json", 'utf8'

  it 'generating blob urls from timeline json', ->
    urls = timeline.getCommitUrls timelineFixture
    urls.length.should.equal 2

  it 'check commits urls', ->
    fixture =
      payload:
        shas: [
          ["dff0c78f5af1d1bb38ac07363ea881f0df0f7535", true]
          ["0649e5e9d2f71c96517bca1b582c706e665bca6a", true]
        ]
      repository:
        name: "test"
        owner: "mockrepo"

    urls = timeline.getCommitUrls fixture
    urls[0].should.equal "/repos/mockrepo/test/commits/dff0c78f5af1d1bb38ac07363ea881f0df0f7535"

  it 'should get commit info', (done) ->
    timeline.getCommitInfo "/repos/outsideris/curlybrace/commits/29321fd1ec6a83af4813d7dee76a348e1fe034ed", (err, commits) ->
      should.not.exist err
      commits.sha.should.equal "29321fd1ec6a83af4813d7dee76a348e1fe034ed"
      done()

