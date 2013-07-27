# Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
# Licensed under the MIT license.
# <http://outsider.mit-license.org/>

should = require 'should'
parser = require '../../src/parser/ruby-parser'

describe 'ruby-parser >', ->

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

  describe 'whitespace >', ->

    it 'one whitespace #1', ->
      convention = parser.whitespace 'sum = 1 + 2', {}
      convention.whitespace.spaces.should.equal 1

    it 'one whitespace #2', ->
      convention = parser.whitespace 'a, b = 1, 2', {}
      convention.whitespace.spaces.should.equal 1

    it 'one whitespace #3', ->
      convention = parser.whitespace "1 > 2 ? true : false; puts 'Hi'", {}
      convention.whitespace.spaces.should.equal 1

    it 'one whitespace #4', ->
      convention = parser.whitespace "[1, 2, 3].each { |e| puts e }", {}
      convention.whitespace.spaces.should.equal 1

    it 'one whitespace #5', ->
      convention = parser.whitespace '[1, 2, 3].each {|e| puts e }', {}
      convention.whitespace.spaces.should.equal 0

    it 'one whitespace #6', ->
      convention = parser.whitespace 'sum = 1+2', {}
      convention.whitespace.spaces.should.equal 0

    it 'one whitespace #7', ->
      convention = parser.whitespace 'sum = "1+2"', {}
      convention.whitespace.spaces.should.equal 1

    it 'one whitespace #8', ->
      convention = parser.whitespace 'a, b = 1,2', {}
      convention.whitespace.spaces.should.equal 0

    it 'one whitespace #9', ->
      convention = parser.whitespace 'a, b = 1, 2;', {}
      convention.whitespace.spaces.should.equal 1

    it 'no whitespace #1', ->
      convention = parser.whitespace 'sum = 1 +2', {}
      convention.whitespace.nospace.should.equal 1

    it 'no whitespace #2', ->
      convention = parser.whitespace 'a,b = 1, 2', {}
      convention.whitespace.nospace.should.equal 1

    it 'no whitespace #3', ->
      convention = parser.whitespace "1>2 ? true : false;puts 'Hi'", {}
      convention.whitespace.nospace.should.equal 1

    it 'no whitespace #4', ->
      convention = parser.whitespace "[1, 2, 3].each {|e| puts e}", {}
      convention.whitespace.nospace.should.equal 1

    it 'no whitespace #5', ->
      convention = parser.whitespace 'sum = 1 + 2', {}
      convention.whitespace.nospace.should.equal 0

    it 'no whitespace #6', ->
      convention = parser.whitespace 'a, b = 1, 2;c', {}
      convention.whitespace.nospace.should.equal 1

  describe 'asignDefaultValue >', ->

    it 'use spaces #1', ->
      convention = parser.asignDefaultValue 'def some_method(arg1 = :default)', {}
      convention.asignDefaultValue.space.should.equal 1

    it 'use spaces #2', ->
      convention = parser.asignDefaultValue '   def some_method(arg2 = nil)', {}
      convention.asignDefaultValue.space.should.equal 1

    it 'use spaces #3', ->
      convention = parser.asignDefaultValue 'def some_method( arg3 = [] )', {}
      convention.asignDefaultValue.space.should.equal 1

    it 'use spaces #4', ->
      convention = parser.asignDefaultValue 'def some_method(arg1 = :default, arg2 = nil, arg3 = [])', {}
      convention.asignDefaultValue.space.should.equal 1

    it 'use spaces #5', ->
      convention = parser.asignDefaultValue 'def some_method(arg3)', {}
      convention.asignDefaultValue.space.should.equal 0

    it 'use spaces #6', ->
      convention = parser.asignDefaultValue 'def some_method(arg1=:default)', {}
      convention.asignDefaultValue.space.should.equal 0

    it 'no spaces #1', ->
      convention = parser.asignDefaultValue 'def some_method(arg1=:default)', {}
      convention.asignDefaultValue.nospace.should.equal 1

    it 'no spaces #2', ->
      convention = parser.asignDefaultValue '  def some_method(arg2=nil)', {}
      convention.asignDefaultValue.nospace.should.equal 1

    it 'no spaces #3', ->
      convention = parser.asignDefaultValue 'def some_method( arg3=[] )', {}
      convention.asignDefaultValue.nospace.should.equal 1

    it 'no spaces #4', ->
      convention = parser.asignDefaultValue 'def some_method(arg1=:default, arg2=nil, arg3=[])', {}
      convention.asignDefaultValue.nospace.should.equal 1

    it 'no spaces #5', ->
      convention = parser.asignDefaultValue 'def some_method( arg3 = [] )', {}
      convention.asignDefaultValue.nospace.should.equal 0

    it 'no spaces #6', ->
      convention = parser.asignDefaultValue 'def some_method(arg3)', {}
      convention.asignDefaultValue.nospace.should.equal 0

  describe 'numericLiteral >', ->

    it 'use underscore #1', ->
      convention = parser.numericLiteral 'num = 1_000_000', {}
      convention.numericLiteral.underscore.should.equal 1

    it 'use underscore #2', ->
      convention = parser.numericLiteral 'num = 7_473', {}
      convention.numericLiteral.underscore.should.equal 1

    it 'use underscore #3', ->
      convention = parser.numericLiteral 'num = 34_000_000', {}
      convention.numericLiteral.underscore.should.equal 1

    it 'use underscore #4', ->
      convention = parser.numericLiteral 'str = "404_094"', {}
      convention.numericLiteral.underscore.should.equal 0

    it 'use underscore #5', ->
      convention = parser.numericLiteral 'num = 438958', {}
      convention.numericLiteral.underscore.should.equal 0

    it 'use underscore #6', ->
      convention = parser.numericLiteral 'num = 958', {}
      convention.numericLiteral.underscore.should.equal 0

    it 'use no underscore #1', ->
      convention = parser.numericLiteral 'num = 1000000', {}
      convention.numericLiteral.nounderscore.should.equal 1

    it 'use no underscore #2', ->
      convention = parser.numericLiteral 'num = 438958', {}
      convention.numericLiteral.nounderscore.should.equal 1

    it 'use no underscore #3', ->
      convention = parser.numericLiteral 'num = 584058', {}
      convention.numericLiteral.nounderscore.should.equal 1

    it 'use no underscore #4', ->
      convention = parser.numericLiteral 'num = 504', {}
      convention.numericLiteral.nounderscore.should.equal 0

    it 'use no underscore #5', ->
      convention = parser.numericLiteral 'str = "404094"', {}
      convention.numericLiteral.nounderscore.should.equal 0

    it 'use no underscore #6', ->
      convention = parser.numericLiteral 'num = 584_058', {}
      convention.numericLiteral.nounderscore.should.equal 0

  describe 'defNoArgs >', ->

    it 'omit parenthenes #1', ->
      convention = parser.defNoArgs ' def some_method', {}
      convention.defNoArgs.omit.should.equal 1

    it 'omit parenthenes #2', ->
      convention = parser.defNoArgs ' def some_method # comment', {}
      convention.defNoArgs.omit.should.equal 1

    it 'omit parenthenes #3', ->
      convention = parser.defNoArgs ' def some_method # comment()', {}
      convention.defNoArgs.omit.should.equal 1

    it 'omit parenthenes #4', ->
      convention = parser.defNoArgs ' def some_method()', {}
      convention.defNoArgs.omit.should.equal 0

    it 'omit parenthenes #5', ->
      convention = parser.defNoArgs ' def some_method arg1, arg2', {}
      convention.defNoArgs.omit.should.equal 0

    it 'omit parenthenes #6', ->
      convention = parser.defNoArgs ' def some_method arg1', {}
      convention.defNoArgs.omit.should.equal 0

    it 'use parenthenes #1', ->
      convention = parser.defNoArgs ' def some_method()', {}
      convention.defNoArgs.use.should.equal 1

    it 'use parenthenes #2', ->
      convention = parser.defNoArgs ' def some_method ()', {}
      convention.defNoArgs.use.should.equal 1

    it 'use parenthenes #3', ->
      convention = parser.defNoArgs '    def some_method ( )', {}
      convention.defNoArgs.use.should.equal 1

    it 'use parenthenes #4', ->
      convention = parser.defNoArgs ' def some_method # comment()', {}
      convention.defNoArgs.use.should.equal 0

    it 'use parenthenes #5', ->
      convention = parser.defNoArgs ' def some_method(arg)', {}
      convention.defNoArgs.use.should.equal 0

  describe 'defArgs >', ->

    it 'omit parenthenes #1', ->
      convention = parser.defArgs ' def some_method arg1, arg2', {}
      convention.defArgs.omit.should.equal 1

    it 'omit parenthenes #1', ->
      convention = parser.defArgs ' def some_method arg1', {}
      convention.defArgs.omit.should.equal 1

    it 'omit parenthenes #3', ->
      convention = parser.defArgs ' def some_method  arg1, arg2 # fjeofjeo( arg1, arg2)', {}
      convention.defArgs.omit.should.equal 1

    it 'omit parenthenes #4', ->
      convention = parser.defArgs 'def some_method()', {}
      convention.defArgs.omit.should.equal 0

    it 'omit parenthenes #5', ->
      convention = parser.defArgs 'def some_method(arg1, arg2)', {}
      convention.defArgs.omit.should.equal 0

    it 'use parenthenes #1', ->
      convention = parser.defArgs ' def some_method( arg1, arg2)', {}
      convention.defArgs.use.should.equal 1

    it 'use parenthenes #2', ->
      convention = parser.defArgs ' def some_method ( arg1 )', {}
      convention.defArgs.use.should.equal 1

    it 'use parenthenes #3', ->
      convention = parser.defArgs '    def some_method (  arg1, arg2 )', {}
      convention.defArgs.use.should.equal 1

    it 'use parenthenes #4', ->
      convention = parser.defArgs 'def some_method arg1, arg2', {}
      convention.defArgs.use.should.equal 0

    it 'use parenthenes #5', ->
      convention = parser.defArgs 'def some_method()', {}
      convention.defArgs.use.should.equal 0

    it 'use parenthenes #6', ->
      convention = parser.defArgs 'def update_requirements(features, group_overrides, init_git_url=nil, user_env_vars=nil)', {}
      convention.defArgs.use.should.equal 1
