// parsing PHP code
var _ = require('underscore');

module.exports = {
  lang: 'php',
  parse: function(line, convention, commitUrl) {
    convention = this.indent(line, convention, commitUrl);
    convention = this.classBrace(line, convention, commitUrl);
    convention = this.controlBrace(line, convention, commitUrl);
    convention = this.methodBrace(line, convention, commitUrl);
    convention = this.spaceAroundControl(line, convention, commitUrl);
    convention = this.spaceInsideControl(line, convention, commitUrl);
    convention = this.spaceAroundMethod(line, convention, commitUrl);
    convention = this.spaceInsideMethod(line, convention, commitUrl);
    convention = this.className(line, convention, commitUrl);
    convention = this.constName(line, convention, commitUrl);
    convention = this.functionName(line, convention, commitUrl);
    convention = this.methodDeclare(line, convention, commitUrl);
    return convention = this.linelength(line, convention, commitUrl);
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
            code: "class Foo {\n    function bar($baz) {\n        // uses one tab for indentation\n    }\n}"
          }, {
            key: "space",
            display: "Space",
            code: "class Foo {\n  function bar($baz) {\n    // uses spaces for indentation\n  }\n}"
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
  classBrace: function(line, convention, commitUrl) {
    if (!convention) {
      convention = { lang: this.lang };
    }
    if (!convention.classBrace) {
      convention.classBrace = {
        title: "Brace Placement (Class)",
        column: [
          {
            key: "newline",
            display: "Class opening/closing braces on seperate line (Allman)",
            code: "class Foo\n{\n  // ...\n}"
          }, {
            key: "sameline",
            display: "Class structure opening/closing braces on same line as declaration (OTBS)",
            code: "class Foo {\n  // ...\n}"
          }
        ],
        newline: 0,
        sameline: 0,
        commits: []
      };
    }

    var newline = function(line) {
      var temp;
      temp = line.replace(/\/\/.*/g, '');
      return (/^(\s|\\t)*class\s+\w+\s*(extends\s*\w+)?\s*$/).test(temp);
    };
    var sameline = function(line) {
      var temp;
      temp = line.replace(/\/\/.*/g, '');
      return (/^(\s|\\t)*class\s+\w+\s*(extends\s*\w+)?\s+\{/).test(temp);
    };

    if (newline(line)) {
      convention.classBrace.newline = convention.classBrace.newline + 1;
    }
    if (sameline(line)) {
      convention.classBrace.sameline = convention.classBrace.sameline + 1;
    }
    if (newline(line) || sameline(line)) {
      convention.classBrace.commits.push(commitUrl);
    }
    convention.classBrace.commits = _.uniq(convention.classBrace.commits);
    return convention;
  },
  controlBrace: function(line, convention, commitUrl) {
    if (!convention) {
      convention = { lang: this.lang };
    }
    if (!convention.controlBrace) {
      convention.controlBrace = {
        title: "Brace Placement (Control Structures)",
        column: [
          {
            key: "sameline",
            display: "Control structure opening/closing braces on same line as declaration",
            code: "if($baz) {\n  // ..\n} elseif($bar) {\n  // ..\n} else {\n  // ..\n}\n\nwhile ($i <= 10) {\n  // ..\n}\n\nswitch($beer) {\n  // ..\n}"
          }, {
            key: "newline",
            display: "Control structure opening/closing braces on seperate line from declaration",
            code: "if($baz)\n{\n  // ..\n}\nelseif($bar)\n{\n  // ..\n}\nelse\n{\n  // ..\n}\n\nwhile ($i <= 10)\n{\n  // ..\n}\n\nswitch($beer)\n{\n  // ..\n}"
          }
        ],
        sameline: 0,
        newline: 0,
        commits: []
      };
    }

    var sameline = function(line) {
      var temp;
      temp = line.replace(/\/\/.*/g, '');
      return (/((if|while|switch).*\{)|(}\s*(else|elseif).*\{)/).test(temp);
    };
    var newline = function(line) {
      var temp;
      temp = line.replace(/\/\/.*/g, '');
      return (/^\s*(((if|while|switch).*)|(\s*(else|elseif).*))[^{|:]$/).test(temp);
    };

    if (sameline(line)) {
      convention.controlBrace.sameline = convention.controlBrace.sameline + 1;
    }
    if (newline(line)) {
      convention.controlBrace.newline = convention.controlBrace.newline + 1;
    }
    if (newline(line) || sameline(line)) {
      convention.controlBrace.commits.push(commitUrl);
    }
    convention.controlBrace.commits = _.uniq(convention.controlBrace.commits);
    return convention;
  },
  methodBrace: function(line, convention, commitUrl) {
    if (!convention) {
      convention = { lang: this.lang };
    }
    if (!convention.methodBrace) {
      convention.methodBrace = {
        title: "Brace Placement (Methods)",
        column: [
          {
            key: "sameline",
            display: "Method structure opening braces on same line as declaration (OTBS)",
            code: "function bar($baz) {\n  // ...\n}"
          }, {
            key: "newline",
            display: "Method opening/closing braces on seperate line (Allman)",
            code: "function bar($baz)\n{\n  // ...\n}"
          }
        ],
        sameline: 0,
        newline: 0,
        commits: []
      };
    }

    var sameline = function(line) {
      var temp;
      temp = line.replace(/\/\/.*/g, '');
      return (/^[\s|\t]*function\s+\w+\(.*?\)\s*\{/).test(temp);
    };
    var newline = function(line) {
      var temp;
      temp = line.replace(/\/\/.*/g, '');
      return (/^[\s|\t]*function\s+\w+\(.*?\)\s*$/).test(temp);
    };

    if (sameline(line)) {
      convention.methodBrace.sameline = convention.methodBrace.sameline + 1;
    }
    if (newline(line)) {
      convention.methodBrace.newline = convention.methodBrace.newline + 1;
    }
    if (newline(line) || sameline(line)) {
      convention.methodBrace.commits.push(commitUrl);
    }
    convention.methodBrace.commits = _.uniq(convention.methodBrace.commits);
    return convention;
  },
  spaceAroundControl: function(line, convention, commitUrl) {
    if (!convention) {
      convention = { lang: this.lang };
    }
    if (!convention.spaceAroundControl) {
      convention.spaceAroundControl = {
        title: "Space Around Control Structure Evaluation Block",
        column: [
          {
            key: "space",
            display: "Space around control structure Evaluation block",
            code: "if ($baz) {\n  // ...\n} elseif ($bar) {\n  // ...\n} else {\n  // ...\n}\n\nwhile ($i <= 10) {\n  // ...\n}\n\nswitch ($beer) {\n  // ...\n}"
          }, {
            key: "nospace",
            display: "No space around control structure Evaluation block",
            code: "if($baz){\n  // ...\n}elseif($bar){\n  // ...\n}else{\n  // ...\n}\n\nwhile($i <= 10){\n  // ...\n}\n\nswitch($beer){\n  // ...\n}"
          }
        ],
        space: 0,
        nospace: 0,
        commits: []
      };
    }

    var space = /((if|elseif|while|for)\s+\(.*?\)\s+({|:))|(do\s+\{)/;
    var nospace = /((if|elseif|while|for)\(.*?\)({|:))|(do{)/;

    if (space.test(line)) {
      convention.spaceAroundControl.space = convention.spaceAroundControl.space + 1;
    }
    if (nospace.test(line)) {
      convention.spaceAroundControl.nospace = convention.spaceAroundControl.nospace + 1;
    }
    if (nospace.test(line) || space.test(line)) {
      convention.spaceAroundControl.commits.push(commitUrl);
    }
    convention.spaceAroundControl.commits = _.uniq(convention.spaceAroundControl.commits);
    return convention;
  },
  spaceInsideControl: function(line, convention, commitUrl) {
    if (!convention) {
      convention = { lang: this.lang };
    }
    if (!convention.spaceInsideControl) {
      convention.spaceInsideControl = {
        title: "Space Inside Control Structure Evaluation Block",
        column: [
          {
            key: "space",
            display: "Space inside control structure Evaluation block",
            code: "if ( $baz ) {\n  // ...\n} elseif ( $bar ) {\n  // ...\n}\n\nwhile ( $i <= 10 ) {\n  // ...\n}\n\nswitch ( $beer ) {\n  // ...\n}"
          }, {
            key: "nospace",
            display: "No space inside control structure Evaluation block",
            code: "if ($baz) {\n  // ...\n} elseif ($bar) {\n  // ...\n}\n\nwhile ($i <= 10) {\n  // ...\n}\n\nswitch ($beer) {\n  // ...\n}"
          }
        ],
        space: 0,
        nospace: 0,
        commits: []
      };
    }

    var space = /(if|elseif|while|for)\s*\(\s+.+?\s+\)/;
    var nospace = /(if|elseif|while|for)\s*\(\S+.*?\S\)/;

    if (space.test(line)) {
      convention.spaceInsideControl.space = convention.spaceInsideControl.space + 1;
    }
    if (nospace.test(line)) {
      convention.spaceInsideControl.nospace = convention.spaceInsideControl.nospace + 1;
    }
    if (nospace.test(line) || space.test(line)) {
      convention.spaceInsideControl.commits.push(commitUrl);
    }
    convention.spaceInsideControl.commits = _.uniq(convention.spaceInsideControl.commits);
    return convention;
  },
  spaceAroundMethod: function(line, convention, commitUrl) {
    if (!convention) {
      convention = { lang: this.lang };
    }
    if (!convention.spaceAroundMethod) {
      convention.spaceAroundMethod = {
        title: "Space Around Method Declaration Param Block",
        column: [
          {
            key: "space",
            display: "Space around parameter declaration block",
            code: "function bar ($baz) {\n  // ...\n}"
          }, {
            key: "nospace",
            display: "No space around parameter declaration block",
            code: "function bar($baz){\n  // ...\n}"
          }
        ],
        space: 0,
        nospace: 0,
        commits: []
      };
    }

    var space = /^[\s\t]*function\s+\w+\s+\(.*?\)\s+\{/;
    var nospace = /^[\s\t]*function\s+\w+\(.*?\){/;

    if (space.test(line)) {
      convention.spaceAroundMethod.space = convention.spaceAroundMethod.space + 1;
    }
    if (nospace.test(line)) {
      convention.spaceAroundMethod.nospace = convention.spaceAroundMethod.nospace + 1;
    }
    if (nospace.test(line) || space.test(line)) {
      convention.spaceAroundMethod.commits.push(commitUrl);
    }
    convention.spaceAroundMethod.commits = _.uniq(convention.spaceAroundMethod.commits);
    return convention;
  },
  spaceInsideMethod: function(line, convention, commitUrl) {
    if (!convention) {
      convention = { lang: this.lang };
    }
    if (!convention.spaceInsideMethod) {
      convention.spaceInsideMethod = {
        title: "Space Inside Method Declaration Param Block",
        column: [
          {
            key: "space",
            display: "Space inside parameter declaration block",
            code: "function bar( $baz ){\n  // ...\n}"
          }, {
            key: "nospace",
            display: "No space inside parameter declaration block",
            code: "function bar($baz){\n  // ...\n}"
          }
        ],
        space: 0,
        nospace: 0,
        commits: []
      };
    }

    var space = /^[\s|\t]*function\s+\w+\s*\(\s+.+?\s+\)/;
    var nospace = /^[\s|\t]*function\s+\w+\s*\(\S+.*?\S\)/;

    if (space.test(line)) {
      convention.spaceInsideMethod.space = convention.spaceInsideMethod.space + 1;
    }
    if (nospace.test(line)) {
      convention.spaceInsideMethod.nospace = convention.spaceInsideMethod.nospace + 1;
    }
    if (nospace.test(line) || space.test(line)) {
      convention.spaceInsideMethod.commits.push(commitUrl);
    }
    convention.spaceInsideMethod.commits = _.uniq(convention.spaceInsideMethod.commits);
    return convention;
  },
  className: function(line, convention, commitUrl) {
    if (!convention) {
      convention = { lang: this.lang };
    }
    if (!convention.className) {
      convention.className = {
        title: "Class Names",
        column: [
          {
            key: "camel",
            display: "Class Name in camelCase",
            code: "class fooBarBaz {\n  // ...\n}"
          }, {
            key: "pascal",
            display: "Class Name in PascalCase",
            code: "class FooBarBaz {\n  // ...\n}"
          }, {
            key: "capssnake",
            display: "Class Name in CAPS_SNAKE_CASE",
            code: "class FOO_BAR_BAZ {\n  // ...\n}"
          }, {
            key: "snakepascal",
            display: "Class Name in Snake_Pascal_Case",
            code: "class Foo_Bar_Baz {\n  // ...\n}"
          }, {
            key: "snake",
            display: "Class Name in snake_case",
            code: "class foo_bar_baz {\n  // ...\n}"
          }, {
            key: "uppersnake",
            display: "Class Snake_first_letter_uppercase",
            code: "class Foo_bar_baz {\n  // ...\n}"
          }
        ],
        camel: 0,
        pascal: 0,
        capssnake: 0,
        snakepascal: 0,
        snake: 0,
        uppersnake: 0,
        commits: []
      };
    }

    var camel = /^[\s|\t]*class\s+[a-z][a-z0-9]*([A-Z][a-z0-9]+)+(\b|\s|{)/;
    var pascal = /^[\s|\t]*class\s+([A-Z][a-z0-9]+){2,}(\b|\s|{)/;
    var capssnake = /^[\s|\t]*class\s+([A-Z0-9]+_)+[A-Z0-9]+(\b|\s|{)/;
    var snakepascal = /^[\s|\t]*class\s+(([A-Z][a-z0-9]+)_)+[A-Z][a-z0-9]+(\b|\s|{)/;
    var snake = /^[\s|\t]*class\s+(([a-z][a-z0-9]+)_)+[a-z][a-z0-9]+(\b|\s|{)/;
    var uppersnake = /^[\s|\t]*class\s+(([A-Z][a-z0-9]+)_)([a-z][a-z0-9]+_)+[a-z][a-z0-9]+(\b|\s|{)/;

    if (camel.test(line)) {
      convention.className.camel = convention.className.camel + 1;
    }
    if (pascal.test(line)) {
      convention.className.pascal = convention.className.pascal + 1;
    }
    if (capssnake.test(line)) {
      convention.className.capssnake = convention.className.capssnake + 1;
    }
    if (snakepascal.test(line)) {
      convention.className.snakepascal = convention.className.snakepascal + 1;
    }
    if (snake.test(line)) {
      convention.className.snake = convention.className.snake + 1;
    }
    if (uppersnake.test(line)) {
      convention.className.uppersnake = convention.className.uppersnake + 1;
    }
    if (camel.test(line) || pascal.test(line) || capssnake.test(line) || snakepascal.test(line) || snake.test(line) || uppersnake.test(line)) {
      convention.className.commits.push(commitUrl);
    }
    convention.className.commits = _.uniq(convention.className.commits);
    return convention;
  },
  constName: function(line, convention, commitUrl) {
    if (!convention) {
      convention = { lang: this.lang };
    }
    if (!convention.constName) {
      convention.constName = {
        title: "Constant Names",
        column: [
          {
            key: "camel",
            display: "Constant Name in camelCase",
            code: "const barBaz = 0;\n\ndefine('barBaz', 0);"
          }, {
            key: "pascal",
            display: "Constant Name in PascalCase",
            code: "const BarBaz = 0;\n\ndefine('BarBaz', 0);"
          }, {
            key: "capssnake",
            display: "Constant Name in CAPS_SNAKE_CASE",
            code: "const BAR_BAZ = 0;\n\ndefine('BAR_BAZ', 0);"
          }, {
            key: "snakepascal",
            display: "Constant Name in Snake_Pascal_Case",
            code: "const Bar_Baz = 0;\n\ndefine('Bar_Baz', 0);"
          }, {
            key: "snake",
            display: "Constant Name in snake_case",
            code: "const bar_baz = 0;\n\ndefine('bar_baz', 0);"
          }
        ],
        camel: 0,
        pascal: 0,
        capssnake: 0,
        snakepascal: 0,
        snake: 0,
        commits: []
      };
    }

    var camel = /(^[\s|\t]*const\s+[a-z][a-z0-9]*([A-Z][a-z0-9]+)+\s*=)|([\s|\t]*define\(s*['"][a-z][a-z0-9]*([A-Z][a-z0-9]+)+['"]s*,)/;
    var pascal = /(^[\s|\t]*const\s+([A-Z][a-z0-9]+){2,}\s*=)|([\s|\t]*define\(s*['"]([A-Z][a-z0-9]+){2,}['"]s*,)/;
    var capssnake = /(^[\s|\t]*const\s+([A-Z0-9]+_)+[A-Z0-9]+\s*=)|([\s|\t]*define\(s*['"]([A-Z0-9]+_)+[A-Z0-9]+['"]s*,)/;
    var snakepascal = /(^[\s|\t]*const\s+(([A-Z][a-z0-9]+)_)+[A-Z][a-z0-9]+\s*=)|([\s|\t]*define\(s*['"](([A-Z][a-z0-9]+)_)+[A-Z][a-z0-9]+['"]s*,)/;
    var snake = /(^[\s|\t]*const\s+(([a-z][a-z0-9]+)_)+[a-z][a-z0-9]+\s*=)|([\s|\t]*define\(s*['"](([a-z][a-z0-9]+)_)+[a-z][a-z0-9]+['"]s*,)/;

    if (camel.test(line)) {
      convention.constName.camel = convention.constName.camel + 1;
    }
    if (pascal.test(line)) {
      convention.constName.pascal = convention.constName.pascal + 1;
    }
    if (capssnake.test(line)) {
      convention.constName.capssnake = convention.constName.capssnake + 1;
    }
    if (snakepascal.test(line)) {
      convention.constName.snakepascal = convention.constName.snakepascal + 1;
    }
    if (snake.test(line)) {
      convention.constName.snake = convention.constName.snake + 1;
    }
    if (camel.test(line) || pascal.test(line) || capssnake.test(line) || snakepascal.test(line) || snake.test(line)) {
      convention.constName.commits.push(commitUrl);
    }
    convention.constName.commits = _.uniq(convention.constName.commits);
    return convention;
  },
  functionName: function(line, convention, commitUrl) {
    if (!convention) {
      convention = { lang: this.lang };
    }
    if (!convention.functionName) {
      convention.functionName = {
        title: "Function Names",
        column: [
          {
            key: "camel",
            display: "Function Name in camelCase",
            code: "function barBaz(){\n  // ...\n}"
          }, {
            key: "pascal",
            display: "Function Name in PascalCase",
            code: "function BarBaz(){\n  // ...\n}"
          }, {
            key: "capssnake",
            display: "Function Name in CAPS_SNAKE_CASE",
            code: "function BAR_BAZ(){\n  // ...\n}"
          }, {
            key: "snakepascal",
            display: "Function Name in Snake_Pascal_Case",
            code: "function Bar_Baz(){\n  // ...\n}"
          }, {
            key: "snake",
            display: "Function Name in snake_case",
            code: "function bar_baz(){\n  // ...\n}"
          }
        ],
        camel: 0,
        pascal: 0,
        capssnake: 0,
        snakepascal: 0,
        snake: 0,
        commits: []
      };
    }

    var camel = /function\s+[a-z][a-z0-9]*([A-Z][a-z0-9]+)+\s*\(/;
    var pascal = /function\s+([A-Z][a-z0-9]+){2,}\s*\(/;
    var capssnake = /function\s+([A-Z0-9]+_)+[A-Z0-9]+\s*\(/;
    var snakepascal = /function\s+(([A-Z][a-z0-9]+)_)+[A-Z][a-z0-9]+\s*\(/;
    var snake = /function\s+(([a-z][a-z0-9]+)_)+[a-z][a-z0-9]+\s*\(/;

    if (camel.test(line)) {
      convention.functionName.camel = convention.functionName.camel + 1;
    }
    if (pascal.test(line)) {
      convention.functionName.pascal = convention.functionName.pascal + 1;
    }
    if (capssnake.test(line)) {
      convention.functionName.capssnake = convention.functionName.capssnake + 1;
    }
    if (snakepascal.test(line)) {
      convention.functionName.snakepascal = convention.functionName.snakepascal + 1;
    }
    if (snake.test(line)) {
      convention.functionName.snake = convention.functionName.snake + 1;
    }
    if (camel.test(line) || pascal.test(line) || capssnake.test(line) || snakepascal.test(line) || snake.test(line)) {
      convention.functionName.commits.push(commitUrl);
    }
    convention.functionName.commits = _.uniq(convention.functionName.commits);
    return convention;
  },
  methodDeclare: function(line, convention, commitUrl) {
    if (!convention) {
      convention = { lang: this.lang };
    }
    if (!convention.methodDeclare) {
      convention.methodDeclare = {
        title: "Method Declare Order",
        column: [
          {
            key: "staticlate",
            display: "static declared after visibility",
            code: "class Foo\n{\n  public static function bar($baz)\n  {\n    // ...\n  }\n}"
          }, {
            key: "staticfirst",
            display: "static declared before visibility",
            code: "class Foo\n{\n  static public function bar($baz)\n  {\n    // ...\n  }\n}"
          }, {
            key: "abstractlate",
            display: "abstract (or final) declared after visibility",
            code: "class Foo\n{\n  public abstract function bar($baz);\n  // ...\n}"
          }, {
            key: "abstractfirst",
            display: "abstract (or final) declared before visibility",
            code: "class Foo\n{\n  abstract public function bar($baz);\n  // ...\n}"
          }
        ],
        staticlate: 0,
        staticfirst: 0,
        abstractlate: 0,
        abstractfirst: 0,
        commits: []
      };
    }

    var staticlate = /(public|protected|private)\s+static\s+\$*\w*/;
    var staticfirst = /static\s+(public|protected|private)\s+\$*\w*/;
    var abstractlate = /(public|protected|private)\s+(abstract|final)\s+\$*\w*/;
    var abstractfirst = /(abstract|final)\s+(public|protected|private)\s+\$*\w*/;

    if (staticlate.test(line)) {
      convention.methodDeclare.staticlate = convention.methodDeclare.staticlate + 1;
    }
    if (staticfirst.test(line)) {
      convention.methodDeclare.staticfirst = convention.methodDeclare.staticfirst + 1;
    }
    if (abstractlate.test(line)) {
      convention.methodDeclare.abstractlate = convention.methodDeclare.abstractlate + 1;
    }
    if (abstractfirst.test(line)) {
      convention.methodDeclare.abstractfirst = convention.methodDeclare.abstractfirst + 1;
    }
    if (staticlate.test(line) || staticfirst.test(line) || abstractlate.test(line) || abstractfirst.test(line)) {
      convention.methodDeclare.commits.push(commitUrl);
    }
    convention.methodDeclare.commits = _.uniq(convention.methodDeclare.commits);
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
