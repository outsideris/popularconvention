should = require 'should'
parser = require '../../src/parser/java-parser'

describe 'java-parser >', ->

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

    it 'check constant with all caps #1', ->
      convention = parser.constant '	static public final String FOOBAR= "";', {}
      convention.constant.allcaps.should.equal 1

    it 'check constant with all caps #2', ->
      convention = parser.constant '	public static final String FOOBAR2= "";', {}
      convention.constant.allcaps.should.equal 1

    it 'check constant with all caps #3', ->
      convention = parser.constant 'private final static String FOO_BAR = "";', {}
      convention.constant.allcaps.should.equal 1

    it 'check constant with all caps #4', ->
      convention = parser.constant 'final public static String FOO_BAR = "";', {}
      convention.constant.allcaps.should.equal 1

    it 'check constant with all caps #5', ->
      convention = parser.constant '	public final String foobar = "";', {}
      convention.constant.allcaps.should.equal 0

    it 'check constant with all caps #6', ->
      convention = parser.constant 'public final String FOOBAR = "";', {}
      convention.constant.allcaps.should.equal 0

    it 'check constant with all caps #7', ->
      convention = parser.constant 'private final static String FOOBARa = "";', {}
      convention.constant.allcaps.should.equal 0

    it 'check constant with not all caps #1', ->
      convention = parser.constant '	static public final String foobar= "";', {}
      convention.constant.notallcaps.should.equal 1

    it 'check constant with not all caps #2', ->
      convention = parser.constant '	public static final String foobar2= "";', {}
      convention.constant.notallcaps.should.equal 1

    it 'check constant with not all caps #3', ->
      convention = parser.constant 'public final static String FOOBARa = "";', {}
      convention.constant.notallcaps.should.equal 1

    it 'check constant with not all caps #4', ->
      convention = parser.constant 'final public static String FOo_BAR = "";', {}
      convention.constant.notallcaps.should.equal 1

    it 'check constant with not all caps #5', ->
      convention = parser.constant '	public static final String FOO_BAR= "";', {}
      convention.constant.notallcaps.should.equal 0

    it 'check constant with not all caps #6', ->
      convention = parser.constant '	public final String Foo= "";', {}
      convention.constant.notallcaps.should.equal 0

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
      convention = parser.argumentdef 'public void setName11( String name ) {', {}
      convention.argumentdef.onespace.should.equal 1

    it 'check argument definition with one space #2', ->
      convention = parser.argumentdef '    public void setName( String name ) {', {}
      convention.argumentdef.onespace.should.equal 1

    it 'check argument definition with one space #3', ->
      convention = parser.argumentdef '\t\tpublic void setName( String name, Sting age) {', {}
      convention.argumentdef.onespace.should.equal 1

    it 'check argument definition with one space #4', ->
      convention = parser.argumentdef 'if ( isTrue() ) {}', {}
      convention.argumentdef.onespace.should.equal 1

    it 'check argument definition with one space #5', ->
      convention = parser.argumentdef 'while ( isTrue() ) {}', {}
      convention.argumentdef.onespace.should.equal 1

    it 'check argument definition with one space #6', ->
      convention = parser.argumentdef 'public void setName11(String name ) {', {}
      convention.argumentdef.onespace.should.equal 0

    it 'check argument definition with no space #1', ->
      convention = parser.argumentdef 'public void setName(String name) {', {}
      convention.argumentdef.nospace.should.equal 1

    it 'check argument definition with no space #2', ->
      convention = parser.argumentdef '\t\tpublic void setName(String name) {', {}
      convention.argumentdef.nospace.should.equal 1

    it 'check argument definition with no space #3', ->
      convention = parser.argumentdef 'public void setName(String name, Sting age) {', {}
      convention.argumentdef.nospace.should.equal 1

    it 'check argument definition with no space #4', ->
      convention = parser.argumentdef 'if (isTrue()) {}', {}
      convention.argumentdef.nospace.should.equal 1

    it 'check argument definition with no space #5', ->
      convention = parser.argumentdef 'while (isTrue()) {}', {}
      convention.argumentdef.nospace.should.equal 1

    it 'check argument definition with no space #6', ->
      convention = parser.argumentdef '/t/tpublic void setName( String name) {', {}
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

  describe 'staticvar >', ->

    it 'static variable with special prefix #1', ->
      convention = parser.staticvar '	static String _name;', {}
      convention.staticvar.prefix.should.equal 1

    it 'static variable with special prefix #2', ->
      convention = parser.staticvar  '	static String $name;', {}
      convention.staticvar.prefix.should.equal 1

    it 'static variable with special prefix #3', ->
      convention = parser.staticvar  '	static String name;', {}
      convention.staticvar.prefix.should.equal 0

    it 'static variable with no special prefix #1', ->
      convention = parser.staticvar  '	static String _name;', {}
      convention.staticvar.noprefix.should.equal 0

    it 'static variable with no special prefix #2', ->
      convention = parser.staticvar  '	static String $name;', {}
      convention.staticvar.noprefix.should.equal 0

    it 'static variable with no special prefix #3', ->
      convention = parser.staticvar  '	static String name;', {}
      convention.staticvar.noprefix.should.equal 1

  describe 'finalstaticorder >', ->

    it 'public - static - final #1', ->
      convention = parser.finalstaticorder 'public static final String t1 = "";', {}
      convention.finalstaticorder.accstfin.should.equal 1

    it 'public - static - final #2', ->
      convention = parser.finalstaticorder 'public static transient final String t2 = "";', {}
      convention.finalstaticorder.accstfin.should.equal 1

    it 'public - static - final #3', ->
      convention = parser.finalstaticorder 'transient public static final String t3 = "";', {}
      convention.finalstaticorder.accstfin.should.equal 1

    it 'public - static - final #4', ->
      convention = parser.finalstaticorder 'public final static String t4 = "";', {}
      convention.finalstaticorder.accstfin.should.equal 0

    it 'public - final - static #1', ->
      convention = parser.finalstaticorder 'public final static String t1 = "";', {}
      convention.finalstaticorder.accfinst.should.equal 1

    it 'public - final - static #2', ->
      convention = parser.finalstaticorder 'public final static transient String t2 = "";', {}
      convention.finalstaticorder.accfinst.should.equal 1

    it 'public - final - static #3', ->
      convention = parser.finalstaticorder 'transient public final static String t3 = "";', {}
      convention.finalstaticorder.accfinst.should.equal 1

    it 'public - final - static #4', ->
      convention = parser.finalstaticorder 'final public static String t4 = "";', {}
      convention.finalstaticorder.accfinst.should.equal 0

    it 'final - public - static #1', ->
      convention = parser.finalstaticorder 'final public static String t1 = "";', {}
      convention.finalstaticorder.finaccst.should.equal 1

    it 'final - public - static #2', ->
      convention = parser.finalstaticorder 'final public static transient String t2 = "";', {}
      convention.finalstaticorder.finaccst.should.equal 1

    it 'final - public - static #3', ->
      convention = parser.finalstaticorder 'final transient public static String t3 = "";', {}
      convention.finalstaticorder.finaccst.should.equal 1

    it 'final - public - static #4', ->
      convention = parser.finalstaticorder 'static public final String t4 = "";', {}
      convention.finalstaticorder.finaccst.should.equal 0

    it 'final - public - static #1', ->
      convention = parser.finalstaticorder 'static public final String t1 = "";', {}
      convention.finalstaticorder.staccfin.should.equal 1

    it 'final - public - static #2', ->
      convention = parser.finalstaticorder 'static public transient final String t2 = "";', {}
      convention.finalstaticorder.staccfin.should.equal 1

    it 'final - public - static #3', ->
      convention = parser.finalstaticorder 'static transient public final String t3 = "";', {}
      convention.finalstaticorder.staccfin.should.equal 1

    it 'final - public - static #4', ->
      convention = parser.finalstaticorder 'public static final String t4 = "";', {}
      convention.finalstaticorder.staccfin.should.equal 0
