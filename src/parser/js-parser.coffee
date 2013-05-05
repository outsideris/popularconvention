# parsing JavaScript code
#
# Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
# Licensed under the MIT license.
# <http://outsider.mit-license.org/>

helpers = require '../helpers'
_ = require 'underscore'

jsParser = module.exports =
  lang: 'js'

  parse: (line, convention, commitUrl) ->
    convention = this.comma line, convention, commitUrl
    convention = this.indent line, convention, commitUrl
    convention = this.functiondef line, convention, commitUrl
    convention = this.argumentdef line, convention, commitUrl
    convention = this.literaldef line, convention, commitUrl
    convention = this.conditionstatement line, convention, commitUrl

  comma: (line, convention, commitUrl) ->
    convention = {lang: this.lang} unless convention
    (convention.comma =
      title: "Last Comma vs. First Comma"
      column: [
        {
          key: "first", display: "First comma",
          code: """
                var foo = 1
                  , bar = 2
                  , baz = 3;

                var obj = {
                    foo: 1
                  , bar: 2
                  , baz: 3
                };
                """
        }
        {
          key: "last", display: "Last comma",
          code: """
                var foo = 1,
                    bar = 2,
                    baz = 3;

                var obj = {
                    foo: 1,
                    bar: 2,
                    baz: 3
                };
                """
        }
      ]
      first: 0
      last: 0
      commits: []
    ) unless convention.comma

    first = /^\s*,.*/
    last = /.*,\s*$/

    convention.comma.first = convention.comma.first + 1 if first.test line
    convention.comma.last = convention.comma.last + 1 if last.test line

    convention.comma.commits.push commitUrl if first.test(line) or last.test(line)
    convention.comma.commits = _.uniq convention.comma.commits
    convention

  indent: (line, convention, commitUrl) ->
    convention = {lang: this.lang} unless convention
    (convention.indent =
      title: "Space vs. Tab"
      column: [
        {
          key: "tab", display: "Tab",
          code: """
                function foo() {
                    // use tab for indentation
                    return "bar";
                }
                """
        }
        {
          key: "space", display: "Space",
          code: """
                function foo() {
                  return "bar";
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

  functiondef: (line, convention, commitUrl) ->
    convention = {lang: this.lang} unless convention
    (convention.functiondef =
      title: "Function followed by one space vs. Function follwed by no space"
      column: [
        {
          key: "onespace", display: "One space",
          code: """
                function foo () {
                  return "bar";
                }
                """
        }
        {
          key: "nospace", display: "No space",
          code: """
                function foo() {
                  return "bar";
                }
                """
        }
      ]
      onespace: 0
      nospace: 0
      commits: []
    ) unless convention.functiondef

    onespace = /function(\s+.)*\s+\(/
    nospace = /function(\s+.)*\(/

    convention.functiondef.onespace = convention.functiondef.onespace + 1 if onespace.test line
    convention.functiondef.nospace = convention.functiondef.nospace + 1 if nospace.test line

    convention.functiondef.commits.push commitUrl if onespace.test(line) or nospace.test(line)
    convention.functiondef.commits = _.uniq convention.functiondef.commits
    convention

  argumentdef: (line, convention, commitUrl) ->
    convention = {lang: this.lang} unless convention
    (convention.argumentdef =
      title: "Arguements definition with one space vs. no space"
      column: [
        {
          key: "onespace", display: "One space",
          code: """
                function fn( arg1, arg2 ) {
                  // ...
                }

                if ( true ) {
                  // ...
                }
                """
        }
        {
          key: "nospace", display: "No space",
          code: "function fn(arg1, arg2) {\n//or\nif (true) {"
        }
      ]
      onespace: 0
      nospace: 0
      commits: []
    ) unless convention.argumentdef

    onespace = /(function|if|while|switch)(\s+\w*)?\s*\(\s+/
    nospace = /(function|if|while|switch)(\s+\w*)?\s*\(\S+/

    convention.argumentdef.onespace = convention.argumentdef.onespace + 1 if onespace.test line
    convention.argumentdef.nospace = convention.argumentdef.nospace + 1 if nospace.test line

    convention.argumentdef.commits.push commitUrl if onespace.test(line) or nospace.test(line)
    convention.argumentdef.commits = _.uniq convention.argumentdef.commits
    convention

  literaldef: (line, convention, commitUrl) ->
    convention = {lang: this.lang} unless convention
    (convention.literaldef =
      title: "Object Literal Definition types"
      column: [
        {
          key: "tracespace", display: "Followed by space",
          code: """
                {
                  foo: 1,
                  bar: 2,
                  baz: 3
                }
                """
        }
        {
          key: "bothspace", display: "Using space in before/after",
          code: """
                {
                  foo : 1,
                  bar : 2,
                  baz : 3
                }
                """
        }
        {
          key: "nospace", display: "No space",
          code: """
                {
                  foo:1,
                  bar:2,
                  baz:3
                }
                """
        }
      ]
      tracespace: 0
      bothspace: 0
      nospace: 0
      commits: []
    ) unless convention.literaldef

    tracespace = /\w:\s+[\w"'\/]/
    bothspace = /\w\s+:\s+[\w"'\/]/
    nospace = /\w:[\w"'\/]/

    convention.literaldef.tracespace = convention.literaldef.tracespace + 1 if tracespace.test line
    convention.literaldef.bothspace = convention.literaldef.bothspace + 1 if bothspace.test line
    convention.literaldef.nospace = convention.literaldef.nospace + 1 if nospace.test line

    convention.literaldef.commits.push commitUrl if tracespace.test(line) or bothspace.test(line) or nospace.test(line)
    convention.literaldef.commits = _.uniq convention.literaldef.commits
    convention

  conditionstatement: (line, convention, commitUrl) ->
    convention = {lang: this.lang} unless convention
    (convention.conditionstatement =
      title: "How to write conditional statement"
      column: [
        {
          key: "onespace", display: "Condition with one space",
          code: """
                if (true) {
                  //...
                }

                while (true) {
                  //...
                }

                switch (v) {
                  //...
                }
                """
        }
        {
          key: "nospace", display: "Condition with no space",
          code: """
                if(true) {
                  //...
                }

                while(true) {
                  //...
                }

                switch(v) {
                  //...
                }
                """
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
    convention.conditionstatement.commits = _.uniq convention.conditionstatement.commits
    convention

  blockstatement: (line, convention, commitUrl) ->
    convention = {lang: this.lang} unless convention
    (convention.blockstatement =
      title: "How to write block statement"
      column: [
        {
          key: "onespace", display: "Curlybrace with one space",
          code: """
                if (true) {
                  // ...
                }

                while (true) {
                  // ...
                }

                switch (v) {
                  // ...
                }
                """
        }
        {
          key: "nospace", display: "Curlybrace with no space",
          code: """
                if (true){
                  // ...
                }

                while (true){
                  // ...
                }

                switch (v){
                  // ...
                }
                """
        }
        {
          key: "newline", display: "Curlybrace at new line",
          code: """
                if (true)
                {
                  // ...
                }

                while (true)
                {
                  // ...
                }

                switch (v)
                {
                  // ...
                }
                """
        }
      ]
      onespace: 0
      nospace: 0
      newline: 0
      commits: []
    ) unless convention.blockstatement

    onespace = /((if|while|switch).*\)\s+{)|(}\s+else)/
    nospace = /((if|while|switch).*\){)|(}else)/
    newline = /((if|while|switch).*\)\s*$)|((if|while|switch).*\)\s*\/[\/\*])|(^\s*else)/

    convention.blockstatement.onespace = convention.blockstatement.onespace + 1 if onespace.test line
    convention.blockstatement.nospace = convention.blockstatement.nospace + 1 if nospace.test line
    convention.blockstatement.newline = convention.blockstatement.newline + 1 if newline.test line

    convention.blockstatement.commits.push commitUrl if onespace.test(line) or nospace.test(line) or newline.test(line)
    convention.blockstatement.commits = _.uniq convention.blockstatement.commits
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
