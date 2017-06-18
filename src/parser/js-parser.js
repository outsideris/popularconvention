'use strict';

// parsing JavaScript code
var _ = require('underscore');

module.exports = {
  lang: 'js',
  parse: function(line, convention, commitUrl) {
    convention = this.comma(line, convention, commitUrl);
    convention = this.indent(line, convention, commitUrl);
    convention = this.functiondef(line, convention, commitUrl);
    convention = this.argumentdef(line, convention, commitUrl);
    convention = this.literaldef(line, convention, commitUrl);
    convention = this.conditionstatement(line, convention, commitUrl);
    return convention = this.quotes(line, convention, commitUrl);
  },
  comma: function(line, convention, commitUrl) {
    if (!convention) { convention = { lang: this.lang }; }

    if (!convention.comma) {
      convention.comma = {
        title: "Last comma vs. First comma",
        column: [
          { key: "first",
            display: "First comma",
            code: "var foo = 1\n  , bar = 2\n  , baz = 3;\n\nvar obj = {\n    foo: 1\n  , bar: 2\n  , baz: 3\n};"
          }, {
            key: "last",
            display: "Last comma",
            code: "var foo = 1,\n    bar = 2,\n    baz = 3;\n\nvar obj = {\n    foo: 1,\n    bar: 2,\n    baz: 3\n};"
          }
        ],
        first: 0,
        last: 0,
        commits: []
      };
    }

    var first = /^\s*,.*/;
    var last = /.*,\s*$/;

    if (first.test(line)) { convention.comma.first = convention.comma.first + 1; }
    if (last.test(line)) { convention.comma.last = convention.comma.last + 1; }
    if (first.test(line) || last.test(line)) { convention.comma.commits.push(commitUrl); }

    convention.comma.commits = _.uniq(convention.comma.commits);
    return convention;
  },
  indent: function(line, convention, commitUrl) {
    if (!convention) { convention = { lang: this.lang }; }

    if (!convention.indent) {
      convention.indent = {
        title: "Space vs. Tab",
        column: [
          { key: "tab",
            display: "Tab",
            code: "function foo() {\n    // use tab for indentation\n    return \"bar\";\n}"
          }, {
            key: "space",
            display: "Space",
            code: "function foo() {\n  return \"bar\";\n}"
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
  functiondef: function(line, convention, commitUrl) {
    if (!convention) { convention = { lang: this.lang }; }

    if (!convention.functiondef) {
      convention.functiondef = {
        title: "Function followed by one space vs. Function followed by no space",
        column: [
          { key: "onespace",
            display: "One space",
            code: "function foo () {\n  return \"bar\";\n}"
          }, {
            key: "nospace",
            display: "No space",
            code: "function foo() {\n  return \"bar\";\n}"
          }
        ],
        onespace: 0,
        nospace: 0,
        commits: []
      };
    }

    var onespace = /function(\s+.)*\s+\(/;
    var nospace = /function(\s+.)*\(/;

    if (onespace.test(line)) { convention.functiondef.onespace = convention.functiondef.onespace + 1; }
    if (nospace.test(line)) { convention.functiondef.nospace = convention.functiondef.nospace + 1; }
    if (onespace.test(line) || nospace.test(line)) { convention.functiondef.commits.push(commitUrl); }

    convention.functiondef.commits = _.uniq(convention.functiondef.commits);
    return convention;
  },
  argumentdef: function(line, convention, commitUrl) {
    if (!convention) { convention = { lang: this.lang }; }

    if (!convention.argumentdef) {
      convention.argumentdef = {
        title: "Arguments definition with one space vs. no space",
        column: [
          { key: "onespace",
            display: "One space",
            code: "function fn( arg1, arg2 ) {\n  // ...\n}\n\nif ( true ) {\n  // ...\n}"
          }, {
            key: "nospace",
            display: "No space",
            code: "function fn(arg1, arg2) {\n//or\nif (true) {"
          }
        ],
        onespace: 0,
        nospace: 0,
        commits: []
      };
    }

    var onespace = /(function|if|while|switch)(\s+\w*)?\s*\(\s+/;
    var nospace = /(function|if|while|switch)(\s+\w*)?\s*\(\S+/;

    if (onespace.test(line)) { convention.argumentdef.onespace = convention.argumentdef.onespace + 1; }
    if (nospace.test(line)) { convention.argumentdef.nospace = convention.argumentdef.nospace + 1; }
    if (onespace.test(line) || nospace.test(line)) { convention.argumentdef.commits.push(commitUrl); }

    convention.argumentdef.commits = _.uniq(convention.argumentdef.commits);
    return convention;
  },
  literaldef: function(line, convention, commitUrl) {
    if (!convention) { convention = { lang: this.lang }; }

    if (!convention.literaldef) {
      convention.literaldef = {
        title: "Object Literal Definition types",
        column: [
          { key: "tracespace",
            display: "Followed by space",
            code: "{\n  foo: 1,\n  bar: 2,\n  baz: 3\n}"
          }, {
            key: "bothspace",
            display: "Using space in before/after",
            code: "{\n  foo : 1,\n  bar : 2,\n  baz : 3\n}"
          }, {
            key: "nospace",
            display: "No space",
            code: "{\n  foo:1,\n  bar:2,\n  baz:3\n}"
          }
        ],
        tracespace: 0,
        bothspace: 0,
        nospace: 0,
        commits: []
      };
    }

    var tracespace = /\w:\s+[\w"'\/]/;
    var bothspace = /\w\s+:\s+[\w"'\/]/;
    var nospace = /\w:[\w"'\/]/;

    if (tracespace.test(line)) { convention.literaldef.tracespace = convention.literaldef.tracespace + 1; }
    if (bothspace.test(line)) { convention.literaldef.bothspace = convention.literaldef.bothspace + 1; }
    if (nospace.test(line)) { convention.literaldef.nospace = convention.literaldef.nospace + 1; }
    if (tracespace.test(line) || bothspace.test(line) || nospace.test(line)) { convention.literaldef.commits.push(commitUrl); }

    convention.literaldef.commits = _.uniq(convention.literaldef.commits);
    return convention;
  },
  conditionstatement: function(line, convention, commitUrl) {
    if (!convention) { convention = { lang: this.lang }; }

    if (!convention.conditionstatement) {
      convention.conditionstatement = {
        title: "How to write conditional statement",
        column: [
          { key: "onespace",
            display: "Condition with one space",
            code: "if (true) {\n  //...\n}\n\nwhile (true) {\n  //...\n}\n\nswitch (v) {\n  //...\n}"
          }, {
            key: "nospace",
            display: "Condition with no space",
            code: "if(true) {\n  //...\n}\n\nwhile(true) {\n  //...\n}\n\nswitch(v) {\n  //...\n}"
          }
        ],
        onespace: 0,
        nospace: 0,
        commits: []
      };
    }

    var onespace = /(if|while|switch)\s+\(/;
    var nospace = /(if|while|switch)\(/;

    if (onespace.test(line)) { convention.conditionstatement.onespace = convention.conditionstatement.onespace + 1; }
    if (nospace.test(line)) { convention.conditionstatement.nospace = convention.conditionstatement.nospace + 1; }
    if (onespace.test(line) || nospace.test(line)) { convention.conditionstatement.commits.push(commitUrl); }

    convention.conditionstatement.commits = _.uniq(convention.conditionstatement.commits);
    return convention;
  },
  blockstatement: function(line, convention, commitUrl) {
    if (!convention) { convention = { lang: this.lang }; }

    if (!convention.blockstatement) {
      convention.blockstatement = {
        title: "How to write block statement",
        column: [
          { key: "onespace",
            display: "Curlybrace with one space",
            code: "if (true) {\n  // ...\n}\n\nwhile (true) {\n  // ...\n}\n\nswitch (v) {\n  // ...\n}"
          }, {
            key: "nospace",
            display: "Curlybrace with no space",
            code: "if (true){\n  // ...\n}\n\nwhile (true){\n  // ...\n}\n\nswitch (v){\n  // ...\n}"
          }, {
            key: "newline",
            display: "Curlybrace at new line",
            code: "if (true)\n{\n  // ...\n}\n\nwhile (true)\n{\n  // ...\n}\n\nswitch (v)\n{\n  // ...\n}"
          }
        ],
        onespace: 0,
        nospace: 0,
        newline: 0,
        commits: []
      };
    }

    var onespace = /((if|while|switch).*\)\s+\{)|(\}\s+else)/;
    var nospace = /((if|while|switch).*\)\{)|(\}else)/;
    var newline = /((if|while|switch).*\)\s*$)|((if|while|switch).*\)\s*\/[\/\*])|(^\s*else)/;

    if (onespace.test(line)) { convention.blockstatement.onespace = convention.blockstatement.onespace + 1; }
    if (nospace.test(line)) { convention.blockstatement.nospace = convention.blockstatement.nospace + 1; }
    if (newline.test(line)) { convention.blockstatement.newline = convention.blockstatement.newline + 1; }
    if (onespace.test(line) || nospace.test(line) || newline.test(line)) { convention.blockstatement.commits.push(commitUrl); }

    convention.blockstatement.commits = _.uniq(convention.blockstatement.commits);
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
  quotes: function(line, convention, commitUrl) {
    if (!convention) { convention = { lang: this.lang }; }

    if (!convention.quotes) {
      convention.quotes = {
        title: "Single quote vs double quotes",
        column: [
          { key: "singleQuote",
            display: "Single quote",
            code: "var foo = 'bar';\n\nvar obj = { 'foo': 'bar'};"
          }, {
            key: "doubleQuote",
            display: "Double quotes",
            code: "var foo = \"bar\";\n\nvar obj = { \"foo\": \"bar\"};"
          }
        ],
        single: 0,
        double: 0,
        commits: []
      };
    }

    var placeholder = "CONVENTION-PLACEHOLDER";

    var singleQuote = function(line) {
      var temp = line.replace(/'.*?'/g, placeholder);
      return (new RegExp("" + placeholder)).test(temp) &&
             !(new RegExp("\"[\\w\\s<>/=]*" + placeholder + "[\\w\\s<>/=]*\"")).test(temp) && (!/"/.test(temp));
    };

    var doubleQuote = function(line) {
      var temp = line.replace(/".*?"/g, placeholder);
      return (new RegExp("" + placeholder)).test(temp) &&
             !(new RegExp("'[\\w\\s<>/=]*" + placeholder + "[\\w\\s<>/=]*'")).test(temp) && (!/'/.test(temp));
    };

    if (singleQuote(line)) { convention.quotes.single = convention.quotes.single + 1; }
    if (doubleQuote(line)) { convention.quotes.double = convention.quotes.double + 1; }
    if (singleQuote(line) || doubleQuote(line)) { convention.quotes.commits.push(commitUrl); }

    convention.quotes.commits = _.uniq(convention.quotes.commits);
    return convention;
  }
};
