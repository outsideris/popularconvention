const expect = require('chai').expect;
const parser = require('../../src/parser/csharp-parser');

describe('C#-parser >', () => {
  describe('indent >', () => {
    it('check space indent #1', () => {
      const convention = parser.indent('public String getName{}');
      expect(convention.space).equal(0);
    });

    it('check space indent #2', () => {
      const convention = parser.indent('  public String getName{}');
      expect(convention.space).equal(1);
    });

    it('check space indent #3', () => {
      const convention = parser.indent('    public String getName{}');
      expect(convention.space).equal(1);
    });

    it('check tab indent #1', () => {
      const convention = parser.indent('\tpublic String getName{}');
      expect(convention.tab).equal(1);
    });

    it('check tab indent #2', () => {
      const convention = parser.indent('\t\tpublic String getName{}');
      expect(convention.tab).equal(1);
    });

    it('check tab indent #3', () => {
      const convention = parser.indent('\t\t  public String getName{}  ');
      expect(convention.tab).equal(1);
    });

    it('check tab indent #4', () => {
      const convention = parser.indent('  \tpublic String getName{}');
      expect(convention.tab).equal(0);
    });

    it('check tab indent #5', () => {
      const convention = parser.indent('public String getName{}');
      expect(convention.tab).equal(0);
    });
  });

  describe('blockstatement >', () => {
    it('check block statement with one space #1', () => {
      const convention = parser.blockstatement('if (height < MIN_HIGHT) { return; }');
      expect(convention.onespace).equal(1);
    });

    it('check block statement with one space #2', () => {
      const convention = parser.blockstatement('} else if (height < MIN_HIGHT) {');
      expect(convention.onespace).equal(1);
    });

    it('check block statement with one space #3', () => {
      const convention = parser.blockstatement('} else if ( height < MIN_HIGHT ) {');
      expect(convention.onespace).equal(1);
    });

    it('check block statement with one space #4', () => {
      const convention = parser.blockstatement('else if (height < MIN_HIGHT) {');
      expect(convention.onespace).equal(1);
    });

    it('check block statement with one space #5', () => {
      const convention = parser.blockstatement('if (height < MIN_HIGHT){ return; }');
      expect(convention.onespace).equal(0);
    });

    it('check block statement with one space #6', () => {
      const convention = parser.blockstatement('if (isTrue()) { return; }');
      expect(convention.onespace).equal(1);
    });

    it('check block statement with no space #1', () => {
      const convention = parser.blockstatement('if (height < MIN_HIGHT){ return (); }');
      expect(convention.nospace).equal(1);
    });

    it('check block statement with no space #2', () => {
      const convention = parser.blockstatement('}else if (height < MIN_HIGHT){');
      expect(convention.nospace).equal(1);
    });

    it('check block statement with no space #3', () => {
      const convention = parser.blockstatement('if (height < MIN_HIGHT)');
      expect(convention.nospace).equal(0);
    });

    it('check block statement with no space #4', () => {
      const convention = parser.blockstatement('} else if(height < MIN_HIGHT) {');
      expect(convention.nospace).equal(0);
    });

    it('check block statement with no space #5', () => {
      const convention = parser.blockstatement('} else if(isTrue()){');
      expect(convention.nospace).equal(1);
    });

    it('check block statement at new line #1', () => {
      const convention = parser.blockstatement('if (height < MIN_HIGHT)');
      expect(convention.newline).equal(1);
    });

    it('check block statement at new line #2', () => {
      const convention = parser.blockstatement('if (height < MIN_HIGHT) // comment');
      expect(convention.newline).equal(1);
    });

    it('check block statement at new line #3', () => {
      const convention = parser.blockstatement('if (height < MIN_HIGHT)/* */');
      expect(convention.newline).equal(1);
    });

    it('check block statement at new line #4', () => {
      const convention = parser.blockstatement('else if (height < MIN_HIGHT)');
      expect(convention.newline).equal(1);
    });

    it('check block statement at new line #5', () => {
      const convention = parser.blockstatement('else if (height < MIN_HIGHT) {');
      expect(convention.newline).equal(1);
    });

    it('check block statement at new line #6', () => {
      const convention = parser.blockstatement('}  else if ( height < MIN_HIGHT ) {');
      expect(convention.newline).equal(0);
    });

    it('check block statement at new line #7', () => {
      const convention = parser.blockstatement('if ( isTrue() ) //{}');
      expect(convention.newline).equal(1);
    });
  });

  describe('constant >', () => {
    it('check constant is pascal #1', () => {
      const convention = parser.constant('const string FooBar = "baz";');
      expect(convention.pascal).equal(1);
    });

    it('check constant is pascal #2', () => {
      const convention = parser.constant('const int Foo = "baz";');
      expect(convention.pascal).equal(1);
    });

    it('check constant is pascal #3', () => {
      const convention = parser.constant('public const int Foo = "baz";');
      expect(convention.pascal).equal(1);
    });

    it('check constant is pascal #4', () => {
      const convention = parser.constant('const string FOO_BAR = "baz";');
      expect(convention.pascal).equal(0);
    });

    it('check constant with all caps #1', () => {
      const convention = parser.constant('const string FOO_BAR = "baz";');
      expect(convention.allcaps).equal(1);
    });

    it('check constant with all caps #2', () => {
      const convention = parser.constant('public const iint FOO_BAR = 1;');
      expect(convention.allcaps).equal(1);
    });

    it('check constant with all caps #3', () => {
      const convention = parser.constant('const iint X = 1;');
      expect(convention.allcaps).equal(1);
    });

    it('check constant with all caps #4', () => {
      const convention = parser.constant('const string fooBar = "baz";');
      expect(convention.allcaps).equal(0);
    });

    it('check constant with not all caps #1', () => {
      const convention = parser.constant(' const string foo_bar = "baz";');
      expect(convention.notallcaps).equal(1);
    });

    it('check constant with not all caps #2', () => {
      const convention = parser.constant(' const string fooBar = "baz";');
      expect(convention.notallcaps).equal(1);
    });

    it('check constant with not all caps #3', () => {
      const convention = parser.constant('public const int fooBar = 1;');
      expect(convention.notallcaps).equal(1);
    });

    it('check constant with not all caps #4', () => {
      const convention = parser.constant('const int x=1;');
      expect(convention.notallcaps).equal(1);
    });
  });

  describe('conditionstatement >', () => {
    it('check condition statement with one space #1', () => {
      const convention = parser.conditionstatement('if ( a.equal("")) {');
      expect(convention.onespace).equal(1);
    });

    it('check condition statement with one space #2', () => {
      const convention = parser.conditionstatement('while ( isTrue() ) {');
      expect(convention.onespace).equal(1);
    });

    it('check condition statement with one space #3', () => {
      const convention = parser.conditionstatement('switch (name) {');
      expect(convention.onespace).equal(1);
    });

    it('check condition statement with one space #4', () => {
      const convention = parser.conditionstatement('if( isTrue()) {');
      expect(convention.onespace).equal(0);
    });

    it('check condition statement with no space #1', () => {
      const convention = parser.conditionstatement('if( isTrue()) {');
      expect(convention.nospace).equal(1);
    });

    it('check condition statement with no space #2', () => {
      const convention = parser.conditionstatement('while( isTrue() ) {');
      expect(convention.nospace).equal(1);
    });

    it('check condition statement with no space #3', () => {
      const convention = parser.conditionstatement('switch(name) {');
      expect(convention.nospace).equal(1);
    });

    it('check condition statement with no space #4', () => {
      const convention = parser.conditionstatement('if ( a.equal("")) {');
      expect(convention.nospace).equal(0);
    });
  });

  describe('argumentdef >', () => {
    it('check argument definition with one space #1', () => {
      const convention = parser.argumentdef('public void SetName11( String name ) {');
      expect(convention.onespace).equal(1);
    });

    it('check argument definition with one space #2', () => {
      const convention = parser.argumentdef('    public void SetName( String name ) {');
      expect(convention.onespace).equal(1);
    });

    it('check argument definition with one space #3', () => {
      const convention = parser.argumentdef('\t\tpublic void SetName( String name, Sting age) {');
      expect(convention.onespace).equal(1);
    });

    it('check argument definition with one space #4', () => {
      const convention = parser.argumentdef('if ( isTrue() ) {}');
      expect(convention.onespace).equal(1);
    });

    it('check argument definition with one space #5', () => {
      const convention = parser.argumentdef('while ( isTrue() ) {}');
      expect(convention.onespace).equal(1);
    });

    it('check argument definition with one space #6', () => {
      const convention = parser.argumentdef('public void SetName11(String name ) {');
      expect(convention.onespace).equal(0);
    });

    it('check argument definition with no space #1', () => {
      const convention = parser.argumentdef('public void SetName(String name) {');
      expect(convention.nospace).equal(1);
    });

    it('check argument definition with no space #2', () => {
      const convention = parser.argumentdef('\t\tpublic void SetName(String name) {');
      expect(convention.nospace).equal(1);
    });

    it('check argument definition with no space #3', () => {
      const convention = parser.argumentdef('public void SetName(String name, Sting age) {');
      expect(convention.nospace).equal(1);
    });

    it('check argument definition with no space #4', () => {
      const convention = parser.argumentdef('if (isTrue()) {}');
      expect(convention.nospace).equal(1);
    });

    it('check argument definition with no space #5', () => {
      const convention = parser.argumentdef('while (isTrue()) {}');
      expect(convention.nospace).equal(1);
    });

    it('check argument definition with no space #6', () => {
      const convention = parser.argumentdef('/t/tpublic void SetName( String name) {');
      expect(convention.nospace).equal(0);
    });
  });

  describe('linelength >',  () => {
    it('line length is 80 characters #1', () => {
      const convention = parser.linelength('    public String findFirstName( String name, String age) { return \"a\"; }');
      expect(convention.char80).equal(1);
    });

    it('line length is 80 characters #2', () => {
      const convention = parser.linelength('\t\tpublic String findFirstName( String name, String age) { return \"a\"; }');
      expect(convention.char80).equal(1);
    });

    it('line length is 80 characters #3', () => {
      const convention = parser.linelength('\t\t\tpublic String findFirstName( String name, String age) { return \"a\"; }');
      expect(convention.char80).equal(0);
    });

    it('line length is 120 characters #1', () => {
      const convention = parser.linelength('    public String findFirstName( String name, String age, String job) { return \"a\"; }');
      expect(convention.char120).equal(1);
    });

    it('line length is 120 characters #2', () => {
      const convention = parser.linelength('\t\tpublic String findFirstName( String name, String age, String job) { return \"a\"; }');
      expect(convention.char120).equal(1);
    });

    it('line length is 120 characters #3', () => {
      const convention = parser.linelength('\t\tpublic String findFirstName( String name, String age) { return \"a\"; }');
      expect(convention.char120).equal(0);
    });

    it('line length is 150 characters #1', () => {
      const convention = parser.linelength('    public String findFirstName( String name, String age, String job) { return \"a\"; } //afijfjeovjfiejffjeifjidjvosjfiejfioejovfjeifjiejfosjfioejfoiejfoi');
      expect(convention.char150).equal(1);
    });
  });
});
