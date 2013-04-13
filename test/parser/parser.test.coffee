# Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
# Licensed under the MIT license.
# <http://outsider.mit-license.org/>

should = require 'should'
fs = require 'fs'
path = require 'path'
parser = require '../../src/parser/parser'

describe 'parser >', ->
  commitFixture = ''

  before ->
    fixturePath = path.resolve "#{__dirname}", "../fixture"
    commitFixture  = fs.readFileSync "#{fixturePath}/commit.json", 'utf8'

  it 'parse commit info', ->
    patch = parser.parsePatch commitFixture
    patch.length.should.equal 1

  it 'parse token patch for addition', ->
    tokens = parser.parseAdditionTokens JSON.parse(commitFixture).files[0].patch
    tokens.length.should.equal 5

  it 'parse commit', ->
    conventions = parser.parse commitFixture
    #console.log require('util').inspect(conventions, false, 5)
