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

    it 'check argument definition with no space #6', ->
      convention = parser.argumentdef '       }//if                                               -', {}
      convention.argumentdef.nospace.should.equal 0
      convention.argumentdef.onespace.should.equal 0

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

  describe 'linelength >', ->

    it 'line length is 80 characters #1', ->
      convention = parser.linelength '    public String findFirstName( String name, String age) { return \"a\"; }', {}
      convention.linelength.char80.should.equal 1

    it 'line length is 80 characters #2', ->
      convention = parser.linelength '\t\tpublic String findFirstName( String name, String age) { return \"a\"; }', {}
      convention.linelength.char80.should.equal 1

    it 'line length is 80 characters #3', ->
      convention = parser.linelength '\t\t\tpublic String findFirstName( String name, String age) { return \"a\"; }', {}
      convention.linelength.char80.should.equal 0

    it 'line length is 120 characters #1', ->
      convention = parser.linelength '    public String findFirstName( String name, String age, String job) { return \"a\"; }', {}
      convention.linelength.char120.should.equal 1

    it 'line length is 120 characters #2', ->
      convention = parser.linelength '\t\tpublic String findFirstName( String name, String age, String job) { return \"a\"; }', {}
      convention.linelength.char120.should.equal 1

    it 'line length is 120 characters #3', ->
      convention = parser.linelength '\t\tpublic String findFirstName( String name, String age) { return \"a\"; }', {}
      convention.linelength.char120.should.equal 0

    it 'line length is 150 characters #1', ->
      convention = parser.linelength '    public String findFirstName( String name, String age, String job) { return \"a\"; } //afijfjeovjfiejffjeifjidjvosjfiejfioejovfjeifjiejfosjfioejfoiejfoi', {}
      convention.linelength.char150.should.equal 1

  describe 'quotes >', ->

    it 'single quote #1', ->
      convention = parser.quotes """  var foo = 'bar';"""
      convention.quotes.single.should.equal 1

    it 'single quote #2', ->
      convention = parser.quotes """  var foo = '<div id="bar">baz</div>';"""
      convention.quotes.single.should.equal 1

    it 'single quote #3', ->
      convention = parser.quotes """  var foo = '<div id=\'bar\'>baz</div>';"""
      convention.quotes.single.should.equal 1

    it 'single quote #4', ->
      convention = parser.quotes """ 'key': 'value' """
      convention.quotes.single.should.equal 1

    it 'single quote #5', ->
      convention = parser.quotes """ 'key': true """
      convention.quotes.single.should.equal 1

    it 'single quote #6', ->
      convention = parser.quotes """  var foo = "bar";"""
      convention.quotes.single.should.equal 0

    it 'single quote #7', ->
      convention = parser.quotes """  var foo = "<div id='bar'>baz</div>";"""
      convention.quotes.single.should.equal 0

    it 'single quote #8', ->
      convention = parser.quotes """ 'key': "value" """
      convention.quotes.single.should.equal 0

    it 'double quotes #1', ->
      convention = parser.quotes """  var foo = "bar";"""
      convention.quotes.double.should.equal 1

    it 'double quotes #2', ->
      convention = parser.quotes """  var foo = "<div id='bar'>baz</div>";"""
      convention.quotes.double.should.equal 1

    it 'double quotes #3', ->
      convention = parser.quotes """  var foo = "<div id=\"bar\">baz</div>";"""
      convention.quotes.double.should.equal 1

    it 'double quotes #4', ->
      convention = parser.quotes """ "key": "value" """
      convention.quotes.double.should.equal 1

    it 'double quotes #5', ->
      convention = parser.quotes """ "key": true """
      convention.quotes.double.should.equal 1

    it 'double quotes #6', ->
      convention = parser.quotes """  var foo = 'bar';"""
      convention.quotes.double.should.equal 0

    it 'double quotes #7', ->
      convention = parser.quotes """  var foo = '<div id="bar">baz</div>';"""
      convention.quotes.double.should.equal 0

    it 'double quotes #8', ->
      convention = parser.quotes """ 'key': "value" """
      convention.quotes.double.should.equal 0