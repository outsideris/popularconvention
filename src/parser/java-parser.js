'use strict';

// parsing Java code
var _ = require('underscore');

module.exports = {
  lang: 'java',
  parse: function(line, convention, commitUrl) {
    convention = this.indent(line, convention, commitUrl);
    convention = this.blockstatement(line, convention, commitUrl);
    convention = this.constant(line, convention, commitUrl);
    convention = this.conditionstatement(line, convention, commitUrl);
    convention = this.argumentdef(line, convention, commitUrl);
    convention = this.linelength(line, convention, commitUrl);
    convention = this.staticvar(line, convention, commitUrl);
    return convention = this.finalstaticorder(line, convention, commitUrl);
  },
  indent: function(line, convention, commitUrl) {
    if (!convention) { convention = { lang: this.lang }; }

    if (!convention.indent) {
      convention.indent = {
        title: "Space vs. Tab",
        column: [
          { key: "tab",
            display: "Tab",
            code: "public String getName() {\n    // use tab for indentation\n    return this.name;\n}"
          }, {
            key: "space",
            display: "Space",
            code: "public String getName() {\n  return this.name;\n}"
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
  blockstatement: function(line, convention, commitUrl) {
    if (!convention) { convention = { lang: this.lang }; }

    if (!convention.blockstatement) {
      convention.blockstatement = {
        title: "How to write block statement",
        column: [
          { key: "onespace",
            display: "Curlybrace with one space",
            code: "if (height < MIN_HEIGHT) {\n  //..\n}\n\nwhile (isTrue) {\n  //..\n}\n\nswitch (foo) {\n  //..\n}"
          }, {
            key: "nospace",
            display: "Curlybrace with no space",
            code: "if (height < MIN_HEIGHT){\n  //..\n}\n\nwhile (isTrue){\n  //..\n}\n\nswitch (foo){\n  //..\n}"
          }, {
            key: "newline",
            display: "Curlybrace at new line",
            code: "if (height < MIN_HEIGHT)\n{\n  //..\n}\n\nwhile (isTrue)\n{\n  //..\n}\n\nswitch (foo)\n{\n  //..\n}"
          }
        ],
        onespace: 0,
        nospace: 0,
        newline: 0,
        commits: []
      };
    }

    var onespace = /((if|while|switch|try).*\s+\{)|(\}\s+(else|catch|finally).*\s+\{)/;
    var nospace = /((if|while|switch).*\)\{)|(try|else|finally)\{|(\}\s*(else|catch|finally).*\)\{)/;
    var newline = /((if|while|switch).*\)\s*$)|((if|while|switch).*\)\s*\/[\/\*])|(try|else|finally)\s*\/[\/\*]|(^\s*(else|catch|finally))/;

    if (onespace.test(line)) { convention.blockstatement.onespace = convention.blockstatement.onespace + 1; }
    if (nospace.test(line)) { convention.blockstatement.nospace = convention.blockstatement.nospace + 1; }
    if (newline.test(line)) { convention.blockstatement.newline = convention.blockstatement.newline + 1; }
    if (onespace.test(line) || nospace.test(line) || newline.test(line)) { convention.blockstatement.commits.push(commitUrl); }

    convention.blockstatement.commits = _.uniq(convention.blockstatement.commits);
    return convention;
  },
  constant: function(line, convention, commitUrl) {
    if (!convention) { convention = { lang: this.lang }; }

    if (!convention.constant) {
      convention.constant = {
        title: "Constant name is all caps?",
        column: [
          { key: "allcaps",
            display: "Constant name is all caps with underscore(_)",
            code: "final static String FOO_BAR = \"baz\";\n\nstatic final String FOO_BAR = \"baz\";"
          }, {
            key: "notallcaps",
            display: "Constant name is not all caps",
            code: "final static String foobar = \"baz\";\n\nstatic final String foobar = \"baz\";"
          }
        ],
        allcaps: 0,
        notallcaps: 0,
        commits: []
      };
    }

    var allcaps = /^\s*\w*\s*(static\s+\w*\s*final\s|final\s+\w*\s*static\s)\w+\s[A-Z0-9_]+(\s|=|;)/;
    var notallcaps = /^\s*\w*\s*(static\s+\w*\s*final\s|final\s+\w*\s*static\s)\w+\s[a-zA-Z0-9_]+(\s|=|;)/;

    if (allcaps.test(line)) { convention.constant.allcaps = convention.constant.allcaps + 1; }
    if (!allcaps.test(line) && notallcaps.test(line)) { convention.constant.notallcaps = convention.constant.notallcaps + 1; }
    if (allcaps.test(line || (!allcaps.test(line) && notallcaps.test(line)))) { convention.constant.commits.push(commitUrl); }

    convention.constant.commits = _.uniq(convention.constant.commits);
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
  argumentdef: function(line, convention, commitUrl) {
    if (!convention) { convention = { lang: this.lang }; }

    if (!convention.argumentdef) {
      convention.argumentdef = {
        title: "Arguments definition with one space vs. no space",
        column: [
          { key: "onespace",
            display: "One space",
            code: "public void setName( String name ) {\n  // ...\n}\n\nif( isTrue ) {}\n\nwhile( isTrue ) {}"
          }, {
            key: "nospace",
            display: "No space",
            code: "public void setName(String name) {\n  // ...\n}\n\nif(isTrue) {}\n\nwhile(isTrue) {}"
          }
        ],
        onespace: 0,
        nospace: 0,
        commits: []
      };
    }

    var onespace = /^(\s*|\t*)(\w+\s+\w+\s+\w+|if|while|switch)\s*\(\s+/;
    var nospace = /^(\s*|\t*)(\w+\s+\w+\s+\w+|if|while|switch)\s*\(\S+/;

    if (onespace.test(line)) { convention.argumentdef.onespace = convention.argumentdef.onespace + 1; }
    if (nospace.test(line)) { convention.argumentdef.nospace = convention.argumentdef.nospace + 1; }
    if (onespace.test(line) || nospace.test(line)) { convention.argumentdef.commits.push(commitUrl); }

    convention.argumentdef.commits = _.uniq(convention.argumentdef.commits);
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
  staticvar: function(line, convention, commitUrl) {
    if (!convention) { convention = { lang: this.lang }; }

    if (!convention.staticvar) {
      convention.staticvar = {
        title: "Use special prefix for staticvar",
        column: [
          { key: "prefix",
            display: "Special prefix",
            code: "static String _name;"
          }, {
            key: "noprefix",
            display: "No special prefix",
            code: "static String name"
          }
        ],
        prefix: 0,
        noprefix: 0,
        commits: []
      };
    }

    var prefix = /static\s+\w+\s+(_|\$)\w+/;
    var noprefix = /static\s+\w+\s+[^_$]\w+/;

    if (prefix.test(line)) { convention.staticvar.prefix = convention.staticvar.prefix + 1; }
    if (noprefix.test(line)) { convention.staticvar.noprefix = convention.staticvar.noprefix + 1; }
    if (prefix.test(line) || noprefix.test(line)) { convention.staticvar.commits.push(commitUrl); }

    convention.staticvar.commits = _.uniq(convention.staticvar.commits);
    return convention;
  },
  finalstaticorder: function(line, convention, commitUrl) {
    if (!convention) { convention = { lang: this.lang }; }

    if (!convention.finalstaticorder) {
      convention.finalstaticorder = {
        title: "order for final and static",
        column: [
          {
            key: "accstfin",
            display: "access modifier - static - final|volatile",
            code: "public static final String t1 = \"\";\n\npublic static transient final String t2 = \"\";\n\ntransient public static final String t3 = \"\";"
          }, {
            key: "accfinst",
            display: "access modifier - final|volatile - static",
            code: "public final static String t1 = \"\";\n\npublic final static transient String t2 = \"\";\n\ntransient public final static String t3 = \"\";"
          }, {
            key: "finaccst",
            display: "final|volatile - access modifier - static",
            code: "final public static String t1 = \"\";\n\nfinal public static transient String t2 = \"\";\n\nfinal transient public static String t3 = \"\";"
          }, {
            key: "staccfin",
            display: "static - access modifier - final|volatile",
            code: "static public final String t1 = \"\";\n\nstatic public transient final String t2 = \"\";\n\nstatic transient public final String t3 = \"\";"
          }
        ],
        accstfin: 0,
        accfinst: 0,
        finaccst: 0,
        staccfin: 0,
        commits: []
      };
    }

    var accstfin = /^\w*\s*(public|private|protected){1}\s+\w*\s*(static){1}\s+\w*\s*(final|volatile){1}\s+\w+\s+[a-zA-Z0-9_]+(\s|=|;)/;
    var accfinst = /^\w*\s*(public|private|protected){1}\s+\w*\s*(final|volatile){1}\s+\w*\s*(static){1}\s+\w+\s+[a-zA-Z0-9_]+(\s|=|;)/;
    var finaccst = /^\w*\s*(final|volatile){1}\s+\w*\s*(public|private|protected){1}\s+\w*\s*(static){1}\s+\w+\s+[a-zA-Z0-9_]+(\s|=|;)/;
    var staccfin = /^\w*\s*(static){1}\s+\w*\s*(public|private|protected){1}\s+\w*\s*(final|volatile){1}\s+\w+\s+[a-zA-Z0-9_]+(\s|=|;)/;

    if (accstfin.test(line)) { convention.finalstaticorder.accstfin = convention.finalstaticorder.accstfin + 1; }
    if (accfinst.test(line)) { convention.finalstaticorder.accfinst = convention.finalstaticorder.accfinst + 1; }
    if (finaccst.test(line)) { convention.finalstaticorder.finaccst = convention.finalstaticorder.finaccst + 1; }
    if (staccfin.test(line)) { convention.finalstaticorder.staccfin = convention.finalstaticorder.staccfin + 1; }
    if (accstfin.test(line || accfinst.test(line || finaccst.test(line || staccfin.test(line))))) {
      convention.finalstaticorder.commits.push(commitUrl);
    }

    convention.finalstaticorder.commits = _.uniq(convention.finalstaticorder.commits);
    return convention;
  }
};
