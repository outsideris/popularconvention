'use strict';

// parsing Ruby code
var _ = require('underscore');

module.exports = {
  lang: 'rb',
  parse: function(line, convention, commitUrl) {
    convention = this.indent(line, convention, commitUrl);
    convention = this.linelength(line, convention, commitUrl);
    convention = this.whitespace(line, convention, commitUrl);
    convention = this.asignDefaultValue(line, convention, commitUrl);
    convention = this.numericLiteral(line, convention, commitUrl);
    convention = this.defNoArgs(line, convention, commitUrl);
    return convention = this.defArgs(line, convention, commitUrl);
  },
  indent: function(line, convention, commitUrl) {
    if (!convention) { convention = { lang: this.lang }; }

    if (!convention.indent) {
      convention.indent = {
        title: "Space vs. Tab",
        column: [
          { key: "tab",
            display: "Tab",
            code: "def foo(test)\n  # use tab for indentation\n  Thread.new do |blockvar|\n    # use tab for indentation\n    ABC::DEF.reverse(:a_symbol, :'a symbol', :<=>, 'test' + test)\n  end.join\nend"
          }, {
            key: "space",
            display: "Space",
            code: "def foo(test)\n  Thread.new do |blockvar|\n    ABC::DEF.reverse(:a_symbol, :'a symbol', :<=>, 'test' + test)\n  end.join\nend"
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
          { key: "char80",
            display: "Line length is within 80 characters.",
            code: "# width is within 80 characters"
          }, {
            key: "char120",
            display: "Line length is within 120 characters",
            code: "# width is within 120 characters"
          }, {
            key: "char150",
            display: "Line length is within 150 characters",
            code: "# width is within 150 characters"
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
  whitespace: function(line, convention, commitUrl) {
    if (!convention) { convention = { lang: this.lang }; }

    if (!convention.whitespace) {
      convention.whitespace = {
        title: "Whitespace around operators, colons, { and }, after commas, semicolons",
        column: [
          { key: "spaces",
            display: "Using spaces",
            code: "sum = 1 + 2\n\na, b = 1, 2\n\n1 > 2 ? true : false; puts 'Hi'\n\n[1, 2, 3].each { |e| puts e }"
          }, {
            key: "nospace",
            display: "Using no space",
            code: "sum = 1 +2\n\na,b = 1, 2\n\n1>2 ? true : false;puts 'Hi'\n\n[1, 2, 3].each {|e| puts e}"
          }
        ],
        spaces: 0,
        nospace: 0,
        commits: []
      };
    }

    var placeholder = "CONVENTION-PLACEHOLDER";
    var operators = '[+=*/%>?:{}]';
    var symbols = '[,;]';
    var spaces = function(line) {
      var temp = line.replace(/'.*?'/g, placeholder);
      temp = temp.replace(/".*?"/g, placeholder);
      return !(new RegExp("\\w+" + operators)).test(temp) && !(new RegExp("" + operators + "\\w+")).test(temp) &&
             !(new RegExp("" + symbols + "\\w+")).test(temp) &&
             ((new RegExp("\\s+" + operators + "\\s+")).test(temp || (new RegExp("" + symbols + "\\s+")).test(temp)));
    };
    var nospace = function(line) {
      var temp = line.replace(/'.*?'/g, placeholder);
      temp = temp.replace(/".*?"/g, placeholder);
      return (new RegExp("\\w+" + operators)).test(temp) || (new RegExp("" + operators + "\\w+")).test(temp) ||
             (new RegExp("" + symbols + "\\w+")).test(temp);
    };

    if (spaces(line)) { convention.whitespace.spaces = convention.whitespace.spaces + 1; }
    if (nospace(line)) { convention.whitespace.nospace = convention.whitespace.nospace + 1; }
    if (spaces(line) || nospace(line)) { convention.whitespace.commits.push(commitUrl); }

    convention.whitespace.commits = _.uniq(convention.whitespace.commits);
    return convention;
  },
  asignDefaultValue: function(line, convention, commitUrl) {
    if (!convention) { convention = { lang: this.lang }; }

    if (!convention.asignDefaultValue) {
      convention.asignDefaultValue = {
        title: "How to write assigning default values to method parameters",
        column: [
          { key: "space",
            display: "Use spaces",
            code: "def some_method(arg1 = :default, arg2 = nil, arg3 = [])\n  # do something...\nend"
          }, {
            key: "nospace",
            display: "Use spaces before = or after =",
            code: "def some_method(arg1=:default, arg2=nil, arg3=[])\n  # do something...\nend"
          }
        ],
        space: 0,
        nospace: 0,
        commits: []
      };
    }

    var space = /^[\s\t]*def.*\((\s*\w+\s+=\s+[\[\]:\w,]+\s*)+\)/;
    var nospace = /^[\s\t]*def.*\((\s*\w+=[\[\]:\w,]+\s*)+\)/;

    if (space.test(line)) { convention.asignDefaultValue.space = convention.asignDefaultValue.space + 1; }
    if (nospace.test(line)) { convention.asignDefaultValue.nospace = convention.asignDefaultValue.nospace + 1; }
    if (space.test(line) || nospace.test(line)) { convention.asignDefaultValue.commits.push(commitUrl); }

    convention.asignDefaultValue.commits = _.uniq(convention.asignDefaultValue.commits);
    return convention;
  },
  numericLiteral: function(line, convention, commitUrl) {
    if (!convention) { convention = { lang: this.lang }; }

    if (!convention.numericLiteral) {
      convention.numericLiteral = {
        title: "How to write large numeric literals",
        column: [
          { key: "underscore",
            display: "Write with underscore",
            code: "num = 1_000_000"
          }, {
            key: "nounderscore",
            display: "Write without underscore",
            code: "num = 1000000"
          }
        ],
        underscore: 0,
        nounderscore: 0,
        commits: []
      };
    }

    var placeholder = "CONVENTION-PLACEHOLDER";
    var underscore = function(line) {
      var temp = line.replace(/'.*?'/g, placeholder);
      temp = temp.replace(/".*?"/g, placeholder);
      return (/[0-9]+(_[0-9]{3,})+/).test(temp);
    };
    var nounderscore = function(line) {
      var temp = line.replace(/'.*?'/g, placeholder);
      temp = temp.replace(/".*?"/g, placeholder);
      return (/[0-9]{4,}/).test(temp);
    };

    if (underscore(line)) { convention.numericLiteral.underscore = convention.numericLiteral.underscore + 1; }
    if (nounderscore(line)) { convention.numericLiteral.nounderscore = convention.numericLiteral.nounderscore + 1; }
    if (underscore(line) || nounderscore(line)) { convention.numericLiteral.commits.push(commitUrl); }

    convention.numericLiteral.commits = _.uniq(convention.numericLiteral.commits);
    return convention;
  },
  defNoArgs: function(line, convention, commitUrl) {
    if (!convention) { convention = { lang: this.lang }; }

    if (!convention.defNoArgs) {
      convention.defNoArgs = {
        title: "Omit parentheses when there aren't any arguments",
        column: [
          { key: "omit",
            display: "Omit",
            code: "def some_method\n  # do something...\nend"
          }, {
            key: "use",
            display: "Use the parentheses",
            code: "def some_method()\n  # do something...\nend"
          }
        ],
        omit: 0,
        use: 0,
        commits: []
      };
    }

    var omit = /^[\s\t]*def\s+\w+\s*[^(),\w]*(#+.*)*$/;
    var use = /^[\s\t]*def\s+\w+\s*\(\s*\)/;

    if (omit.test(line)) { convention.defNoArgs.omit = convention.defNoArgs.omit + 1; }
    if (use.test(line)) { convention.defNoArgs.use = convention.defNoArgs.use + 1; }
    if (omit.test(line) || use.test(line)) { convention.defNoArgs.commits.push(commitUrl); }

    convention.defNoArgs.commits = _.uniq(convention.defNoArgs.commits);
    return convention;
  },
  defArgs: function(line, convention, commitUrl) {
    if (!convention) { convention = { lang: this.lang }; }

    if (!convention.defArgs) {
      convention.defArgs = {
        title: "Parentheses around arguments in def",
        column: [
          { key: "omit",
            display: "Omit",
            code: "def some_method arg1, arg2\n  # do something...\nend"
          }, {
            key: "use",
            display: "Use the parentheses",
            code: "def some_method(arg1, arg2)\n  # do something...\nend"
          }
        ],
        omit: 0,
        use: 0,
        commits: []
      };
    }

    var omit = /^[\s\t]*def\s+\w+\s+\w[^()]*(#+.*)*$/;
    var use = /^[\s\t]*def\s+\w+\s*\((\s*[\w=]+,?)+\s*/;

    if (omit.test(line)) { convention.defArgs.omit = convention.defArgs.omit + 1; }
    if (use.test(line)) { convention.defArgs.use = convention.defArgs.use + 1; }
    if (omit.test(line) || use.test(line)) { convention.defArgs.commits.push(commitUrl); }

    convention.defArgs.commits = _.uniq(convention.defArgs.commits);
    return convention;
  }
};
