# Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
# Licensed under the MIT license.
# <http://outsider.mit-license.org/>

should = require 'should'
parser = require '../../src/parser/csharp-parser'

describe 'C#-parser >', ->

  describe 'indent >', ->

    it 'check space indent #1', ->
      convention = parser.indent 'public String getName{}', {}
      convention.indent.space.should.equal 0

    it 'check space indent #2', ->
      convention = parser.indent '  public String getName{}', {}
      convention.indent.space.should.equal 1

    it 'check space indent #3', ->
      convention = parser.indent '    public String getName{}', {}
      convention.indent.space.should.equal 1

    it 'check tab indent #1', ->
      convention = parser.indent '\tpublic String getName{}', {}
      convention.indent.tab.should.equal 1

    it 'check tab indent #2', ->
      convention = parser.indent '\t\tpublic String getName{}', {}
      convention.indent.tab.should.equal 1

    it 'check tab indent #3', ->
      convention = parser.indent '\t\t  public String getName{}  ', {}
      convention.indent.tab.should.equal 1

    it 'check tab indent #4', ->
      convention = parser.indent '  \tpublic String getName{}', {}
      convention.indent.tab.should.equal 0

    it 'check tab indent #5', ->
      convention = parser.indent 'public String getName{}', {}
      convention.indent.tab.should.equal 0

  describe 'blockstatement >', ->

    it 'check block statement with one space #1', ->
      convention = parser.blockstatement 'if (height < MIN_HIGHT) { return; }', {}
      convention.blockstatement.onespace.should.equal 1

    it 'check block statement with one space #2', ->
      convention = parser.blockstatement '} else if (height < MIN_HIGHT) {', {}
      convention.blockstatement.onespace.should.equal 1

    it 'check block statement with one space #3', ->
      convention = parser.blockstatement '} else if ( height < MIN_HIGHT ) {', {}
      convention.blockstatement.onespace.should.equal 1

    it 'check block statement with one space #4', ->
      convention = parser.blockstatement 'else if (height < MIN_HIGHT) {', {}
      convention.blockstatement.onespace.should.equal 1

    it 'check block statement with one space #5', ->
      convention = parser.blockstatement 'if (height < MIN_HIGHT){ return; }', {}
      convention.blockstatement.onespace.should.equal 0

    it 'check block statement with one space #6', ->
      convention = parser.blockstatement 'if (isTrue()) { return; }', {}
      convention.blockstatement.onespace.should.equal 1

    it 'check block statement with no space #1', ->
      convention = parser.blockstatement 'if (height < MIN_HIGHT){ return (); }', {}
      convention.blockstatement.nospace.should.equal 1

    it 'check block statement with no space #2', ->
      convention = parser.blockstatement '}else if (height < MIN_HIGHT){', {}
      convention.blockstatement.nospace.should.equal 1

    it 'check block statement with no space #3', ->
      convention = parser.blockstatement 'if (height < MIN_HIGHT)', {}
      convention.blockstatement.nospace.should.equal 0

    it 'check block statement with no space #4', ->
      convention = parser.blockstatement '} else if(height < MIN_HIGHT) {', {}
      convention.blockstatement.nospace.should.equal 0

    it 'check block statement with no space #5', ->
      convention = parser.blockstatement '} else if(isTrue()){', {}
      convention.blockstatement.nospace.should.equal 1

    it 'check block statement at new line #1', ->
      convention = parser.blockstatement 'if (height < MIN_HIGHT)', {}
      convention.blockstatement.newline.should.equal 1

    it 'check block statement at new line #2', ->
      convention = parser.blockstatement 'if (height < MIN_HIGHT) // comment', {}
      convention.blockstatement.newline.should.equal 1

    it 'check block statement at new line #3', ->
      convention = parser.blockstatement 'if (height < MIN_HIGHT)/* */', {}
      convention.blockstatement.newline.should.equal 1

    it 'check block statement at new line #4', ->
      convention = parser.blockstatement 'else if (height < MIN_HIGHT)', {}
      convention.blockstatement.newline.should.equal 1

    it 'check block statement at new line #5', ->
      convention = parser.blockstatement 'else if (height < MIN_HIGHT) {', {}
      convention.blockstatement.newline.should.equal 1

    it 'check block statement at new line #6', ->
      convention = parser.blockstatement '}  else if ( height < MIN_HIGHT ) {', {}
      convention.blockstatement.newline.should.equal 0

    it 'check block statement at new line #7', ->
      convention = parser.blockstatement 'if ( isTrue() ) //{}', {}
      convention.blockstatement.newline.should.equal 1

  describe 'constant >', ->

    it 'check constant is pascal #1', ->
      convention = parser.constant 'const string FooBar = "baz";', {}
      convention.constant.pascal.should.equal 1

    it 'check constant is pascal #2', ->
      convention = parser.constant 'const int Foo = "baz";', {}
      convention.constant.pascal.should.equal 1

    it 'check constant is pascal #3', ->
      convention = parser.constant 'public const int Foo = "baz";', {}
      convention.constant.pascal.should.equal 1

    it 'check constant is pascal #4', ->
      convention = parser.constant 'const string FOO_BAR = "baz";', {}
      convention.constant.pascal.should.equal 0

    it 'check constant with all caps #1', ->
      convention = parser.constant 'const string FOO_BAR = "baz";', {}
      convention.constant.allcaps.should.equal 1

    it 'check constant with all caps #2', ->
      convention = parser.constant 'public const iint FOO_BAR = 1;', {}
      convention.constant.allcaps.should.equal 1

    it 'check constant with all caps #3', ->
      convention = parser.constant 'const iint X = 1;', {}
      convention.constant.allcaps.should.equal 1

    it 'check constant with all caps #4', ->
      convention = parser.constant 'const string fooBar = "baz";', {}
      convention.constant.allcaps.should.equal 0

    it 'check constant with not all caps #1', ->
      convention = parser.constant ' const string foo_bar = "baz";', {}
      convention.constant.notallcaps.should.equal 1

    it 'check constant with not all caps #2', ->
      convention = parser.constant ' const string fooBar = "baz";', {}
      convention.constant.notallcaps.should.equal 1

    it 'check constant with not all caps #3', ->
      convention = parser.constant 'public const int fooBar = 1;', {}
      convention.constant.notallcaps.should.equal 1

    it 'check constant with not all caps #4', ->
      convention = parser.constant 'const int x=1;', {}
      convention.constant.notallcaps.should.equal 1

  describe 'conditionstatement >', ->

    it 'check condition statement with one space #1', ->
      convention = parser.conditionstatement 'if ( a.equal("")) {', {}
      convention.conditionstatement.onespace.should.equal 1

    it 'check condition statement with one space #2', ->
      convention = parser.conditionstatement 'while ( isTrue() ) {', {}
      convention.conditionstatement.onespace.should.equal 1

    it 'check condition statement with one space #3', ->
      convention = parser.conditionstatement 'switch (name) {', {}
      convention.conditionstatement.onespace.should.equal 1

    it 'check condition statement with one space #4', ->
      convention = parser.conditionstatement 'if( isTrue()) {', {}
      convention.conditionstatement.onespace.should.equal 0

    it 'check condition statement with no space #1', ->
      convention = parser.conditionstatement 'if( isTrue()) {', {}
      convention.conditionstatement.nospace.should.equal 1

    it 'check condition statement with no space #2', ->
      convention = parser.conditionstatement 'while( isTrue() ) {', {}
      convention.conditionstatement.nospace.should.equal 1

    it 'check condition statement with no space #3', ->
      convention = parser.conditionstatement 'switch(name) {', {}
      convention.conditionstatement.nospace.should.equal 1

    it 'check condition statement with no space #4', ->
      convention = parser.conditionstatement 'if ( a.equal("")) {', {}
      convention.conditionstatement.nospace.should.equal 0

  describe 'argumentdef >', ->

    it 'check argument definition with one space #1', ->
      convention = parser.argumentdef 'public void SetName11( String name ) {', {}
      convention.argumentdef.onespace.should.equal 1

    it 'check argument definition with one space #2', ->
      convention = parser.argumentdef '    public void SetName( String name ) {', {}
      convention.argumentdef.onespace.should.equal 1

    it 'check argument definition with one space #3', ->
      convention = parser.argumentdef '\t\tpublic void SetName( String name, Sting age) {', {}
      convention.argumentdef.onespace.should.equal 1

    it 'check argument definition with one space #4', ->
      convention = parser.argumentdef 'if ( isTrue() ) {}', {}
      convention.argumentdef.onespace.should.equal 1

    it 'check argument definition with one space #5', ->
      convention = parser.argumentdef 'while ( isTrue() ) {}', {}
      convention.argumentdef.onespace.should.equal 1

    it 'check argument definition with one space #6', ->
      convention = parser.argumentdef 'public void SetName11(String name ) {', {}
      convention.argumentdef.onespace.should.equal 0

    it 'check argument definition with no space #1', ->
      convention = parser.argumentdef 'public void SetName(String name) {', {}
      convention.argumentdef.nospace.should.equal 1

    it 'check argument definition with no space #2', ->
      convention = parser.argumentdef '\t\tpublic void SetName(String name) {', {}
      convention.argumentdef.nospace.should.equal 1

    it 'check argument definition with no space #3', ->
      convention = parser.argumentdef 'public void SetName(String name, Sting age) {', {}
      convention.argumentdef.nospace.should.equal 1

    it 'check argument definition with no space #4', ->
      convention = parser.argumentdef 'if (isTrue()) {}', {}
      convention.argumentdef.nospace.should.equal 1

    it 'check argument definition with no space #5', ->
      convention = parser.argumentdef 'while (isTrue()) {}', {}
      convention.argumentdef.nospace.should.equal 1

    it 'check argument definition with no space #6', ->
      convention = parser.argumentdef '/t/tpublic void SetName( String name) {', {}
      convention.argumentdef.nospace.should.equal 0

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

