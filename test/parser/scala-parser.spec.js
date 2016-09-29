const expect = require('chai').expect;
const parser = require('../../src/parser/scala-parser');

describe('Scala-parser >', () => {
  describe('indent >', () => {
    it('check space indent #1', () => {
      const convention = parser.indent(`a = 1;`);
      expect(convention.space).equal(0);
    });

    it('check space indent #2', () => {
      const convention = parser.indent(`  a = 1;`);
      expect(convention.space).equal(1);
    });

    it('check space indent #3', () => {
      const convention = parser.indent(`  a = 1;`);
      expect(convention.space).equal(1);
    });

    it('check space indent #4', () => {
      const convention = parser.indent(`   a = 1;`);
      expect(convention.space).equal(1);
    });

    it('check tab indent #1', () => {
      const convention = parser.indent(`\ta = 1;`);
      expect(convention.tab).equal(1);
    });

    it('check tab indent #2', () => {
      const convention = parser.indent(`\t\ta = 1;`);
      expect(convention.tab).equal(1);
    });

    it('check tab indent #3', () => {
      const convention = parser.indent(`\t\t  a = 1;  `);
      expect(convention.tab).equal(1);
    });

    it('check tab indent #4', () => {
      const convention = parser.indent(`  \ta = 1;`);
      expect(convention.tab).equal(0);
    });

    it('check tab indent #5', () => {
      const convention = parser.indent(`a = 1;`);
      expect(convention.tab).equal(0);
    });
  });

  describe('linelength >', () => {
    it('line length is 80 characters #1', () => {
      const convention = parser.linelength(`    public String findFirstName( String name, String age) { return \"a\"; }`);
      expect(convention.char80).equal(1);
    });

    it('line length is 80 characters #2', () => {
      const convention = parser.linelength(`\t\tpublic String findFirstName( String name, String age) { return \"a\"; }`);
      expect(convention.char80).equal(1);
    });

    it('line length is 80 characters #3', () => {
      const convention = parser.linelength(`\t\t\tpublic String findFirstName( String name, String age) { return \"a\"; }`);
      expect(convention.char80).equal(0);
    });

    it('line length is 120 characters #1', () => {
      const convention = parser.linelength(`    public String findFirstName( String name, String age, String job) { return \"a\"; }`);
      expect(convention.char120).equal(1);
    });

    it('line length is 120 characters #2', () => {
      const convention = parser.linelength(`\t\tpublic String findFirstName( String name, String age, String job) { return \"a\"; }`);
      expect(convention.char120).equal(1);
    });

    it('line length is 120 characters #3', () => {
      const convention = parser.linelength(`\t\tpublic String findFirstName( String name, String age) { return \"a\"; }`);
      expect(convention.char120).equal(0);
    });

    it('line length is 150 characters #1', () => {
      const convention = parser.linelength(`    public String findFirstName( String name, String age, String job) { return \"a\"; } //afijfjeovjfiejffjeifjidjvosjfiejfioejovfjeifjiejfosjfioejfoiejfoi`);
      expect(convention.char150).equal(1);
    });
  });

  describe('classname >', () => {
    it('camelcases with capitalzied #1', () => {
      const convention = parser.classname(`class MyFairLady`);
      expect(convention.capital).equal(1);
    });

    it('camelcases with capitalzied #2', () => {
      const convention = parser.classname(`class My1stFairLady`);
      expect(convention.capital).equal(1);
    });

    it('camelcases with capitalzied #3', () => {
      const convention = parser.classname(`trait MyFairLady`);
      expect(convention.capital).equal(1);
    });

    it('camelcases with capitalzied #4', () => {
      const convention = parser.classname(`class myFairLady`);
      expect(convention.capital).equal(0);
    });

    it('camelcases with non-capitalzied #1', () => {
      const convention = parser.classname(`class myFairLady`);
      expect(convention.nocapital).equal(1);
    });

    it('camelcases with non-capitalzied #2', () => {
      const convention = parser.classname(`class my1stFairLady`);
      expect(convention.nocapital).equal(1);
    });

    it('camelcases with non-capitalzied #3', () => {
      const convention = parser.classname(`trait myFairLady`);
      expect(convention.nocapital).equal(1);
    });

    it('camelcases with non-capitalzied #4', () => {
      const convention = parser.classname(`trait MyFairLady`);
      expect(convention.nocapital).equal(0);
    });
  });

  describe('variablename >', () => {
    it('camelcases with capitalzied #1', () => {
      const convention = parser.variablename(`val myValue = ...`);
      expect(convention.camelcase).equal(1);
    });

    it('camelcases with capitalzied #2', () => {
      const convention = parser.variablename(`def myMethod = ...`);
      expect(convention.camelcase).equal(1);
    });

    it('camelcases with capitalzied #3', () => {
      const convention = parser.variablename(`var myVariable`);
      expect(convention.camelcase).equal(1);
    });

    it('camelcases with capitalzied #4', () => {
      const convention = parser.variablename(`val MY_VALUE = ...`);
      expect(convention.camelcase).equal(0);
    });

    it('camelcases with non-capitalzied #1', () => {
      const convention = parser.variablename(`val MyValue = ...`);
      expect(convention.noncamelcase).equal(1);
    });

    it('camelcases with non-capitalzied #2', () => {
      const convention = parser.variablename(`def MyMethod = ...`);
      expect(convention.noncamelcase).equal(1);
    });

    it('camelcases with non-capitalzied #3', () => {
      const convention = parser.variablename(`var MyVariable`);
      expect(convention.noncamelcase).equal(1);
    });

    it('camelcases with non-capitalzied #4', () => {
      const convention = parser.variablename(`val MY_VALUE = ...`);
      expect(convention.noncamelcase).equal(0);
    });
  });

  describe('parametertype >', () => {
    it('parameter type with one space #1', () => {
      const convention = parser.parametertype(`def add(a: Int, b: Int) = a + b`);
      expect(convention.tracespace).equal(1);
    });

    it('parameter type with one space #2', () => {
      const convention = parser.parametertype(`def add(a:Int, b: Int) = a + b`);
      expect(convention.tracespace).equal(1);
    });

    it('parameter type with one space #3', () => {
      const convention = parser.parametertype(`def add(a:Int, b:Int): Unit = a + b`);
      expect(convention.tracespace).equal(0);
    });

    it('parameter type with both space #1', () => {
      const convention = parser.parametertype(`def add(a : Int, b : Int) = a + b`);
      expect(convention.bothspace).equal(1);
    });

    it('parameter type with both space #2', () => {
      const convention = parser.parametertype(`def add(a:Int, b : Int) = a + b`);
      expect(convention.bothspace).equal(1);
    });

    it('parameter type with both space #3', () => {
      const convention = parser.parametertype(`def add(a:Int, b: Int) : Unit = a + b`);
      expect(convention.bothspace).equal(0);
    });

    it('parameter type with no space #1', () => {
      const convention = parser.parametertype(`def add(a:Int, b:Int) = a + b`);
      expect(convention.nospace).equal(1);
    });

    it('parameter type with no space #2', () => {
      const convention = parser.parametertype(`def add(a: Int, b:Int) = a + b`);
      expect(convention.nospace).equal(1);
    });

    it('parameter type with no space #3', () => {
      const convention = parser.parametertype(`def add(a: Int, b: Int):Unit = a + b`);
      expect(convention.nospace).equal(0);
    });
  });
});
