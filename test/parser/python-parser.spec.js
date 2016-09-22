const expect = require('chai').expect;
const parser = require('../../src/parser/python-parser');

describe('Python-parser >', () => {
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

  describe('imports >', () => {
    it('imports on separate lines #1', () => {
      const convention = parser.imports(`import os`);
      expect(convention.separated).equal(1);
    });

    it('imports on separate lines #2', () => {
      const convention = parser.imports(`  import foo.bar.yourclass`);
      expect(convention.separated).equal(1);
    });

    it('imports on separate lines #3', () => {
      const convention = parser.imports(`  import os # ,`);
      expect(convention.separated).equal(1);
    });

    it('imports on separate lines #4', () => {
      const convention = parser.imports(`  import os, sys`);
      expect(convention.separated).equal(0);
    });

    it('imports on non-separate lines #1', () => {
      const convention = parser.imports(`import os, sys`);
      expect(convention.noseparated).equal(1);
    });

    it('imports on non-separate lines #2', () => {
      const convention = parser.imports(`  import os, sys`);
      expect(convention.noseparated).equal(1);
    });

    it('imports on non-separate lines #3', () => {
      const convention = parser.imports(`import os`);
      expect(convention.noseparated).equal(0);
    });
  });

  describe('whitespace >', () => {
    it('no extraneous whitespace #1', () => {
      const convention = parser.whitespace(`spam(ham[1], {eggs: 2})`);
      expect(convention.noextra).equal(1);
    });

    it('no extraneous whitespace #3', () => {
      const convention = parser.whitespace(`if x == 4: print x, y; x, y = y, x`);
      expect(convention.noextra).equal(1);
    });

    it('no extraneous whitespace #4', () => {
      const convention = parser.whitespace(`spam(1)`);
      expect(convention.noextra).equal(1);
    });

    it('no extraneous whitespace #4', () => {
      const convention = parser.whitespace(`dict['key'] = list[index]`);
      expect(convention.noextra).equal(1);
    });

    it('no extraneous whitespace #5', () => {
      const convention = parser.whitespace(`x = 1`);
      expect(convention.noextra).equal(1);
    });

    it('no extraneous whitespace #6', () => {
      const convention = parser.whitespace(`dict ['key'] = list [index]`);
      expect(convention.noextra).equal(0);
    });

    it('extraneous whitespace #1', () => {
      const convention = parser.whitespace(`spam( ham[ 1 ], { eggs: 2 } )`);
      expect(convention.extra).equal(1);
    });

    it('extraneous whitespace #2', () => {
      const convention = parser.whitespace(`if x == 4 : print x , y ; x , y = y , x`);
      expect(convention.extra).equal(1);
    });

    it('extraneous whitespace #3', () => {
      const convention = parser.whitespace(`spam (1)`);
      expect(convention.extra).equal(1);
    });

    it('extraneous whitespace #4', () => {
      const convention = parser.whitespace(`dict ['key'] = list [index]`);
      expect(convention.extra).equal(1);
    });

    it('extraneous whitespace #5', () => {
      const convention = parser.whitespace(`x             = 1`);
      expect(convention.extra).equal(1);
    });

    it('extraneous whitespace #6', () => {
      const convention = parser.whitespace(`if x == 4: print x, y; x, y = y, x`);
      expect(convention.extra).equal(0);
    });
  });
});
