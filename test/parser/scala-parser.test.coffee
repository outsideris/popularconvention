# Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
# Licensed under the MIT license.
# <http://outsider.mit-license.org/>

should = require 'should'
parser = require '../../src/parser/scala-parser'

describe 'scala-parser >', ->

  describe 'indent >', ->

    it 'check space indent #1', ->
      convention = parser.indent 'a = 1;', {}
      convention.indent.space.should.equal 0

    it 'check space indent #2', ->
      convention = parser.indent '  a = 1;', {}
      convention.indent.space.should.equal 1

    it 'check space indent #3', ->
      convention = parser.indent '  a = 1;', {}
      convention.indent.space.should.equal 1

    it 'check space indent #4', ->
      convention = parser.indent '   a = 1;', {}
      convention.indent.space.should.equal 1

    it 'check tab indent #1', ->
      convention = parser.indent '\ta = 1;', {}
      convention.indent.tab.should.equal 1

    it 'check tab indent #2', ->
      convention = parser.indent '\t\ta = 1;', {}
      convention.indent.tab.should.equal 1

    it 'check tab indent #3', ->
      convention = parser.indent '\t\t  a = 1;  ', {}
      convention.indent.tab.should.equal 1

    it 'check tab indent #4', ->
      convention = parser.indent '  \ta = 1;', {}
      convention.indent.tab.should.equal 0

    it 'check tab indent #5', ->
      convention = parser.indent 'a = 1;', {}
      convention.indent.tab.should.equal 0

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

  describe 'classname >', ->

    it 'camelcases with capitalzied #1', ->
      convention = parser.classname 'class MyFairLady', {}
      convention.classname.capital.should.equal 1

    it 'camelcases with capitalzied #2', ->
      convention = parser.classname 'class My1stFairLady', {}
      convention.classname.capital.should.equal 1

    it 'camelcases with capitalzied #3', ->
      convention = parser.classname 'trait MyFairLady', {}
      convention.classname.capital.should.equal 1

    it 'camelcases with capitalzied #4', ->
      convention = parser.classname 'class myFairLady', {}
      convention.classname.capital.should.equal 0

    it 'camelcases with non-capitalzied #1', ->
      convention = parser.classname 'class myFairLady', {}
      convention.classname.nocapital.should.equal 1

    it 'camelcases with non-capitalzied #2', ->
      convention = parser.classname 'class my1stFairLady', {}
      convention.classname.nocapital.should.equal 1

    it 'camelcases with non-capitalzied #3', ->
      convention = parser.classname 'trait myFairLady', {}
      convention.classname.nocapital.should.equal 1

    it 'camelcases with non-capitalzied #4', ->
      convention = parser.classname 'trait MyFairLady', {}
      convention.classname.nocapital.should.equal 0

  describe 'variablename >', ->

    it 'camelcases with capitalzied #1', ->
      convention = parser.variablename  'val myValue = ...', {}
      convention.variablename.camelcase.should.equal 1

    it 'camelcases with capitalzied #2', ->
      convention = parser.variablename  'def myMethod = ...', {}
      convention.variablename.camelcase.should.equal 1

    it 'camelcases with capitalzied #3', ->
      convention = parser.variablename  'var myVariable', {}
      convention.variablename.camelcase.should.equal 1

    it 'camelcases with capitalzied #4', ->
      convention = parser.variablename  'val MY_VALUE = ...', {}
      convention.variablename.camelcase.should.equal 0

    it 'camelcases with non-capitalzied #1', ->
      convention = parser.variablename  'val MyValue = ...', {}
      convention.variablename.noncamelcase.should.equal 1

    it 'camelcases with non-capitalzied #2', ->
      convention = parser.variablename  'def MyMethod = ...', {}
      convention.variablename.noncamelcase.should.equal 1

    it 'camelcases with non-capitalzied #3', ->
      convention = parser.variablename  'var MyVariable', {}
      convention.variablename.noncamelcase.should.equal 1

    it 'camelcases with non-capitalzied #4', ->
      convention = parser.variablename  'val MY_VALUE = ...', {}
      convention.variablename.noncamelcase.should.equal 0

  describe 'parametertype >', ->

    it 'parameter type with one space #1', ->
      convention = parser.parametertype  'def add(a: Int, b: Int) = a + b', {}
      convention.parametertype.tracespace.should.equal 1

    it 'parameter type with one space #2', ->
      convention = parser.parametertype  'def add(a:Int, b: Int) = a + b', {}
      convention.parametertype.tracespace.should.equal 1

    it 'parameter type with one space #3', ->
      convention = parser.parametertype  'def add(a:Int, b:Int): Unit = a + b', {}
      convention.parametertype.tracespace.should.equal 0

    it 'parameter type with both space #1', ->
      convention = parser.parametertype  'def add(a : Int, b : Int) = a + b', {}
      convention.parametertype.bothspace.should.equal 1

    it 'parameter type with both space #2', ->
      convention = parser.parametertype  'def add(a:Int, b : Int) = a + b', {}
      convention.parametertype.bothspace.should.equal 1

    it 'parameter type with both space #3', ->
      convention = parser.parametertype  'def add(a:Int, b: Int) : Unit = a + b', {}
      convention.parametertype.bothspace.should.equal 0

    it 'parameter type with no space #1', ->
      convention = parser.parametertype  'def add(a:Int, b:Int) = a + b', {}
      convention.parametertype.nospace.should.equal 1

    it 'parameter type with no space #2', ->
      convention = parser.parametertype  'def add(a: Int, b:Int) = a + b', {}
      convention.parametertype.nospace.should.equal 1

    it 'parameter type with no space #2', ->
      convention = parser.parametertype  'def add(a: Int, b: Int):Unit = a + b', {}
      convention.parametertype.nospace.should.equal 0
