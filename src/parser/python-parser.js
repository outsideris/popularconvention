// parsing Python code
var _ = require('underscore');

module.exports = {
  lang: 'py',
  parse: function(line, convention, commitUrl) {
    convention = this.indent(line, convention, commitUrl);
    convention = this.linelength(line, convention, commitUrl);
    convention = this.imports(line, convention, commitUrl);
    return convention = this.whitespace(line, convention, commitUrl);
  },
  indent: function(line, convention, commitUrl) {
    if (!convention) {
      convention = { lang: this.lang };
    }
    if (!convention.indent) {
      convention.indent = {
        title: "Space vs. Tab",
        column: [
          {
            key: "tab",
            display: "Tab",
            code: "def long_function_name(var_one):\n        # use tab for indentation\n        print(var_one)"
          }, {
            key: "space",
            display: "Space",
            code: "def long_function_name(var_one):\n    print(var_one)"
          }
        ],
        tab: 0,
        space: 0,
        commits: []
      };
    }

    var tab = /^\t+.*/;
    var space = /^\s+.*/;

    if (tab.test(line)) {
      convention.indent.tab = convention.indent.tab + 1;
    }
    if (space.test(line)) {
      convention.indent.space = convention.indent.space + 1;
    }
    if (tab.test(line) || space.test(line)) {
      convention.indent.commits.push(commitUrl);
    }
    convention.indent.commits = _.uniq(convention.indent.commits);
    return convention;
  },
  linelength: function(line, convention, commitUrl) {
    if (!convention) {
      convention = { lang: this.lang };
    }
    if (!convention.linelength) {
      convention.linelength = {
        title: "Line length is over 80 characters?",
        column: [
          {
            key: "char80",
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

    if (width < 80) {
      convention.linelength.char80 = convention.linelength.char80 + 1;
    } else if (width < 120) {
      convention.linelength.char120 = convention.linelength.char120 + 1;
    } else {
      convention.linelength.char150 = convention.linelength.char150 + 1;
    }
    convention.linelength.commits.push(commitUrl);
    convention.linelength.commits = _.uniq(convention.linelength.commits);
    return convention;
  },
  imports: function(line, convention, commitUrl) {
    if (!convention) {
      convention = { lang: this.lang };
    }
    if (!convention.imports) {
      convention.imports = {
        title: "Imports on separate lines",
        column: [
          {
            key: "separated",
            display: "Imports on separate lines",
            code: "import os\nimport sys"
          }, {
            key: "noseparated",
            display: "Import on non-separate lines",
            code: "import sys, os"
          }
        ],
        separated: 0,
        noseparated: 0,
        commits: []
      };
    }

    var separated = /^\s*\t*import\s+[\w.]+([^,]\s*|\s*#.*)$/;
    var noseparated = /^\s*\t*import\s+\w+\s*,\s+\w+/;

    if (separated.test(line)) {
      convention.imports.separated = convention.imports.separated + 1;
    }
    if (noseparated.test(line)) {
      convention.imports.noseparated = convention.imports.noseparated + 1;
    }
    if (separated.test(line) || noseparated.test(line)) {
      convention.imports.commits.push(commitUrl);
    }
    convention.imports.commits = _.uniq(convention.imports.commits);
    return convention;
  },
  whitespace: function(line, convention, commitUrl) {
    if (!convention) {
      convention = { lang: this.lang };
    }
    if (!convention.whitespace) {
      convention.whitespace = {
        title: "Whitespace in Expressions and Statements",
        column: [
          {
            key: "noextra",
            display: "Avoiding extraneous whitespace",
            code: "spam(ham[1], {eggs: 2})\n\nif x == 4: print x, y; x, y = y, x\n\nspam(1)\n\ndict['key'] = list[index]\n\nx = 1\ny = 2\nlong_variable = 3"
          }, {
            key: "extra",
            display: "Using extraneous whitespace",
            code: "spam( ham[ 1 ], { eggs: 2 } )\n\nif x == 4 : print x , y ; x , y = y , x\n\nspam (1)\n\ndict ['key'] = list [index]\n\nx             = 1\ny             = 2\nlong_variable = 3"
          }
        ],
        noextra: 0,
        extra: 0,
        commits: []
      };
    }

    var noextra = /\S+[\(\)\[\],]\S+|\S+:\s|\S\s=\s/;
    var extra = /\(\s+|\s+[\(\)\[\]]|\s+[:,]\s+|\s{2,}=|=\s{2,}/;

    if (extra.test(line)) {
      convention.whitespace.extra = convention.whitespace.extra + 1;
      convention.whitespace.commits.push(commitUrl);
      convention.whitespace.commits = _.uniq(convention.whitespace.commits);
    } else if (noextra.test(line)) {
      convention.whitespace.noextra = convention.whitespace.noextra + 1;
      convention.whitespace.commits.push(commitUrl);
      convention.whitespace.commits = _.uniq(convention.whitespace.commits);
    }
    return convention;
  }
};
