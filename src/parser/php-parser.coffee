# parsing PHP code
#
# Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
# Licensed under the MIT license.
# <http://outsider.mit-license.org/>

helpers = require '../helpers'
_ = require 'underscore'

phpParser = module.exports =
  lang: 'php'

  parse: (line, convention, commitUrl) ->
    convention = this.indent line, convention, commitUrl
    convention = this.classBrace line, convention, commitUrl
    convention = this.controlBrace line, convention, commitUrl
    convention = this.methodBrace line, convention, commitUrl
    convention = this.spaceAroundControl line, convention, commitUrl
    convention = this.spaceInsideControl line, convention, commitUrl
    convention = this.spaceAroundMethod line, convention, commitUrl
    convention = this.spaceInsideMethod line, convention, commitUrl
    convention = this.className line, convention, commitUrl
    convention = this.constName line, convention, commitUrl
    convention = this.functionName line, convention, commitUrl
    convention = this.methodDeclare line, convention, commitUrl
    convention = this.linelength line, convention, commitUrl

  indent: (line, convention, commitUrl) ->
    convention = {lang: this.lang} unless convention
    (convention.indent =
      title: "Space vs. Tab"
      column: [
        {
          key: "tab", display: "Tab",
          code: """
                class Foo {
                    function bar($baz) {
                        // uses one tab for indentation
                    }
                }
                """
        }
        {
          key: "space", display: "Space",
          code: """
                class Foo {
                  function bar($baz) {
                    // uses spaces for indentation
                  }
                }
                """
        }
      ]
      tab: 0
      space: 0
      commits: []
    ) unless convention.indent

    tab = /^\t+.*/
    space = /^\s+.*/

    convention.indent.tab = convention.indent.tab + 1 if tab.test line
    convention.indent.space = convention.indent.space + 1 if space.test line

    convention.indent.commits.push commitUrl if tab.test(line) or space.test(line)
    convention.indent.commits = _.uniq convention.indent.commits
    convention

  classBrace: (line, convention, commitUrl) ->
    convention = {lang: this.lang} unless convention
    (convention.classBrace =
      title: "Brace Placement (Class)"
      column: [
        {
          key: "newline", display: "Class opening/closing braces on seperate line (Allman)",
          code: """
                class Foo
                {
                  // ...
                }
                """
        }
        {
          key: "sameline", display: "Class structure opening/closing braces on same line as declaration (OTBS)",
          code: """
                class Foo {
                  // ...
                }
                """
        }
      ]
      newline: 0
      sameline: 0
      commits: []
    ) unless convention.classBrace

    newline = (line) ->
      temp = line.replace /\/\/.*/g, ''
      ///^(\s|\\t)*class\s+\w+\s*(extends\s*\w+)?\s*$///.test temp
    sameline = (line) ->
      temp = line.replace /\/\/.*/g, ''
      ///^(\s|\\t)*class\s+\w+\s*(extends\s*\w+)?\s+{///.test temp

    convention.classBrace.newline = convention.classBrace.newline + 1 if newline line
    convention.classBrace.sameline = convention.classBrace.sameline + 1 if sameline line

    convention.classBrace.commits.push commitUrl if newline(line) or sameline(line)
    convention.classBrace.commits = _.uniq convention.classBrace.commits
    convention

  controlBrace: (line, convention, commitUrl) ->
    convention = {lang: this.lang} unless convention
    (convention.controlBrace =
      title: "Brace Placement (Control Structures)"
      column: [
        {
          key: "sameline", display: "Control structure opening/closing braces on same line as declaration",
          code: """
                if($baz) {
                  // ..
                } elseif($bar) {
                  // ..
                } else {
                  // ..
                }

                while ($i <= 10) {
                  // ..
                }

                switch($beer) {
                  // ..
                }
                """
        }
        {
          key: "newline", display: "Control structure opening/closing braces on seperate line from declaration",
          code: """
                if($baz)
                {
                  // ..
                }
                elseif($bar)
                {
                  // ..
                }
                else
                {
                  // ..
                }

                while ($i <= 10)
                {
                  // ..
                }

                switch($beer)
                {
                  // ..
                }
                """
        }
      ]
      sameline: 0
      newline: 0
      commits: []
    ) unless convention.controlBrace

    sameline = (line) ->
      temp = line.replace /\/\/.*/g, ''
      ///((if|while|switch).*{)|(}\s*(else|elseif).*{)///.test temp
    newline = (line) ->
      temp = line.replace /\/\/.*/g, ''
      ///^\s*(((if|while|switch).*)|(\s*(else|elseif).*))[^{|:]$///.test temp

    convention.controlBrace.sameline = convention.controlBrace.sameline + 1 if sameline line
    convention.controlBrace.newline = convention.controlBrace.newline + 1 if newline line

    convention.controlBrace.commits.push commitUrl if newline(line) or sameline(line)
    convention.controlBrace.commits = _.uniq convention.controlBrace.commits
    convention

  methodBrace: (line, convention, commitUrl) ->
    convention = {lang: this.lang} unless convention
    (convention.methodBrace =
      title: "Brace Placement (Methods)"
      column: [
        {
          key: "sameline", display: "Method structure opening braces on same line as declaration (OTBS)",
          code: """
                function bar($baz) {
                  // ...
                }
                """
        }
        {
          key: "newline", display: "Method opening/closing braces on seperate line (Allman)",
          code: """
                function bar($baz)
                {
                  // ...
                }
                """
        }
      ]
      sameline: 0
      newline: 0
      commits: []
    ) unless convention.methodBrace

    sameline = (line) ->
      temp = line.replace /\/\/.*/g, ''
      ///^[\s|\t]*function\s+\w+\(.*?\)\s*{///.test temp
    newline = (line) ->
      temp = line.replace /\/\/.*/g, ''
      ///^[\s|\t]*function\s+\w+\(.*?\)\s*$///.test temp

    convention.methodBrace.sameline = convention.methodBrace.sameline + 1 if sameline line
    convention.methodBrace.newline = convention.methodBrace.newline + 1 if newline line

    convention.methodBrace.commits.push commitUrl if newline(line) or sameline(line)
    convention.methodBrace.commits = _.uniq convention.methodBrace.commits
    convention

  spaceAroundControl: (line, convention, commitUrl) ->
    convention = {lang: this.lang} unless convention
    (convention.spaceAroundControl =
      title: "Space Around Control Structure Evaluation Block"
      column: [
        {
          key: "space", display: "Space around control structure Evaluation block",
          code: """
                if ($baz) {
                  // ...
                } elseif ($bar) {
                  // ...
                } else {
                  // ...
                }

                while ($i <= 10) {
                  // ...
                }

                switch ($beer) {
                  // ...
                }
                """
        }
        {
          key: "nospace", display: "No space around control structure Evaluation block",
          code: """
                if($baz){
                  // ...
                }elseif($bar){
                  // ...
                }else{
                  // ...
                }

                while($i <= 10){
                  // ...
                }

                switch($beer){
                  // ...
                }
                """
        }
      ]
      space: 0
      nospace: 0
      commits: []
    ) unless convention.spaceAroundControl

    space = /((if|elseif|while|for)\s+\(.*?\)\s+({|:))|(do\s+{)/
    nospace = /((if|elseif|while|for)\(.*?\)({|:))|(do{)/

    convention.spaceAroundControl.space = convention.spaceAroundControl.space + 1 if space.test line
    convention.spaceAroundControl.nospace = convention.spaceAroundControl.nospace + 1 if nospace.test line

    convention.spaceAroundControl.commits.push commitUrl if nospace.test(line) or space.test(line)
    convention.spaceAroundControl.commits = _.uniq convention.spaceAroundControl.commits
    convention

  spaceInsideControl: (line, convention, commitUrl) ->
    convention = {lang: this.lang} unless convention
    (convention.spaceInsideControl =
      title: "Space Inside Control Structure Evaluation Block"
      column: [
        {
          key: "space", display: "Space inside control structure Evaluation block",
          code: """
                if ( $baz ) {
                  // ...
                } elseif ( $bar ) {
                  // ...
                }

                while ( $i <= 10 ) {
                  // ...
                }

                switch ( $beer ) {
                  // ...
                }
                """
        }
        {
          key: "nospace", display: "No space inside control structure Evaluation block",
          code: """
                if ($baz) {
                  // ...
                } elseif ($bar) {
                  // ...
                }

                while ($i <= 10) {
                  // ...
                }

                switch ($beer) {
                  // ...
                }
                """
        }
      ]
      space: 0
      nospace: 0
      commits: []
    ) unless convention.spaceInsideControl

    space = /(if|elseif|while|for)\s*\(\s+.+?\s+\)/
    nospace = /(if|elseif|while|for)\s*\(\S+.*?\S\)/

    convention.spaceInsideControl.space = convention.spaceInsideControl.space + 1 if space.test line
    convention.spaceInsideControl.nospace = convention.spaceInsideControl.nospace + 1 if nospace.test line

    convention.spaceInsideControl.commits.push commitUrl if nospace.test(line) or space.test(line)
    convention.spaceInsideControl.commits = _.uniq convention.spaceInsideControl.commits
    convention

  spaceAroundMethod: (line, convention, commitUrl) ->
    convention = {lang: this.lang} unless convention
    (convention.spaceAroundMethod =
      title: "Space Around Method Declaration Param Block"
      column: [
        {
          key: "space", display: "Space around parameter declaration block",
          code: """
                function bar ($baz) {
                  // ...
                }
                """
        }
        {
          key: "nospace", display: "No space around parameter declaration block",
          code: """
                function bar($baz){
                  // ...
                }
                """
        }
      ]
      space: 0
      nospace: 0
      commits: []
    ) unless convention.spaceAroundMethod

    space = /^[\s\t]*function\s+\w+\s+\(.*?\)\s+{/
    nospace = /^[\s\t]*function\s+\w+\(.*?\){/

    convention.spaceAroundMethod.space = convention.spaceAroundMethod.space + 1 if space.test line
    convention.spaceAroundMethod.nospace = convention.spaceAroundMethod.nospace + 1 if nospace.test line

    convention.spaceAroundMethod.commits.push commitUrl if nospace.test(line) or space.test(line)
    convention.spaceAroundMethod.commits = _.uniq convention.spaceAroundMethod.commits
    convention

  spaceInsideMethod: (line, convention, commitUrl) ->
    convention = {lang: this.lang} unless convention
    (convention.spaceInsideMethod =
      title: "Space Inside Method Declaration Param Block"
      column: [
        {
          key: "space", display: "Space inside parameter declaration block",
          code: """
                function bar( $baz ){
                  // ...
                }
                """
        }
        {
          key: "nospace", display: "No space inside parameter declaration block",
          code: """
                function bar($baz){
                  // ...
                }
                """
        }
      ]
      space: 0
      nospace: 0
      commits: []
    ) unless convention.spaceInsideMethod

    space = /^[\s|\t]*function\s+\w+\s*\(\s+.+?\s+\)/
    nospace = /^[\s|\t]*function\s+\w+\s*\(\S+.*?\S\)/

    convention.spaceInsideMethod.space = convention.spaceInsideMethod.space + 1 if space.test line
    convention.spaceInsideMethod.nospace = convention.spaceInsideMethod.nospace + 1 if nospace.test line

    convention.spaceInsideMethod.commits.push commitUrl if nospace.test(line) or space.test(line)
    convention.spaceInsideMethod.commits = _.uniq convention.spaceInsideMethod.commits
    convention

  className: (line, convention, commitUrl) ->
    convention = {lang: this.lang} unless convention
    (convention.className =
      title: "Class Names"
      column: [
        {
          key: "camel", display: "Class Name in camelCase",
          code: """
                class fooBarBaz {
                  // ...
                }
                """
        }
        {
          key: "pascal", display: "Class Name in PascalCase",
          code: """
                class FooBarBaz {
                  // ...
                }
                """
        }
        {
          key: "capssnake", display: "Class Name in CAPS_SNAKE_CASE",
          code: """
                class FOO_BAR_BAZ {
                  // ...
                }
                """
        }
        {
          key: "snakepascal", display: "Class Name in Snake_Pascal_Case",
          code: """
                class Foo_Bar_Baz {
                  // ...
                }
                """
        }
        {
          key: "snake", display: "Class Name in snake_case",
          code: """
                class foo_bar_baz {
                  // ...
                }
                """
        }
        {
          key: "uppersnake", display: "Class Snake_first_letter_uppercase",
          code: """
                class Foo_bar_baz {
                  // ...
                }
                """
        }
      ]
      camel: 0
      pascal: 0
      capssnake: 0
      snakepascal: 0
      snake: 0
      uppersnake: 0
      commits: []
    ) unless convention.className

    camel = /^[\s|\t]*class\s+[a-z][a-z0-9]*([A-Z][a-z0-9]+)+(\b|\s|{)/
    pascal = /^[\s|\t]*class\s+([A-Z][a-z0-9]+){2,}(\b|\s|{)/
    capssnake = /^[\s|\t]*class\s+([A-Z0-9]+_)+[A-Z0-9]+(\b|\s|{)/
    snakepascal = /^[\s|\t]*class\s+(([A-Z][a-z0-9]+)_)+[A-Z][a-z0-9]+(\b|\s|{)/
    snake = /^[\s|\t]*class\s+(([a-z][a-z0-9]+)_)+[a-z][a-z0-9]+(\b|\s|{)/
    uppersnake = /^[\s|\t]*class\s+(([A-Z][a-z0-9]+)_)([a-z][a-z0-9]+_)+[a-z][a-z0-9]+(\b|\s|{)/

    convention.className.camel = convention.className.camel + 1 if camel.test line
    convention.className.pascal = convention.className.pascal + 1 if pascal.test line
    convention.className.capssnake = convention.className.capssnake + 1 if capssnake.test line
    convention.className.snakepascal = convention.className.snakepascal + 1 if snakepascal.test line
    convention.className.snake = convention.className.snake + 1 if snake.test line
    convention.className.uppersnake = convention.className.uppersnake + 1 if uppersnake.test line

    convention.className.commits.push commitUrl if camel.test(line) or pascal.test(line) or
                                                   capssnake.test(line) or snakepascal.test(line) or
                                                   snake.test(line) or uppersnake.test(line)
    convention.className.commits = _.uniq convention.className.commits
    convention

  constName: (line, convention, commitUrl) ->
    convention = {lang: this.lang} unless convention
    (convention.constName =
      title: "Constant Names"
      column: [
        {
          key: "camel", display: "Constant Name in camelCase",
          code: """
                const barBaz = 0;

                define('barBaz', 0);
                """
        }
        {
          key: "pascal", display: "Constant Name in PascalCase",
          code: """
                const BarBaz = 0;

                define('BarBaz', 0);
                """
        }
        {
          key: "capssnake", display: "Constant Name in CAPS_SNAKE_CASE",
          code: """
                const BAR_BAZ = 0;

                define('BAR_BAZ', 0);
                """
        }
        {
          key: "snakepascal", display: "Constant Name in Snake_Pascal_Case",
          code: """
                const Bar_Baz = 0;

                define('Bar_Baz', 0);
                """
        }
        {
          key: "snake", display: "Constant Name in snake_case",
          code: """
                const bar_baz = 0;

                define('bar_baz', 0);
                """
        }
      ]
      camel: 0
      pascal: 0
      capssnake: 0
      snakepascal: 0
      snake: 0
      commits: []
    ) unless convention.constName

    camel = /(^[\s|\t]*const\s+[a-z][a-z0-9]*([A-Z][a-z0-9]+)+\s*=)|([\s|\t]*define\(s*['"][a-z][a-z0-9]*([A-Z][a-z0-9]+)+['"]s*,)/
    pascal = /(^[\s|\t]*const\s+([A-Z][a-z0-9]+){2,}\s*=)|([\s|\t]*define\(s*['"]([A-Z][a-z0-9]+){2,}['"]s*,)/
    capssnake = /(^[\s|\t]*const\s+([A-Z0-9]+_)+[A-Z0-9]+\s*=)|([\s|\t]*define\(s*['"]([A-Z0-9]+_)+[A-Z0-9]+['"]s*,)/
    snakepascal = /(^[\s|\t]*const\s+(([A-Z][a-z0-9]+)_)+[A-Z][a-z0-9]+\s*=)|([\s|\t]*define\(s*['"](([A-Z][a-z0-9]+)_)+[A-Z][a-z0-9]+['"]s*,)/
    snake = /(^[\s|\t]*const\s+(([a-z][a-z0-9]+)_)+[a-z][a-z0-9]+\s*=)|([\s|\t]*define\(s*['"](([a-z][a-z0-9]+)_)+[a-z][a-z0-9]+['"]s*,)/

    convention.constName.camel = convention.constName.camel + 1 if camel.test line
    convention.constName.pascal = convention.constName.pascal + 1 if pascal.test line
    convention.constName.capssnake = convention.constName.capssnake + 1 if capssnake.test line
    convention.constName.snakepascal = convention.constName.snakepascal + 1 if snakepascal.test line
    convention.constName.snake = convention.constName.snake + 1 if snake.test line

    convention.constName.commits.push commitUrl if camel.test(line) or pascal.test(line) or
                                                   capssnake.test(line) or snakepascal.test(line) or
                                                   snake.test(line)
    convention.constName.commits = _.uniq convention.constName.commits
    convention

  functionName: (line, convention, commitUrl) ->
    convention = {lang: this.lang} unless convention
    (convention.functionName =
      title: "Function Names"
      column: [
        {
          key: "camel", display: "Function Name in camelCase",
          code: """
                function barBaz(){
                  // ...
                }
                """
        }
        {
          key: "pascal", display: "Function Name in PascalCase",
          code: """
                function BarBaz(){
                  // ...
                }
                """
        }
        {
          key: "capssnake", display: "Function Name in CAPS_SNAKE_CASE",
          code: """
                function BAR_BAZ(){
                  // ...
                }
                """
        }
        {
          key: "snakepascal", display: "Function Name in Snake_Pascal_Case",
          code: """
                function Bar_Baz(){
                  // ...
                }
                """
        }
        {
          key: "snake", display: "Function Name in snake_case",
          code: """
                function bar_baz(){
                  // ...
                }
                """
        }
      ]
      camel: 0
      pascal: 0
      capssnake: 0
      snakepascal: 0
      snake: 0
      commits: []
    ) unless convention.functionName

    camel = /function\s+[a-z][a-z0-9]*([A-Z][a-z0-9]+)+\s*\(/
    pascal = /function\s+([A-Z][a-z0-9]+){2,}\s*\(/
    capssnake = /function\s+([A-Z0-9]+_)+[A-Z0-9]+\s*\(/
    snakepascal = /function\s+(([A-Z][a-z0-9]+)_)+[A-Z][a-z0-9]+\s*\(/
    snake = /function\s+(([a-z][a-z0-9]+)_)+[a-z][a-z0-9]+\s*\(/

    convention.functionName.camel = convention.functionName.camel + 1 if camel.test line
    convention.functionName.pascal = convention.functionName.pascal + 1 if pascal.test line
    convention.functionName.capssnake = convention.functionName.capssnake + 1 if capssnake.test line
    convention.functionName.snakepascal = convention.functionName.snakepascal + 1 if snakepascal.test line
    convention.functionName.snake = convention.functionName.snake + 1 if snake.test line

    convention.functionName.commits.push commitUrl if camel.test(line) or pascal.test(line) or
                                                   capssnake.test(line) or snakepascal.test(line) or
                                                   snake.test(line)
    convention.functionName.commits = _.uniq convention.functionName.commits
    convention

  methodDeclare: (line, convention, commitUrl) ->
    convention = {lang: this.lang} unless convention
    (convention.methodDeclare =
      title: "Method Declare Order"
      column: [
        {
          key: "staticlate", display: "static declared after visibility",
          code: """
                class Foo
                {
                  public static function bar($baz)
                  {
                    // ...
                  }
                }
                """
        }
        {
          key: "staticfirst", display: "static declared before visibility",
          code: """
                class Foo
                {
                  static public function bar($baz)
                  {
                    // ...
                  }
                }
                """
        }
        {
          key: "abstractlate", display: "abstract (or final) declared after visibility",
          code: """
                class Foo
                {
                  public abstract function bar($baz);
                  // ...
                }
                """
        }
        {
          key: "abstractfirst", display: "abstract (or final) declared before visibility",
          code: """
                class Foo
                {
                  abstract public function bar($baz);
                  // ...
                }
                """
        }
      ]
      staticlate: 0
      staticfirst: 0
      abstractlate: 0
      abstractfirst: 0
      commits: []
    ) unless convention.methodDeclare

    staticlate = /(public|protected|private)\s+static\s+\$*\w*/
    staticfirst = /static\s+(public|protected|private)\s+\$*\w*/
    abstractlate = /(public|protected|private)\s+(abstract|final)\s+\$*\w*/
    abstractfirst = /(abstract|final)\s+(public|protected|private)\s+\$*\w*/

    convention.methodDeclare.staticlate = convention.methodDeclare.staticlate + 1 if staticlate.test line
    convention.methodDeclare.staticfirst = convention.methodDeclare.staticfirst + 1 if staticfirst.test line
    convention.methodDeclare.abstractlate = convention.methodDeclare.abstractlate + 1 if abstractlate.test line
    convention.methodDeclare.abstractfirst = convention.methodDeclare.abstractfirst + 1 if abstractfirst.test line

    convention.methodDeclare.commits.push commitUrl if staticlate.test(line) or staticfirst.test(line) or
                                                       abstractlate.test(line) or abstractfirst.test(line)

    convention.methodDeclare.commits = _.uniq convention.methodDeclare.commits
    convention

  linelength: (line, convention, commitUrl) ->
    convention = {lang: this.lang} unless convention
    (convention.linelength =
      title: "Line length is over 80 characters?"
      column: [
        {
          key: "char80", display: "Line length is within 80 characters.",
          code: "/* width is within 80 characters */"
        }
        {
          key: "char120", display: "Line length is within 120 characters",
          code: "/* width is within 120 characters */"
        }
        {
          key: "char150", display: "Line length is within 150 characters",
          code: "/* width is within 150 characters */"
        }
      ]
      char80: 0
      char120: 0
      char150: 0
      commits: []
    ) unless convention.linelength

    width = line.length
    tabcount = line.split('\t').length - 1
    # assume tab size is 4 space
    width += tabcount * 3

    if width < 80
      convention.linelength.char80 = convention.linelength.char80 + 1
    else if width < 120
      convention.linelength.char120 = convention.linelength.char120 + 1
    else
      convention.linelength.char150 = convention.linelength.char150 + 1

    convention.linelength.commits.push commitUrl
    convention.linelength.commits = _.uniq convention.linelength.commits
    convention
