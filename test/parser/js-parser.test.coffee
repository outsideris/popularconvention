# Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
# Licensed under the MIT license.
# <http://outsider.mit-license.org/>

should = require 'should'
parser = require '../../src/parser/js-parser'

describe 'js-parser >', ->

  describe 'comma >', ->

    it 'check first comma #1', ->
      convention = parser.comma ',fs = require(\'fs\')', {}
      convention.comma.first.should.equal 1

    it 'check first comma #2', ->
      convention = parser.comma '  ,fs = require(\'fs\')', {}
      convention.comma.first.should.equal 1

    it 'check first comma #3', ->
      convention = parser.comma '  fs = , require(\'fs\'),', {}
      convention.comma.first.should.equal 0

    it 'check first comma #4', ->
      convention = parser.comma '  , fs = require(\'fs\')', {}
      convention.comma.first.should.equal 1

    it 'check last comma #1', ->
      convention = parser.comma 'fs = require(\'fs\'),', {}
      convention.comma.last.should.equal 1

    it 'check last comma #2', ->
      convention = parser.comma '  fs = require(\'fs\'),', {}
      convention.comma.last.should.equal 1

    it 'check last comma #3', ->
      convention = parser.comma '  fs = require(\'fs\'),  ', {}
      convention.comma.last.should.equal 1

    it 'check last comma #4', ->
      convention = parser.comma ' ,fs = ,require(\'fs\'),', {}
      convention.comma.last.should.equal 1

  describe 'indent >', ->

    it 'check space indent #1', ->
      convention = parser.indent 'var a = 1;', {}
      convention.indent.space.should.equal 0

    it 'check space indent #2', ->
      convention = parser.indent '  var a = 1;', {}
      convention.indent.space.should.equal 1

    it 'check space indent #3', ->
      convention = parser.indent ' var a = 1;', {}
      convention.indent.space.should.equal 1

    it 'check space indent #4', ->
      convention = parser.indent '   var a = 1;', {}
      convention.indent.space.should.equal 1

    it 'check tab indent #1', ->
      convention = parser.indent '\tvar a = 1;', {}
      convention.indent.tab.should.equal 1

    it 'check tab indent #2', ->
      convention = parser.indent '\t\tvar a = 1;', {}
      convention.indent.tab.should.equal 1

    it 'check tab indent #3', ->
      convention = parser.indent '\t\t  var a = 1;  ', {}
      convention.indent.tab.should.equal 1

    it 'check tab indent #4', ->
      convention = parser.indent '  \tvar a = 1;', {}
      convention.indent.tab.should.equal 0

    it 'check tab indent #5', ->
      convention = parser.indent 'var a = 1;', {}
      convention.indent.tab.should.equal 0

  describe 'functiondef >', ->

    it 'check function definition followed by no space #1', ->
      convention = parser.functiondef 'var a = function() {', {}
      convention.functiondef.nospace.should.equal 1

    it 'check function definition followed by no space #2', ->
      convention = parser.functiondef 'var a = function() { return 1; };', {}
      convention.functiondef.nospace.should.equal 1

    it 'check function definition followed by no space #3', ->
      convention = parser.functiondef 'function a() {}', {}
      convention.functiondef.nospace.should.equal 1

    it 'check function definition followed by no space #4', ->
      convention = parser.functiondef 'a.fn(function() {})', {}
      convention.functiondef.nospace.should.equal 1

    it 'check function definition followed by no space #5', ->
      convention = parser.functiondef 'a.fn(function () {})', {}
      convention.functiondef.nospace.should.equal 0

    it 'check function definition followed by one space #1', ->
      convention = parser.functiondef 'var a = function () { return 1; };', {}
      convention.functiondef.onespace.should.equal 1

    it 'check function definition followed by one space #2', ->
      convention = parser.functiondef 'function a () {}', {}
      convention.functiondef.onespace.should.equal 1

    it 'check function definition followed by one space #3', ->
      convention = parser.functiondef 'a.fn(function () {})', {}
      convention.functiondef.onespace.should.equal 1

    it 'check function definition followed by one space #4', ->
      convention = parser.functiondef 'a.fn(function() {})', {}
      convention.functiondef.onespace.should.equal 0

  describe 'argumentdef >', ->

    it 'check argument definition with one space #1', ->
      convention = parser.argumentdef 'function a( arg1, arg2 ) {}', {}
      convention.argumentdef.onespace.should.equal 1

    it 'check argument definition with one space #2', ->
      convention = parser.argumentdef 'function a ( arg1, arg2 ) {}', {}
      convention.argumentdef.onespace.should.equal 1

    it 'check argument definition with one space #3', ->
      convention = parser.argumentdef 'a.fn(function( arg1, arg2 ) {})', {}
      convention.argumentdef.onespace.should.equal 1

    it 'check argument definition with one space #4', ->
      convention = parser.argumentdef 'a.fn(function (arg1, arg2) {})', {}
      convention.argumentdef.onespace.should.equal 0

    it 'check argument definition with no space #1', ->
      convention = parser.argumentdef 'var a = function(arg1, arg2) {', {}
      convention.argumentdef.nospace.should.equal 1

    it 'check argument definition with no space #2', ->
      convention = parser.argumentdef 'var a = function (arg1, arg2) { return 1; };', {}
      convention.argumentdef.nospace.should.equal 1

    it 'check argument definition with no space #3', ->
      convention = parser.argumentdef 'function a(arg1, arg2 ) {}', {}
      convention.argumentdef.nospace.should.equal 1

    it 'check argument definition with no space #4', ->
      convention = parser.argumentdef 'a.fn(function (arg1, arg2) {})', {}
      convention.argumentdef.nospace.should.equal 1

    it 'check argument definition with no space #5', ->
      convention = parser.argumentdef 'function a ( arg1, arg2 ) {}', {}
      convention.argumentdef.nospace.should.equal 0

  describe 'literaldef >', ->

    it 'check object literal definition with trace space #1', ->
      convention = parser.literaldef '  init: "value",', {}
      convention.literaldef.tracespace.should.equal 1

    it 'check object literal definition with trace space #2', ->
      convention = parser.literaldef ' init: function() { ', {}
      convention.literaldef.tracespace.should.equal 1

    it 'check object literal definition with trace space #3', ->
      convention = parser.literaldef '{ key: value, key: value }', {}
      convention.literaldef.tracespace.should.equal 1

    it 'check object literal definition with trace space #4', ->
      convention = parser.literaldef ' init : function() { ', {}
      convention.literaldef.tracespace.should.equal 0

    it 'check object literal definition with both space #1', ->
      convention = parser.literaldef '  init : "value",', {}
      convention.literaldef.bothspace.should.equal 1

    it 'check object literal definition with both space #2', ->
      convention = parser.literaldef ' init : function() { ', {}
      convention.literaldef.bothspace.should.equal 1

    it 'check object literal definition with both space #3', ->
      convention = parser.literaldef '{ key : value, key: value }', {}
      convention.literaldef.bothspace.should.equal 1

    it 'check object literal definition with both space #4', ->
      convention = parser.literaldef ' init: function() { ', {}
      convention.literaldef.bothspace.should.equal 0

    it 'check object literal definition with no space #1', ->
      convention = parser.literaldef '  init:"value",', {}
      convention.literaldef.nospace.should.equal 1

    it 'check object literal definition with no space #2', ->
      convention = parser.literaldef ' init:function() { ', {}
      convention.literaldef.nospace.should.equal 1

    it 'check object literal definition with no space #3', ->
      convention = parser.literaldef '{ key:value, key: value }', {}
      convention.literaldef.nospace.should.equal 1

    it 'check object literal definition with no space #4', ->
      convention = parser.literaldef ' init :function() { ', {}
      convention.literaldef.nospace.should.equal 0

  describe 'conditionstatement >', ->

    it 'check condition statement with one space #1', ->
      convention = parser.conditionstatement 'if ( a = 1) {', {}
      convention.conditionstatement.onespace.should.equal 1

    it 'check condition statement with one space #2', ->
      convention = parser.conditionstatement 'while ( ture ) {', {}
      convention.conditionstatement.onespace.should.equal 1

    it 'check condition statement with one space #3', ->
      convention = parser.conditionstatement 'switch ( a ) {', {}
      convention.conditionstatement.onespace.should.equal 1

    it 'check condition statement with one space #4', ->
      convention = parser.conditionstatement 'if( a = 1) {', {}
      convention.conditionstatement.onespace.should.equal 0

    it 'check condition statement with no space #1', ->
      convention = parser.conditionstatement 'if( a = 1) {', {}
      convention.conditionstatement.nospace.should.equal 1

    it 'check condition statement with no space #2', ->
      convention = parser.conditionstatement 'while( ture ) {', {}
      convention.conditionstatement.nospace.should.equal 1

    it 'check condition statement with no space #3', ->
      convention = parser.conditionstatement 'switch( a ) {', {}
      convention.conditionstatement.nospace.should.equal 1

    it 'check condition statement with no space #4', ->
      convention = parser.conditionstatement 'if ( a = 1) {', {}
      convention.conditionstatement.nospace.should.equal 0

  describe 'blockstatement >', ->

    it 'check block statement with one space #1', ->
      convention = parser.blockstatement 'if (true) { return; }', {}
      convention.blockstatement.onespace.should.equal 1

    it 'check block statement with one space #2', ->
      convention = parser.blockstatement '} else if ( true ) {', {}
      convention.blockstatement.onespace.should.equal 1

    it 'check block statement with one space #3', ->
      convention = parser.blockstatement '} else if ( true ) {', {}
      convention.blockstatement.onespace.should.equal 1

    it 'check block statement with one space #4', ->
      convention = parser.blockstatement 'else if (true) {', {}
      convention.blockstatement.onespace.should.equal 1

    it 'check block statement with one space #5', ->
      convention = parser.blockstatement 'if (true){ return; }', {}
      convention.blockstatement.onespace.should.equal 0

    it 'check block statement with no space #1', ->
      convention = parser.blockstatement 'if (true){ return (); }', {}
      convention.blockstatement.nospace.should.equal 1

    it 'check block statement with no space #2', ->
      convention = parser.blockstatement '}else if (true){', {}
      convention.blockstatement.nospace.should.equal 1

    it 'check block statement with no space #3', ->
      convention = parser.blockstatement 'if (true)', {}
      convention.blockstatement.nospace.should.equal 0

    it 'check block statement with no space #4', ->
      convention = parser.blockstatement '} else if(true) {', {}
      convention.blockstatement.nospace.should.equal 0

    it 'check block statement at new line #1', ->
      convention = parser.blockstatement 'if (true)', {}
      convention.blockstatement.newline.should.equal 1

    it 'check block statement at new line #2', ->
      convention = parser.blockstatement 'if (true) // comment', {}
      convention.blockstatement.newline.should.equal 1

    it 'check block statement at new line #3', ->
      convention = parser.blockstatement 'if (true)/* */', {}
      convention.blockstatement.newline.should.equal 1

    it 'check block statement at new line #4', ->
      convention = parser.blockstatement 'else if (true)', {}
      convention.blockstatement.newline.should.equal 1

    it 'check block statement at new line #5', ->
      convention = parser.blockstatement 'else if (true) {', {}
      convention.blockstatement.newline.should.equal 1

    it 'check block statement at new line #6', ->
      convention = parser.blockstatement '}  else if ( true ) {', {}
      convention.blockstatement.newline.should.equal 0
