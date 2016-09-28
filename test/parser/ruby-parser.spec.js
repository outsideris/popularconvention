const expect = require('chai').expect;
const parser = require('../../src/parser/ruby-parser');

describe('Ruby-parser >', () => {
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

  describe('whitespace >', () => {
    it('one whitespace #1', () => {
      const convention = parser.whitespace(`sum = 1 + 2`);
      expect(convention.spaces).equal(1);
    });

    it('one whitespace #2', () => {
      const convention = parser.whitespace(`a, b = 1, 2`);
      expect(convention.spaces).equal(1);
    });

    it('one whitespace #3', () => {
      const convention = parser.whitespace(`1 > 2 ? true : false; puts 'Hi'`);
      expect(convention.spaces).equal(1);
    });

    it('one whitespace #4', () => {
      const convention = parser.whitespace(`[1, 2, 3].each { |e| puts e }`);
      expect(convention.spaces).equal(1);
    });

    it('one whitespace #5', () => {
      const convention = parser.whitespace(`[1, 2, 3].each {|e| puts e }`);
      expect(convention.spaces).equal(0);
    });

    it('one whitespace #6', () => {
      const convention = parser.whitespace(`sum = 1+2`);
      expect(convention.spaces).equal(0);
    });

    it('one whitespace #7', () => {
      const convention = parser.whitespace(`sum = "1+2"`);
      expect(convention.spaces).equal(1);
    });

    it('one whitespace #8', () => {
      const convention = parser.whitespace(`a, b = 1,2`);
      expect(convention.spaces).equal(0);
    });

    it('one whitespace #9', () => {
      const convention = parser.whitespace(`a, b = 1, 2;`);
      expect(convention.spaces).equal(1);
    });

    it('no whitespace #1', () => {
      const convention = parser.whitespace(`sum = 1 +2`);
      expect(convention.nospace).equal(1);
    });

    it('no whitespace #2', () => {
      const convention = parser.whitespace(`a,b = 1, 2`);
      expect(convention.nospace).equal(1);
    });

    it('no whitespace #3', () => {
      const convention = parser.whitespace(`1>2 ? true : false;puts 'Hi'`);
      expect(convention.nospace).equal(1);
    });

    it('no whitespace #4', () => {
      const convention = parser.whitespace(`[1, 2, 3].each {|e| puts e}`);
      expect(convention.nospace).equal(1);
    });

    it('no whitespace #5', () => {
      const convention = parser.whitespace(`sum = 1 + 2`);
      expect(convention.nospace).equal(0);
    });

    it('no whitespace #6', () => {
      const convention = parser.whitespace(`a, b = 1, 2;c`);
      expect(convention.nospace).equal(1);
    });
  });

  describe('asignDefaultValue >', () => {
    it('use spaces #1', () => {
      const convention = parser.asignDefaultValue(`def some_method(arg1 = :default)`);
      expect(convention.space).equal(1);
    });

    it('use spaces #2', () => {
      const convention = parser.asignDefaultValue(`   def some_method(arg2 = nil)`);
      expect(convention.space).equal(1);
    });

    it('use spaces #3', () => {
      const convention = parser.asignDefaultValue(`def some_method( arg3 = [] )`);
      expect(convention.space).equal(1);
    });

    it('use spaces #4', () => {
      const convention = parser.asignDefaultValue(`def some_method(arg1 = :default, arg2 = nil, arg3 = [])`);
      expect(convention.space).equal(1);
    });

    it('use spaces #5', () => {
      const convention = parser.asignDefaultValue(`def some_method(arg3)`);
      expect(convention.space).equal(0);
    });

    it('use spaces #6', () => {
      const convention = parser.asignDefaultValue(`def some_method(arg1=:default)`);
      expect(convention.space).equal(0);
    });

    it('no spaces #1', () => {
      const convention = parser.asignDefaultValue(`def some_method(arg1=:default)`);
      expect(convention.nospace).equal(1);
    });

    it('no spaces #2', () => {
      const convention = parser.asignDefaultValue(`  def some_method(arg2=nil)`);
      expect(convention.nospace).equal(1);
    });

    it('no spaces #3', () => {
      const convention = parser.asignDefaultValue(`def some_method( arg3=[] )`);
      expect(convention.nospace).equal(1);
    });

    it('no spaces #4', () => {
      const convention = parser.asignDefaultValue(`def some_method(arg1=:default, arg2=nil, arg3=[])`);
      expect(convention.nospace).equal(1);
    });

    it('no spaces #5', () => {
      const convention = parser.asignDefaultValue(`def some_method( arg3 = [] )`);
      expect(convention.nospace).equal(0);
    });

    it('no spaces #6', () => {
      const convention = parser.asignDefaultValue(`def some_method(arg3)`);
      expect(convention.nospace).equal(0);
    });
  });

  describe('numericLiteral >', () => {
    it('use underscore #1', () => {
      const convention = parser.numericLiteral(`num = 1_000_000`);
      expect(convention.underscore).equal(1);
    });

    it('use underscore #2', () => {
      const convention = parser.numericLiteral(`num = 7_473`);
      expect(convention.underscore).equal(1);
    });

    it('use underscore #3', () => {
      const convention = parser.numericLiteral(`num = 34_000_000`);
      expect(convention.underscore).equal(1);
    });

    it('use underscore #4', () => {
      const convention = parser.numericLiteral(`str = "404_094"`);
      expect(convention.underscore).equal(0);
    });

    it('use underscore #5', () => {
      const convention = parser.numericLiteral(`num = 438958`);
      expect(convention.underscore).equal(0);
    });

    it('use underscore #6', () => {
      const convention = parser.numericLiteral(`num = 958`);
      expect(convention.underscore).equal(0);
    });

    it('use no underscore #1', () => {
      const convention = parser.numericLiteral(`num = 1000000`);
      expect(convention.nounderscore).equal(1);
    });

    it('use no underscore #2', () => {
      const convention = parser.numericLiteral(`num = 438958`);
      expect(convention.nounderscore).equal(1);
    });

    it('use no underscore #3', () => {
      const convention = parser.numericLiteral(`num = 584058`);
      expect(convention.nounderscore).equal(1);
    });

    it('use no underscore #4', () => {
      const convention = parser.numericLiteral(`num = 504`);
      expect(convention.nounderscore).equal(0);
    });

    it('use no underscore #5', () => {
      const convention = parser.numericLiteral(`str = "404094"`);
      expect(convention.nounderscore).equal(0);
    });

    it('use no underscore #6', () => {
      const convention = parser.numericLiteral(`num = 584_058`);
      expect(convention.nounderscore).equal(0);
    });
  });

  describe('defNoArgs >', () => {
    it('omit parenthenes #1', () => {
      const convention = parser.defNoArgs(` def some_method`);
      expect(convention.omit).equal(1);
    });

    it('omit parenthenes #2', () => {
      const convention = parser.defNoArgs(` def some_method # comment`);
      expect(convention.omit).equal(1);
    });

    it('omit parenthenes #3', () => {
      const convention = parser.defNoArgs(` def some_method # comment()`);
      expect(convention.omit).equal(1);
    });

    it('omit parenthenes #4', () => {
      const convention = parser.defNoArgs(` def some_method()`);
      expect(convention.omit).equal(0);
    });

    it('omit parenthenes #5', () => {
      const convention = parser.defNoArgs(` def some_method arg1, arg2`);
      expect(convention.omit).equal(0);
    });

    it('omit parenthenes #6', () => {
      const convention = parser.defNoArgs(` def some_method arg1`);
      expect(convention.omit).equal(0);
    });

    it('use parenthenes #1', () => {
      const convention = parser.defNoArgs(` def some_method()`);
      expect(convention.use).equal(1);
    });

    it('use parenthenes #2', () => {
      const convention = parser.defNoArgs(` def some_method ()`);
      expect(convention.use).equal(1);
    });

    it('use parenthenes #3', () => {
      const convention = parser.defNoArgs(`    def some_method ( )`);
      expect(convention.use).equal(1);
    });

    it('use parenthenes #4', () => {
      const convention = parser.defNoArgs(` def some_method # comment()`);
      expect(convention.use).equal(0);
    });

    it('use parenthenes #5', () => {
      const convention = parser.defNoArgs(` def some_method(arg)`);
      expect(convention.use).equal(0);
    });
  });

  describe('defArgs >', () => {
    it('omit parenthenes #1', () => {
      const convention = parser.defArgs(` def some_method arg1, arg2`);
      expect(convention.omit).equal(1);
    });

    it('omit parenthenes #2', () => {
      const convention = parser.defArgs(` def some_method arg1`);
      expect(convention.omit).equal(1);
    });

    it('omit parenthenes #3', () => {
      const convention = parser.defArgs(` def some_method  arg1, arg2 # fjeofjeo( arg1, arg2)`);
      expect(convention.omit).equal(1);
    });

    it('omit parenthenes #4', () => {
      const convention = parser.defArgs(`def some_method()`);
      expect(convention.omit).equal(0);
    });

    it('omit parenthenes #5', () => {
      const convention = parser.defArgs(`def some_method(arg1, arg2)`);
      expect(convention.omit).equal(0);
    });

    it('omit parenthenes #6', () => {
      const convention = parser.defArgs(`def some_method`);
      expect(convention.omit).equal(0);
    });

    it('use parenthenes #1', () => {
      const convention = parser.defArgs(` def some_method( arg1, arg2)`);
      expect(convention.use).equal(1);
    });

    it('use parenthenes #2', () => {
      const convention = parser.defArgs(` def some_method ( arg1 )`);
      expect(convention.use).equal(1);
    });

    it('use parenthenes #3', () => {
      const convention = parser.defArgs(`    def some_method (  arg1, arg2 )`);
      expect(convention.use).equal(1);
    });

    it('use parenthenes #4', () => {
      const convention = parser.defArgs(`def some_method arg1, arg2`);
      expect(convention.use).equal(0);
    });

    it('use parenthenes #5', () => {
      const convention = parser.defArgs(`def some_method()`);
      expect(convention.use).equal(0);
    });

    it('use parenthenes #6', () => {
      const convention = parser.defArgs(`def update_requirements(features, group_overrides, init_git_url=nil, user_env_vars=nil)`);
      expect(convention.use).equal(1);
    });

    it('use parenthenes #7', () => {
      const convention = parser.defArgs(`def some_method`);
      expect(convention.use).equal(0);
    });
  });
});
