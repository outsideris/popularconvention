# parsing Java code
#
# Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
# Licensed under the MIT license.
# <http://outsider.mit-license.org/>

helpers = require '../helpers'

javaParser = module.exports =
  lang: 'java'

  parse: (line, convention, commitUrl) ->
    convention = this.indent line, convention, commitUrl
    convention = this.blockstatement line, convention, commitUrl
    convention = this.constant line, convention, commitUrl
    convention = this.conditionstatement line, convention, commitUrl
    convention = this.argumentdef line, convention, commitUrl
    convention = this.linelength line, convention, commitUrl
    convention = this.staticvar line, convention, commitUrl

  indent: (line, convention, commitUrl) ->
    convention = {lang: this.lang} unless convention
    (convention.indent =
      title: "Space vs. Tab"
      column: [
        {
          key: "tab", display: "Tab",
          code: "/*tab*/public String getName() {\n/*tab*//*tab*/return this.name;\n/*tab*/}"
        }
        {
          key: "space", display: "Space",
          code: "    public String getName() {\n        return this.name;\n    }"
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
    convention

  blockstatement: (line, convention, commitUrl) ->
    convention = {lang: this.lang} unless convention
    (convention.blockstatement =
      title: "How to write block statement"
      column: [
        {
          key: "onespace", display: "curlybrace with one space",
          code: "if (height < MIN_HEIGHT) {\n//..\n}\n//or\nwhile (isTrue) {\n//..\n}//or\nswitch (foo) {\n//..\n}"
        }
        {
          key: "nospace", display: "curlybrace with no space",
          code: "if (height < MIN_HEIGHT){\n//..\n}\n//or\nwhile (isTrue){\n//..\n}//or\nswitch (foo){\n//..\n}"

        }
        {
          key: "newline", display: "curlybrace at new line",
          code: "if (height < MIN_HEIGHT)\n{\n//..\n}\n//or\nwhile (isTrue)\n{\n//..\n}//or\nswitch (foo)\n{\n//..\n}"
        }
      ]
      onespace: 0
      nospace: 0
      newline: 0
      commits: []
    ) unless convention.blockstatement

    onespace = /((if|while|switch|try).*\s+{)|(}\s+(else|catch|finally).*\s+{)/
    nospace = /((if|while|switch).*\){)|(try|else|finally){|(}\s*(else|catch|finally).*\){)/
    newline = /((if|while|switch).*\)\s*$)|((if|while|switch).*\)\s*\/[\/\*])|(try|else|finally)\s*\/[\/\*]|(^\s*(else|catch|finally))/

    convention.blockstatement.onespace = convention.blockstatement.onespace + 1 if onespace.test line
    convention.blockstatement.nospace = convention.blockstatement.nospace + 1 if nospace.test line
    convention.blockstatement.newline = convention.blockstatement.newline + 1 if newline.test line
    convention.blockstatement.commits.push commitUrl if onespace.test(line) or nospace.test(line) or newline.test(line)
    convention

  constant: (line, convention, commitUrl) ->
    convention = {lang: this.lang} unless convention
    (convention.constant =
      title: "Constant name is all caps?"
      column: [
        {
          key: "allcaps", display: "constant name is all caps with underscore(_)",
          code: "final String FOO_BAR = \"\";"
        }
        {
          key: "notallcaps", display: "constant name is not all caps",
          code: "final String foobar = \"\";"

        }
      ]
      allcaps: 0
      notallcaps: 0
      commits: []
    ) unless convention.constant

    allcaps = /^\s*\w*\s*final\s\w+\s[A-Z0-9_]+(\s|=|;)/
    notallcaps = /^\s*\w*\s*final\s\w+\s[a-zA-Z0-9_]+(\s|=|;)/

    convention.constant.allcaps = convention.constant.allcaps + 1 if allcaps.test line
    convention.constant.notallcaps = convention.constant.notallcaps + 1 if not allcaps.test(line) and notallcaps.test line
    convention.constant.commits.push commitUrl if allcaps.test line or (not allcaps.test(line) and notallcaps.test line)
    convention

  conditionstatement: (line, convention, commitUrl) ->
    convention = {lang: this.lang} unless convention
    (convention.conditionstatement =
      title: "How to write conditional statement"
      column: [
        {
          key: "onespace", display: "condition with one space",
          code: "if (true) {\n    //...\n}\n//or\nwhile (true) {\n    //...\n}\n//or\nswitch (v) {    //...\n}"
        }
        {
          key: "nospace", display: "condition with no space",
          code: "if(true) {\n    //...\n}\n//or\nwhile(true) {\n    //...\n}\n//or\nswitch (v) {    //...\n}"
        }
      ]
      onespace: 0
      nospace: 0
      commits: []
    ) unless convention.conditionstatement

    onespace = /(if|while|switch)\s+\(/
    nospace = /(if|while|switch)\(/

    convention.conditionstatement.onespace = convention.conditionstatement.onespace + 1 if onespace.test line
    convention.conditionstatement.nospace = convention.conditionstatement.nospace + 1 if nospace.test line
    convention.conditionstatement.commits.push commitUrl if onespace.test(line) or nospace.test(line)
    convention

  argumentdef: (line, convention, commitUrl) ->
    convention = {lang: this.lang} unless convention
    (convention.argumentdef =
      title: "Arguements definition with one space vs. no space"
      column: [
        {
          key: "onespace", display: "One space",
          code: "public void setName( String name ) {\n    // ... \n}\n//or\nif( isTrue ) {}\n//or\nwhile( isTrue ) {}"
        }
        {
          key: "nospace", display: "No space",
          code: "public void setName(String name) {\n    // ... \n}\n//or\nif(isTrue) {}\n//or\nwhile(isTrue) {}"
        }
      ]
      onespace: 0
      nospace: 0
      commits: []
    ) unless convention.argumentdef

    onespace = /^(\s*|\t*)(\w+\s+\w+\s+\w+|if|while|switch)\s*\(\s+/
    nospace = /^(\s*|\t*)(\w+\s+\w+\s+\w+|if|while|switch)\s*\(\S+/

    convention.argumentdef.onespace = convention.argumentdef.onespace + 1 if onespace.test line
    convention.argumentdef.nospace = convention.argumentdef.nospace + 1 if nospace.test line
    convention.argumentdef.commits.push commitUrl if onespace.test(line) or nospace.test(line)
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

    if width <= 80
      convention.linelength.char80 = convention.linelength.char80 + 1
    else if width <= 120
      convention.linelength.char120 = convention.linelength.char120 + 1
    else
      convention.linelength.char150 = convention.linelength.char150 + 1
    convention.linelength.commits.push commitUrl
    convention

  staticvar: (line, convention, commitUrl) ->
    convention = {lang: this.lang} unless convention
    (convention.staticvar =
      title: "Use special prefix fot staticvar"
      column: [
        {
          key: "prefix", display: "special prefix",
          code: "staticvar String _name;"
        }
        {
          key: "noprefix", display: "no special prefix",
          code: "staticvar String name"
        }
      ]
      prefix: 0
      noprefix: 0
      commits: []
    ) unless convention.staticvar

    prefix = /static\s+\w+\s+(_|\$)\w+/
    noprefix = /static\s+\w+\s+[^_$]\w+/

    convention.staticvar.prefix = convention.staticvar.prefix + 1 if prefix.test line
    convention.staticvar.noprefix = convention.staticvar.noprefix + 1 if noprefix.test line
    convention.staticvar.commits.push commitUrl if prefix.test(line) or noprefix.test(line)
    convention