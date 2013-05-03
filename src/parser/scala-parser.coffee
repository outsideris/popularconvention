# parsing Scala code
#
# Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
# Licensed under the MIT license.
# <http://outsider.mit-license.org/>

helpers = require '../helpers'
_ = require 'underscore'

jsParser = module.exports =
  lang: 'scala'

  parse: (line, convention, commitUrl) ->
    convention = this.indent line, convention, commitUrl
    convention = this.linelength line, convention, commitUrl
    convention = this.classname line, convention, commitUrl
    convention = this.variablename line, convention, commitUrl
    convention = this.parametertype line, convention, commitUrl

  indent: (line, convention, commitUrl) ->
    convention = {lang: this.lang} unless convention
    (convention.indent =
      title: "Space vs. Tab"
      column: [
        {
          key: "tab", display: "Tab",
          code: """
                class Foo {
                    // use tab for indentation
                    def bar = {}
                }
                """
        }

        {
          key: "space", display: "Space",
          code: """
                class Foo {
                  def bar = {}
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

  classname: (line, convention, commitUrl) ->
    convention = {lang: this.lang} unless convention
    (convention.classname =
      title: "Classes/Traits naming"
      column: [
        {
          key: "capital", display: "CamelCase with a capital first letter",
          code: """
                class MyFairLady

                trait MyFairLady
                """
        }

        {
          key: "nocapital", display: "CamelCase without a capital first letter",
          code: """
                class myFairLady

                trait myFairLady
                """
        }
      ]
      capital: 0
      nocapital: 0
      commits: []
    ) unless convention.classname

    capital = /(class|trait)\s+[A-Z][a-z0-9]+([A-Z][a-z0-9]+)*/
    nocapital = /(class|trait)\s+[a-z0-9]+([A-Z][a-z0-9]+)*/

    convention.classname.capital = convention.classname.capital + 1 if capital.test line
    convention.classname.nocapital = convention.classname.nocapital + 1 if nocapital.test line

    convention.classname.commits.push commitUrl if capital.test(line) or nocapital.test(line)
    convention.classname.commits = _.uniq convention.classname.commits
    convention

  variablename: (line, convention, commitUrl) ->
    convention = {lang: this.lang} unless convention
    (convention.variablename =
      title: "Values, Variable and Methods naming"
      column: [
        {
          key: "camelcase", display: "CamelCase with the first letter lower-case",
          code: """
                val myValue = ...

                def myMethod = ...

                var myVariable
                """
        }

        {
          key: "noncamelcase", display: "CamelCase without the first letter lower-case",
          code: """
                val MyValue = ...

                def MyMethod = ...

                var MyVariable
                """
        }
      ]
      camelcase: 0
      noncamelcase: 0
      commits: []
    ) unless convention.variablename

    camelcase = /(val|def|var)\s+[a-z]+([A-Z][a-z0-9])*/
    noncamelcase = /(val|def|var)\s+[A-Z][a-z]+([A-Z][a-z0-9])*/

    convention.variablename.camelcase = convention.variablename.camelcase + 1 if camelcase.test line
    convention.variablename.noncamelcase = convention.variablename.noncamelcase + 1 if noncamelcase.test line

    convention.variablename.commits.push commitUrl if camelcase.test(line) or noncamelcase.test(line)
    convention.variablename.commits = _.uniq convention.variablename.commits
    convention

  parametertype: (line, convention, commitUrl) ->
    convention = {lang: this.lang} unless convention
    (convention.parametertype =
      title: "Type of Parameters Definition"
      column: [
        {
          key: "tracespace", display: "Followed by space",
          code: """
                def add(a:Int, b:Int) = a + b
                """
        }
        {
          key: "bothspace", display: "Using space in before/after",
          code: """
                def add(a:Int, b:Int) = a + b
                """
        }
        {
          key: "nospace", display: "No space",
          code: """
                def add(a:Int, b:Int) = a + b
                """
        }
      ]
      tracespace: 0
      bothspace: 0
      nospace: 0
      commits: []
    ) unless convention.parametertype

    tracespace = /def\s+\w+\(.*\s*\w+:\s+[A-Z]\w*/
    bothspace = /def\s+\w+\(.*\s*\w\s+:\s+[A-Z]\w*/
    nospace = /def\s+\w+\(.*\s*\w:[A-Z]\w*/

    convention.parametertype.tracespace = convention.parametertype.tracespace + 1 if tracespace.test line
    convention.parametertype.bothspace = convention.parametertype.bothspace + 1 if bothspace.test line
    convention.parametertype.nospace = convention.parametertype.nospace + 1 if nospace.test line

    convention.parametertype.commits.push commitUrl if tracespace.test(line) or bothspace.test(line) or nospace.test(line)
    convention.parametertype.commits = _.uniq convention.parametertype.commits
    convention