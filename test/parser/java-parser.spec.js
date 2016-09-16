const expect = require('chai').expect;
const parser = require('../../src/parser/java-parser');

describe('Java-parser >', () => {
  describe('indent >', () => {
    it('check space indent #1', () => {
      let convention = parser.indent(`public String getName{}`);
      expect(convention.space).equal(0);
    });

    it('check space indent #2', () => {
      let convention = parser.indent(`  public String getName{}`);
      expect(convention.space).equal(1);
    });

    it('check space indent #3', () => {
      let convention = parser.indent(`    public String getName{}`);
      expect(convention.space).equal(1);
    });

    it('check tab indent #1', () => {
      let convention = parser.indent(`\tpublic String getName{}`);
      expect(convention.tab).equal(1);
    });

    it('check tab indent #2', () => {
      let convention = parser.indent(`\t\tpublic String getName{}`);
      expect(convention.tab).equal(1);
    });

    it('check tab indent #3', () => {
      let convention = parser.indent(`\t\t  public String getName{}  `);
      expect(convention.tab).equal(1);
    });

    it('check tab indent #4', () => {
      let convention = parser.indent(`  \tpublic String getName{}`);
      expect(convention.tab).equal(0);
    });

    it('check tab indent #5', () => {
      let convention = parser.indent(`public String getName{}`);
      expect(convention.tab).equal(0);
    });
  });

  describe('blockstatement >', () => {
    it('check block statement with one space #1', () => {
      let convention = parser.blockstatement(`if (height < MIN_HIGHT) { return; }`);
      expect(convention.onespace).equal(1);
    });

    it('check block statement with one space #2', () => {
      let convention = parser.blockstatement(`} else if (height < MIN_HIGHT) {`);
      expect(convention.onespace).equal(1);
    });

    it('check block statement with one space #3', () => {
      let convention = parser.blockstatement(`} else if ( height < MIN_HIGHT ) {`);
      expect(convention.onespace).equal(1);
    });

    it('check block statement with one space #4', () => {
      let convention = parser.blockstatement(`else if (height < MIN_HIGHT) {`);
      expect(convention.onespace).equal(1);
    });

    it('check block statement with one space #5', () => {
      let convention = parser.blockstatement(`if (height < MIN_HIGHT){ return; }`);
      expect(convention.onespace).equal(0);
    });

    it('check block statement with one space #6', () => {
      let convention = parser.blockstatement(`if (isTrue()) { return; }`);
      expect(convention.onespace).equal(1);
    });

    it('check block statement with no space #1', () => {
      let convention = parser.blockstatement(`if (height < MIN_HIGHT){ return (); }`);
      expect(convention.nospace).equal(1);
    });

    it('check block statement with no space #2', () => {
      let convention = parser.blockstatement(`}else if (height < MIN_HIGHT){`);
      expect(convention.nospace).equal(1);
    });

    it('check block statement with no space #3', () => {
      let convention = parser.blockstatement(`if (height < MIN_HIGHT)`);
      expect(convention.nospace).equal(0);
    });

    it('check block statement with no space #4', () => {
      let convention = parser.blockstatement(`} else if(height < MIN_HIGHT) {`);
      expect(convention.nospace).equal(0);
    });

    it('check block statement with no space #5', () => {
      let convention = parser.blockstatement(`} else if(isTrue()){`);
      expect(convention.nospace).equal(1);
    });

    it('check block statement at new line #1', () => {
      let convention = parser.blockstatement(`if (height < MIN_HIGHT)`);
      expect(convention.newline).equal(1);
    });

    it('check block statement at new line #2', () => {
      let convention = parser.blockstatement(`if (height < MIN_HIGHT) // comment`);
      expect(convention.newline).equal(1);
    });

    it('check block statement at new line #3', () => {
      let convention = parser.blockstatement(`if (height < MIN_HIGHT)/* */`);
      expect(convention.newline).equal(1);
    });

    it('check block statement at new line #4', () => {
      let convention = parser.blockstatement(`else if (height < MIN_HIGHT)`);
      expect(convention.newline).equal(1);
    });

    it('check block statement at new line #5', () => {
      let convention = parser.blockstatement(`else if (height < MIN_HIGHT) {`);
      expect(convention.newline).equal(1);
    });

    it('check block statement at new line #6', () => {
      let convention = parser.blockstatement(`}  else if ( height < MIN_HIGHT ) {`);
      expect(convention.newline).equal(0);
    });

    it('check block statement at new line #7', () => {
      let convention = parser.blockstatement(`if ( isTrue() ) //{}`);
      expect(convention.newline).equal(1);
    });
  });

  describe('constant >', () => {
    it('check constant with all caps #1', () => {
      let convention = parser.constant(`  static public final String FOOBAR= "";`);
      expect(convention.allcaps).equal(1);
    });

    it('check constant with all caps #2', () => {
      let convention = parser.constant(`  public static final String FOOBAR2= "";`);
      expect(convention.allcaps).equal(1);
    });

    it('check constant with all caps #3', () => {
      let convention = parser.constant(`private final static String FOO_BAR = "";`);
      expect(convention.allcaps).equal(1);
    });

    it('check constant with all caps #4', () => {
      let convention = parser.constant(`final public static String FOO_BAR = "";`);
      expect(convention.allcaps).equal(1);
    });

    it('check constant with all caps #5', () => {
      let convention = parser.constant(`  public final String foobar = "";`);
      expect(convention.allcaps).equal(0);
    });

    it('check constant with all caps #6', () => {
      let convention = parser.constant(`public final String FOOBAR = "";`);
      expect(convention.allcaps).equal(0);
    });

    it('check constant with all caps #7', () => {
      let convention = parser.constant(`private final static String FOOBARa = "";`);
      expect(convention.allcaps).equal(0);
    });

    it('check constant with not all caps #1', () => {
      let convention = parser.constant(`  static public final String foobar= "";`);
      expect(convention.notallcaps).equal(1);
    });

    it('check constant with not all caps #2', () => {
      let convention = parser.constant(`  public static final String foobar2= "";`);
      expect(convention.notallcaps).equal(1);
    });

    it('check constant with not all caps #3', () => {
      let convention = parser.constant(`public final static String FOOBARa = "";`);
      expect(convention.notallcaps).equal(1);
    });

    it('check constant with not all caps #4', () => {
      let convention = parser.constant(`final public static String FOo_BAR = "";`);
      expect(convention.notallcaps).equal(1);
    });

    it('check constant with not all caps #5', () => {
      let convention = parser.constant(`  public static final String FOO_BAR= "";`);
      expect(convention.notallcaps).equal(0);
    });

    it('check constant with not all caps #6', () => {
      let convention = parser.constant(`  public final String Foo= "";`);
      expect(convention.notallcaps).equal(0);
    });
  });

  describe('conditionstatement >', () => {
    it('check condition statement with one space #1', () => {
      let convention = parser.conditionstatement(`if ( a.equal("")) {`);
      expect(convention.onespace).equal(1);
    });

    it('check condition statement with one space #2', () => {
      let convention = parser.conditionstatement(`while ( isTrue() ) {`);
      expect(convention.onespace).equal(1);
    });

    it('check condition statement with one space #3', () => {
      let convention = parser.conditionstatement(`switch (name) {`);
      expect(convention.onespace).equal(1);
    });

    it('check condition statement with one space #4', () => {
      let convention = parser.conditionstatement(`if( isTrue()) {`);
      expect(convention.onespace).equal(0);
    });

    it('check condition statement with no space #1', () => {
      let convention = parser.conditionstatement(`if( isTrue()) {`);
      expect(convention.nospace).equal(1);
    });

    it('check condition statement with no space #2', () => {
      let convention = parser.conditionstatement(`while( isTrue() ) {`);
      expect(convention.nospace).equal(1);
    });

    it('check condition statement with no space #3', () => {
      let convention = parser.conditionstatement(`switch(name) {`);
      expect(convention.nospace).equal(1);
    });

    it('check condition statement with no space #4', () => {
      let convention = parser.conditionstatement(`if ( a.equal("")) {`);
      expect(convention.nospace).equal(0);
    });
  });

  describe('argumentdef >', () => {
    it('check argument definition with one space #1', () => {
      let convention = parser.argumentdef(`public void setName11( String name ) {`);
      expect(convention.onespace).equal(1);
    });

    it('check argument definition with one space #2', () => {
      let convention = parser.argumentdef(`    public void setName( String name ) {`);
      expect(convention.onespace).equal(1);
    });

    it('check argument definition with one space #3', () => {
      let convention = parser.argumentdef(`\t\tpublic void setName( String name, Sting age) {`);
      expect(convention.onespace).equal(1);
    });

    it('check argument definition with one space #4', () => {
      let convention = parser.argumentdef(`if ( isTrue() ) {}`);
      expect(convention.onespace).equal(1);
    });

    it('check argument definition with one space #5', () => {
      let convention = parser.argumentdef(`while ( isTrue() ) {}`);
      expect(convention.onespace).equal(1);
    });

    it('check argument definition with one space #6', () => {
      let convention = parser.argumentdef(`public void setName11(String name ) {`);
      expect(convention.onespace).equal(0);
    });

    it('check argument definition with no space #1', () => {
      let convention = parser.argumentdef(`public void setName(String name) {`);
      expect(convention.nospace).equal(1);
    });

    it('check argument definition with no space #2', () => {
      let convention = parser.argumentdef(`\t\tpublic void setName(String name) {`);
      expect(convention.nospace).equal(1);
    });

    it('check argument definition with no space #3', () => {
      let convention = parser.argumentdef(`public void setName(String name, Sting age) {`);
      expect(convention.nospace).equal(1);
    });

    it('check argument definition with no space #4', () => {
      let convention = parser.argumentdef(`if (isTrue()) {}`);
      expect(convention.nospace).equal(1);
    });

    it('check argument definition with no space #5', () => {
      let convention = parser.argumentdef(`while (isTrue()) {}`);
      expect(convention.nospace).equal(1);
    });

    it('check argument definition with no space #6', () => {
      let convention = parser.argumentdef(`/t/tpublic void setName( String name) {`);
      expect(convention.nospace).equal(0);
    });
  });

  describe('linelength >', () => {
    it('line length is 80 characters #1', () => {
      let convention = parser.linelength(`    public String findFirstName( String name, String age) { return \"a\"; }`);
      expect(convention.char80).equal(1);
    });

    it('line length is 80 characters #2', () => {
      let convention = parser.linelength(`\t\tpublic String findFirstName( String name, String age) { return \"a\"; }`);
      expect(convention.char80).equal(1);
    });

    it('line length is 80 characters #3', () => {
      let convention = parser.linelength(`\t\t\tpublic String findFirstName( String name, String age) { return \"a\"; }`);
      expect(convention.char80).equal(0);
    });

    it('line length is 120 characters #1', () => {
      let convention = parser.linelength(`    public String findFirstName( String name, String age, String job) { return \"a\"; }`);
      expect(convention.char120).equal(1);
    });

    it('line length is 120 characters #2', () => {
      let convention = parser.linelength(`\t\tpublic String findFirstName( String name, String age, String job) { return \"a\"; }`);
      expect(convention.char120).equal(1);
    });

    it('line length is 120 characters #3', () => {
      let convention = parser.linelength(`\t\tpublic String findFirstName( String name, String age) { return \"a\"; }`);
      expect(convention.char120).equal(0);
    });

    it('line length is 150 characters #1', () => {
      let convention = parser.linelength(`    public String findFirstName( String name, String age, String job) { return \"a\"; } //afijfjeovjfiejffjeifjidjvosjfiejfioejovfjeifjiejfosjfioejfoiejfoi`);
      expect(convention.char150).equal(1);
    });
  });

  describe('staticvar >', () => {
    it('static variable with special prefix #1', () => {
      let convention = parser.staticvar(` static String _name;`);
      expect(convention.prefix).equal(1);
    });

    it('static variable with special prefix #2', () => {
      let convention = parser.staticvar(` static String $name;`);
      expect(convention.prefix).equal(1);
    });

    it('static variable with special prefix #3', () => {
      let convention = parser.staticvar(` static String name;`);
      expect(convention.prefix).equal(0);
    });

    it('static variable with no special prefix #1', () => {
      let convention = parser.staticvar(` static String _name;`);
      expect(convention.noprefix).equal(0);
    });

    it('static variable with no special prefix #2', () => {
      let convention = parser.staticvar(` static String $name;`);
      expect(convention.noprefix).equal(0);
    });

    it('static variable with no special prefix #3', () => {
      let convention = parser.staticvar(` static String name;`);
      expect(convention.noprefix).equal(1);
    });
  });

  describe('finalstaticorder >', () => {
    it('public - static - final #1', () => {
      let convention = parser.finalstaticorder(`public static final String t1 = "";`);
      expect(convention.accstfin).equal(1);
    });

    it('public - static - final #2', () => {
      let convention = parser.finalstaticorder(`public static transient final String t2 = "";`);
      expect(convention.accstfin).equal(1);
    });

    it('public - static - final #3', () => {
      let convention = parser.finalstaticorder(`transient public static final String t3 = "";`);
      expect(convention.accstfin).equal(1);
    });

    it('public - static - final #4', () => {
      let convention = parser.finalstaticorder(`public final static String t4 = "";`);
      expect(convention.accstfin).equal(0);
    });

    it('public - final - static #1', () => {
      let convention = parser.finalstaticorder(`public final static String t1 = "";`);
      expect(convention.accfinst).equal(1);
    });

    it('public - final - static #2', () => {
      let convention = parser.finalstaticorder(`public final static transient String t2 = "";`);
      expect(convention.accfinst).equal(1);
    });

    it('public - final - static #3', () => {
      let convention = parser.finalstaticorder(`transient public final static String t3 = "";`);
      expect(convention.accfinst).equal(1);
    });

    it('public - final - static #4', () => {
      let convention = parser.finalstaticorder(`final public static String t4 = "";`);
      expect(convention.accfinst).equal(0);
    });

    it('final - public - static #1', () => {
      let convention = parser.finalstaticorder(`final public static String t1 = "";`);
      expect(convention.finaccst).equal(1);
    });

    it('final - public - static #2', () => {
      let convention = parser.finalstaticorder(`final public static transient String t2 = "";`);
      expect(convention.finaccst).equal(1);
    });

    it('final - public - static #3', () => {
      let convention = parser.finalstaticorder(`final transient public static String t3 = "";`);
      expect(convention.finaccst).equal(1);
    });

    it('final - public - static #4', () => {
      let convention = parser.finalstaticorder(`static public final String t4 = "";`);
      expect(convention.finaccst).equal(0);
    });

    it('static - public - final #1', () => {
      let convention = parser.finalstaticorder(`static public final String t1 = "";`);
      expect(convention.staccfin).equal(1);
    });

    it('static - public - final #2', () => {
      let convention = parser.finalstaticorder(`static public transient final String t2 = "";`);
      expect(convention.staccfin).equal(1);
    });

    it('static - public - final #3', () => {
      let convention = parser.finalstaticorder(`static transient public final String t3 = "";`);
      expect(convention.staccfin).equal(1);
    });

    it('static - public - final #4', () => {
      let convention = parser.finalstaticorder(`public static final String t4 = "";`);
      expect(convention.staccfin).equal(0);
    });
  });
});
