# parsing JavaScript code
#
# Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
# Licensed under the MIT license.
# <http://outsider.mit-license.org/>

helpers = require '../helpers'

jsParser = module.exports =

  parse: (line, convention, commitUrl) ->
    convention = jsParser.comma line, convention, commitUrl
    convention = jsParser.indent line, convention, commitUrl
    convention = jsParser.functiondef line, convention, commitUrl
    convention = jsParser.argumentdef line, convention, commitUrl
    convention = jsParser.literaldef line, convention, commitUrl
    convention = jsParser.conditionstatement line, convention, commitUrl

  comma: (line, convention, commitUrl) ->
    convention = {lang: 'js'} unless convention
    (convention.comma =
      title: "Last Comma vs. First Comma"
      column: [
        { key: "first", display: "First comma", code: ", key: value" }
        { key: "last", display: "Last comma", code: "key: value," }
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
    convention

  indent: (line, convention, commitUrl) ->
    convention = {lang: 'js'} unless convention
    (convention.indent =
      title: "Space vs. Tab"
      column: [
        { key: "tab", display: "Tab", code: "  var a = 1;" }
        { key: "space", display: "Space", code: "/*tab*/var a = 1;" }
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

  functiondef: (line, convention, commitUrl) ->
    convention = {lang: 'js'} unless convention
    (convention.functiondef =
      title: "Function followed by one space vs. Function follwed by no space"
      column: [
        { key: "onespace", display: "One space", code: "function fn () {" }
        { key: "nospace", display: "No space", code: "function fn() {" }
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
    convention

  argumentdef: (line, convention, commitUrl) ->
    convention = {lang: 'js'} unless convention
    (convention.argumentdef =
      title: "Arguements definition with one space vs. no space"
      column: [
        { key: "onespace", display: "One space", code: "function fn( arg1, arg2 ) {\n//or\nif ( true ) {" }
        { key: "nospace", display: "No space", code: "function fn(arg1, arg2) {\n//or\nif (true) {" }
      ]
      onespace: 0
      nospace: 0
      commits: []
    ) unless convention.argumentdef

    onespace = /(function|if|while|switch)(\s+.)*\s*\(\s+/
    nospace = /(function|if|while|switch)(\s+.)*\s*\(\S+/

    convention.argumentdef.onespace = convention.argumentdef.onespace + 1 if onespace.test line
    convention.argumentdef.nospace = convention.argumentdef.nospace + 1 if nospace.test line
    convention.argumentdef.commits.push commitUrl if onespace.test(line) or nospace.test(line)
    convention

  literaldef: (line, convention, commitUrl) ->
    convention = {lang: 'js'} unless convention
    (convention.literaldef =
      title: "Object Literal Definition types"
      column: [
        { key: "tracespace", display: "Followed by space", code: "key: value"}
        { key: "bothspace", display: "Using space in before/after", code: "key : value"}
        { key: "nospace", display: "No space", code: "key:value"}
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
    convention

  conditionstatement: (line, convention, commitUrl) ->
    convention = {lang: 'js'} unless convention
    (convention.conditionstatement =
      title: "How to write if statement"
      column: [
        {
          key: "onespace", display: "condition with one space",
          code: "if (true) {\n//or\nwhile (true) {\n//or\nswitch (v) {"
        }
        {
          key: "nospace", display: "condition with no space",
          code: "if(true) {\n//or\nwhile(true) {\n//or\nswitch (v) {"
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

  blockstatement: (line, convention, commitUrl) ->
    convention = {lang: 'js'} unless convention
    (convention.blockstatement =
      title: "How to write block statement"
      column: [
        {
          key: "onespace", display: "curlybrace with one space",
          code: "if (true) {\n//or\nwhile (true) {\n//or\nswitch (v) {"
        }
        {
          key: "nospace", display: "curlybrace with no space",
          code: "if (true){\n//or\nwhile (true){\n//or\nswitch (v){"
        }
        {
          key: "newline", display: "curlybrace at new line",
          code: "if (true)\n{\n//or\nwhile (true)\n{\n//or\nswitch (v)\n{"
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
    convention

