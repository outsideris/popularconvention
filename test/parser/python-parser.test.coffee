should = require 'should'
parser = require '../../src/parser/python-parser'

describe 'python-parser >', ->

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

  describe 'imports >', ->

    it 'imports on separate lines #1', ->
      convention = parser.imports 'import os', {}
      convention.imports.separated.should.equal 1

    it 'imports on separate lines #2', ->
      convention = parser.imports '  import foo.bar.yourclass', {}
      convention.imports.separated.should.equal 1

    it 'imports on separate lines #3', ->
      convention = parser.imports '  import os # ,', {}
      convention.imports.separated.should.equal 1

    it 'imports on separate lines #4', ->
      convention = parser.imports '  import os, sys', {}
      convention.imports.separated.should.equal 0

    it 'imports on non-separate lines #1', ->
      convention = parser.imports 'import os, sys', {}
      convention.imports.noseparated.should.equal 1

    it 'imports on non-separate lines #2', ->
      convention = parser.imports '  import os, sys', {}
      convention.imports.noseparated.should.equal 1

    it 'imports on non-separate lines #3', ->
      convention = parser.imports 'import os', {}
      convention.imports.noseparated.should.equal 0

  describe 'whitespace >', ->

    it 'no extraneous whitespace #1', ->
      convention = parser.whitespace 'spam(ham[1], {eggs: 2})', {}
      convention.whitespace.noextra.should.equal 1

    it 'no extraneous whitespace #2', ->
      convention = parser.whitespace 'if x == 4: print x, y; x, y = y, x', {}
      convention.whitespace.noextra.should.equal 1

    it 'no extraneous whitespace #3', ->
      convention = parser.whitespace 'spam(1)', {}
      convention.whitespace.noextra.should.equal 1

    it 'no extraneous whitespace #4', ->
      convention = parser.whitespace "dict['key'] = list[index]", {}
      convention.whitespace.noextra.should.equal 1

    it 'no extraneous whitespace #5', ->
      convention = parser.whitespace 'x = 1', {}
      convention.whitespace.noextra.should.equal 1

    it 'no extraneous whitespace #6', ->
      convention = parser.whitespace "dict ['key'] = list [index]", {}
      convention.whitespace.noextra.should.equal 0

    it 'extraneous whitespace #1', ->
      convention = parser.whitespace 'spam( ham[ 1 ], { eggs: 2 } )', {}
      convention.whitespace.extra.should.equal 1

    it 'extraneous whitespace #2', ->
      convention = parser.whitespace 'if x == 4 : print x , y ; x , y = y , x', {}
      convention.whitespace.extra.should.equal 1

    it 'extraneous whitespace #3', ->
      convention = parser.whitespace 'spam (1)', {}
      convention.whitespace.extra.should.equal 1

    it 'extraneous whitespace #4', ->
      convention = parser.whitespace "dict ['key'] = list [index]", {}
      convention.whitespace.extra.should.equal 1

    it 'extraneous whitespace #5', ->
      convention = parser.whitespace 'x             = 1', {}
      convention.whitespace.extra.should.equal 1

    it 'extraneous whitespace #6', ->
      convention = parser.whitespace 'if x == 4: print x, y; x, y = y, x', {}
      convention.whitespace.extra.should.equal 0
