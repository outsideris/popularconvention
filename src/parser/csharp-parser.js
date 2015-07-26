// parsing C# code
var _ = require('underscore');

module.exports = {
  lang: 'csharp',
  parse: function(line, convention, commitUrl) {
    convention = this.indent(line, convention, commitUrl);
    convention = this.blockstatement(line, convention, commitUrl);
    convention = this.constant(line, convention, commitUrl);
    convention = this.conditionstatement(line, convention, commitUrl);
    convention = this.argumentdef(line, convention, commitUrl);
    return convention = this.linelength(line, convention, commitUrl);
  },
  indent: function(line, convention, commitUrl) {
    if (!convention) {
      convention = {lang: this.lang};
    }
    if (!convention.indent) {
      convention.indent = {
        title: 'Space vs. Tab',
        column: [
          {
            key: 'tab',  display: 'Tab',
            code: 'public string GetSomething()\n' +
                  '{\n' +
                  '    // use tab for indentation\n' +
                  '    return something;\n' +
                  '}'
          },
          {
            key: 'space', display: 'Space',
            code: 'public string GetSomething()\n' +
                  '{\n' +
                  '  return something;\n' +
                  '}'
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
  blockstatement: function(line, convention, commitUrl) {
    if (!convention) {
      convention = {lang: this.lang};
    }
    if (!convention.blockstatement) {
      convention.blockstatement = {
        title: 'How to write block statements',
        column: [
          {
            key: 'onespace', display: 'Curlybrace with one space',
            code: 'if (height < MIN_HEIGHT) {\n' +
                  '  //..\n' +
                  '}\n' +
                  '\n' +
                  'while (isTrue) {\n' +
                  '  //..\n' +
                  '}\n' +
                  '\n' +
                  'switch (foo) {\n' +
                  '  //..\n' +
                  '}'
          },
          {
            key: 'nospace', display: 'Curlybrace with no space',
            code: 'if (height < MIN_HEIGHT){\n' +
                  '  //..\n' +
                  '}\n' +
                  '\n' +
                  'while (isTrue){\n' +
                  '  //..\n' +
                  '}\n' +
                  '\n' +
                  'switch (foo){\n' +
                  '  //..\n' +
                  '}'
          },
          {
            key: 'newline', display: 'Curlybrace at new line',
            code: 'if (height < MIN_HEIGHT)\n' +
                  '{\n' +
                  '  //..\n' +
                  '}\n' +
                  '\n' +
                  'while (isTrue)\n' +
                  '{\n' +
                  '  //..\n' +
                  '}\n' +
                  '\n' +
                  'switch (foo)\n' +
                  '{\n' +
                  '  //..\n' +
                  '}'
          }
        ],
        onespace: 0,
        nospace: 0,
        newline: 0,
        commits: []
      };
    }
    var onespace = /((if|while|switch|try).*\s+\{)|(}\s+(else|catch|finally).*\s+\{)/;
    var nospace = /((if|while|switch).*\){)|(try|else|finally){|(}\s*(else|catch|finally).*\){)/;
    var newline = /((if|while|switch).*\)\s*$)|((if|while|switch).*\)\s*\/[\/\*])|(try|else|finally)\s*\/[\/\*]|(^\s*(else|catch|finally))/;

    if (onespace.test(line)) {
      convention.blockstatement.onespace = convention.blockstatement.onespace + 1;
    }
    if (nospace.test(line)) {
      convention.blockstatement.nospace = convention.blockstatement.nospace + 1;
    }
    if (newline.test(line)) {
      convention.blockstatement.newline = convention.blockstatement.newline + 1;
    }

    if (onespace.test(line) || nospace.test(line) || newline.test(line)) {
      convention.blockstatement.commits.push(commitUrl);
    }
    convention.blockstatement.commits = _.uniq(convention.blockstatement.commits);
    return convention;
  },
  constant: function(line, convention, commitUrl) {
    if (!convention) {
      convention = { lang: this.lang };
    }
    if (!convention.constant) {
      convention.constant = {
        title: 'Constant name',
        column: [
          {
            key: 'pascal',
            display: 'Constant is Pascal cased',
            code: 'const string FooBar = "baz";'
          }, {
            key: 'allcaps',
            display: 'Constant name is all caps with underscore(_)',
            code: 'const string FOO_BAR = "baz";'
          }, {
            key: 'notallcaps',
            display: 'Constant name is neither all caps and pascal cased',
            code: 'const string foo_bar = "baz";\n\nconst string fooBar = "baz";'
          }
        ],
        pascal: 0,
        allcaps: 0,
        notallcaps: 0,
        commits: []
      };
    }
    var pascal = /const\s+\w+\s+([A-Z][a-z0-9]+)+\s*=/;
    var allcaps = /const\s+\w+\s+([A-Z0-9_]+)+\s*=/;
    var notallcaps = /const\s+\w+\s+([a-z][A-Za-z0-9_]*)+\s*=/;
    if (pascal.test(line)) {
      convention.constant.pascal = convention.constant.pascal + 1;
    }
    if (allcaps.test(line)) {
      convention.constant.allcaps = convention.constant.allcaps + 1;
    }
    if (notallcaps.test(line)) {
      convention.constant.notallcaps = convention.constant.notallcaps + 1;
    }
    if (pascal.test(line) || allcaps.test(line) || notallcaps.test(line)) {
      convention.constant.commits.push(commitUrl);
    }
    convention.constant.commits = _.uniq(convention.constant.commits);
    return convention;
  },
  conditionstatement: function(line, convention, commitUrl) {
    if (!convention) {
      convention = { lang: this.lang };
    }
    if (!convention.conditionstatement) {
      convention.conditionstatement = {
        title: 'How to write conditional statement',
        column: [
          {
            key: 'onespace',
            display: 'Condition with one space',
            code: 'if (true) {\n  //...\n}\n\nwhile (true) {\n  //...\n}\n\nswitch (v) {\n  //...\n}'
          }, {
            key: 'nospace',
            display: 'Condition with no space',
            code: 'if(true) {\n  //...\n}\n\nwhile(true) {\n  //...\n}\n\nswitch(v) {\n  //...\n}'
          }
        ],
        onespace: 0,
        nospace: 0,
        commits: []
      };
    }

    var onespace = /(if|while|switch)\s+\(/;
    var nospace = /(if|while|switch)\(/;

    if (onespace.test(line)) {
      convention.conditionstatement.onespace = convention.conditionstatement.onespace + 1;
    }
    if (nospace.test(line)) {
      convention.conditionstatement.nospace = convention.conditionstatement.nospace + 1;
    }
    if (onespace.test(line) || nospace.test(line)) {
      convention.conditionstatement.commits.push(commitUrl);
    }
    convention.conditionstatement.commits = _.uniq(convention.conditionstatement.commits);
    return convention;
  },
  argumentdef: function(line, convention, commitUrl) {
    if (!convention) {
      convention = { lang: this.lang };
    }
    if (!convention.argumentdef) {
      convention.argumentdef = {
        title: 'Arguments definition with one space vs. no space',
        column: [
          {
            key: 'onespace',
            display: 'One space',
            code: 'public void SetName( String name ) {\n  // ...\n}\n\nif( isTrue ) {}\n\nwhile( isTrue ) {}'
          }, {
            key: 'nospace',
            display: 'No space',
            code: 'public void SetName(String name) {\n  // ...\n}\n\nif(isTrue) {}\n\nwhile(isTrue) {}'
          }
        ],
        onespace: 0,
        nospace: 0,
        commits: []
      };
    }
    var onespace = /^(\s*|\t*)(\w+\s+\w+\s+\w+|if|while|switch)\s*\(\s+/;
    var nospace = /^(\s*|\t*)(\w+\s+\w+\s+\w+|if|while|switch)\s*\(\S+/;
    if (onespace.test(line)) {
      convention.argumentdef.onespace = convention.argumentdef.onespace + 1;
    }
    if (nospace.test(line)) {
      convention.argumentdef.nospace = convention.argumentdef.nospace + 1;
    }
    if (onespace.test(line) || nospace.test(line)) {
      convention.argumentdef.commits.push(commitUrl);
    }
    convention.argumentdef.commits = _.uniq(convention.argumentdef.commits);
    return convention;
  },
  linelength: function(line, convention, commitUrl) {
    if (!convention) {
      convention = { lang: this.lang };
    }
    if (!convention.linelength) {
      convention.linelength = {
        title: 'Line length is over 80 characters?',
        column: [
          {
            key: 'char80',
            display: 'Line length is within 80 characters.',
            code: '/* width is within 80 characters */'
          }, {
            key: 'char120',
            display: 'Line length is within 120 characters',
            code: '/* width is within 120 characters */'
          }, {
            key: 'char150',
            display: 'Line length is within 150 characters',
            code: '/* width is within 150 characters */'
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
  }
};
