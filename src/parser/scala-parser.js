'use strict';

// parsing Scala code
var _ = require('underscore');

module.exports = {
  lang: 'scala',
  parse: function(line, convention, commitUrl) {
    convention = this.indent(line, convention, commitUrl);
    convention = this.linelength(line, convention, commitUrl);
    convention = this.classname(line, convention, commitUrl);
    convention = this.variablename(line, convention, commitUrl);
    return convention = this.parametertype(line, convention, commitUrl);
  },
  indent: function(line, convention, commitUrl) {
    if (!convention) { convention = { lang: this.lang }; }

    if (!convention.indent) {
      convention.indent = {
        title: "Space vs. Tab",
        column: [
          { key: "tab",
            display: "Tab",
            code: "class Foo {\n    // use tab for indentation\n    def bar = {}\n}"
          }, {
            key: "space",
            display: "Space",
            code: "class Foo {\n  def bar = {}\n}"
          }
        ],
        tab: 0,
        space: 0,
        commits: []
      };
    }

    var tab = /^\t+.*/;
    var space = /^\s+.*/;

    if (tab.test(line)) { convention.indent.tab = convention.indent.tab + 1; }
    if (space.test(line)) { convention.indent.space = convention.indent.space + 1; }
    if (tab.test(line) || space.test(line)) { convention.indent.commits.push(commitUrl); }

    convention.indent.commits = _.uniq(convention.indent.commits);
    return convention;
  },
  linelength: function(line, convention, commitUrl) {
    if (!convention) { convention = { lang: this.lang }; }

    if (!convention.linelength) {
      convention.linelength = {
        title: "Line length is over 80 characters?",
        column: [
          {
            key: "char80",
            display: "Line length is within 80 characters.",
            code: "/* width is within 80 characters */"
          }, {
            key: "char120",
            display: "Line length is within 120 characters",
            code: "/* width is within 120 characters */"
          }, {
            key: "char150",
            display: "Line length is within 150 characters",
            code: "/* width is within 150 characters */"
          }
        ],
        char80: 0,
        char120: 0,
        char150: 0,
        commits: []
      };
    }

    var width = line.length;
    var tabcount = line.split('\t').length - 1;
    width += tabcount * 3;

    if (width < 80) { convention.linelength.char80 = convention.linelength.char80 + 1; }
    else if (width < 120) { convention.linelength.char120 = convention.linelength.char120 + 1; }
    else { convention.linelength.char150 = convention.linelength.char150 + 1; }

    convention.linelength.commits.push(commitUrl);
    convention.linelength.commits = _.uniq(convention.linelength.commits);
    return convention;
  },
  classname: function(line, convention, commitUrl) {
    if (!convention) { convention = { lang: this.lang }; }

    if (!convention.classname) {
      convention.classname = {
        title: "Classes/Traits naming",
        column: [
          { key: "capital",
            display: "CamelCase with a capital first letter",
            code: "class MyFairLady\n\ntrait MyFairLady"
          }, {
            key: "nocapital",
            display: "CamelCase without a capital first letter",
            code: "class myFairLady\n\ntrait myFairLady"
          }
        ],
        capital: 0,
        nocapital: 0,
        commits: []
      };
    }

    var capital = /(class|trait)\s+[A-Z][a-z0-9]+([A-Z][a-z0-9]+)*/;
    var nocapital = /(class|trait)\s+[a-z0-9]+([A-Z][a-z0-9]+)*/;

    if (capital.test(line)) { convention.classname.capital = convention.classname.capital + 1; }
    if (nocapital.test(line)) { convention.classname.nocapital = convention.classname.nocapital + 1; }
    if (capital.test(line) || nocapital.test(line)) { convention.classname.commits.push(commitUrl); }

    convention.classname.commits = _.uniq(convention.classname.commits);
    return convention;
  },
  variablename: function(line, convention, commitUrl) {
    if (!convention) { convention = { lang: this.lang }; }

    if (!convention.variablename) {
      convention.variablename = {
        title: "Values, Variable and Methods naming",
        column: [
          { key: "camelcase",
            display: "CamelCase with the first letter lower-case",
            code: "val myValue = ...\n\ndef myMethod = ...\n\nvar myVariable"
          }, {
            key: "noncamelcase",
            display: "CamelCase without the first letter lower-case",
            code: "val MyValue = ...\n\ndef MyMethod = ...\n\nvar MyVariable"
          }
        ],
        camelcase: 0,
        noncamelcase: 0,
        commits: []
      };
    }

    var camelcase = /(val|def|var)\s+[a-z]+([A-Z][a-z0-9])*/;
    var noncamelcase = /(val|def|var)\s+[A-Z][a-z]+([A-Z][a-z0-9])*/;

    if (camelcase.test(line)) { convention.variablename.camelcase = convention.variablename.camelcase + 1; }
    if (noncamelcase.test(line)) { convention.variablename.noncamelcase = convention.variablename.noncamelcase + 1; }
    if (camelcase.test(line) || noncamelcase.test(line)) { convention.variablename.commits.push(commitUrl); }

    convention.variablename.commits = _.uniq(convention.variablename.commits);
    return convention;
  },
  parametertype: function(line, convention, commitUrl) {
    if (!convention) { convention = { lang: this.lang }; }

    if (!convention.parametertype) {
      convention.parametertype = {
        title: "Type of Parameters Definition",
        column: [
          { key: "tracespace",
            display: "Followed by space",
            code: "def add(a: Int, b: Int) = a + b"
          }, {
            key: "bothspace",
            display: "Using space in before/after",
            code: "def add(a : Int, b : Int) = a + b"
          }, {
            key: "nospace",
            display: "No space",
            code: "def add(a:Int, b:Int) = a + b"
          }
        ],
        tracespace: 0,
        bothspace: 0,
        nospace: 0,
        commits: []
      };
    }

    var tracespace = /def\s+\w+\(.*\s*\w+:\s+[A-Z]\w*/;
    var bothspace = /def\s+\w+\(.*\s*\w\s+:\s+[A-Z]\w*/;
    var nospace = /def\s+\w+\(.*\s*\w:[A-Z]\w*/;

    if (tracespace.test(line)) { convention.parametertype.tracespace = convention.parametertype.tracespace + 1; }
    if (bothspace.test(line)) { convention.parametertype.bothspace = convention.parametertype.bothspace + 1; }
    if (nospace.test(line)) { convention.parametertype.nospace = convention.parametertype.nospace + 1; }
    if (tracespace.test(line) || bothspace.test(line) || nospace.test(line)) { convention.parametertype.commits.push(commitUrl); }

    convention.parametertype.commits = _.uniq(convention.parametertype.commits);
    return convention;
  }
};
