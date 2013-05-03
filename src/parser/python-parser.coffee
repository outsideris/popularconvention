# parsing Python code
#
# Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
# Licensed under the MIT license.
# <http://outsider.mit-license.org/>

helpers = require '../helpers'
_ = require 'underscore'

jsParser = module.exports =
  lang: 'py'

  parse: (line, convention, commitUrl) ->
    convention = this.indent line, convention, commitUrl
    convention = this.linelength line, convention, commitUrl
    convention = this.imports line, convention, commitUrl
    convention = this.whitespace line, convention, commitUrl

  indent: (line, convention, commitUrl) ->
    convention = {lang: this.lang} unless convention
    (convention.indent =
      title: "Space vs. Tab"
      column: [
        {
          key: "tab", display: "Tab",
          code: """
                def long_function_name(var_one):
                    # use tab for indentation
                    print(var_one)
                """
        }
        {
          key: "space", display: "Space",
          code: """
                def long_function_name(var_one):
                  print(var_one)
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
          code: "# width is within 80 characters"
        }
        {
          key: "char120", display: "Line length is within 120 characters",
          code: "# width is within 120 characters"
        }
        {
          key: "char150", display: "Line length is within 150 characters",
          code: "# width is within 150 characters"
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

  imports: (line, convention, commitUrl) ->
    convention = {lang: this.lang} unless convention
    (convention.imports =
      title: "imports on separate lines"
      column: [
        {
          key: "separated", display: "Imports on separate lines",
          code: """
                imports os
                imports sys
                """
        }

        {
          key: "noseparated", display: "Impont on non-sepratate lines",
          code: """
                imports sys, os
                """
        }
      ]
      separated: 0
      noseparated: 0
      commits: []
    ) unless convention.imports

    separated = /^\s*\t*import\s+[\w.]+([^,]\s*|\s*#.*)$/
    noseparated = /^\s*\t*import\s+\w+\s*,\s+\w+/

    convention.imports.separated = convention.imports.separated + 1 if separated.test line
    convention.imports.noseparated = convention.imports.noseparated + 1 if noseparated.test line

    convention.imports.commits.push commitUrl if separated.test(line) or noseparated.test(line)
    convention.imports.commits = _.uniq convention.imports.commits
    convention

  whitespace: (line, convention, commitUrl) ->
    convention = {lang: this.lang} unless convention
    (convention.whitespace =
      title: "Whitespace in Expressions and Statements"
      column: [
        {
          key: "noextra", display: "Avoiding extraneous whitespace",
          code: """
                spam(ham[1], {eggs: 2})

                if x == 4: print x, y; x, y = y, x

                spam(1)

                dict['key'] = list[index]

                x = 1
                y = 2
                long_variable = 3
                """
        }

        {
          key: "extra", display: "Using extraneous whitespace",
          code: """
                spam( ham[ 1 ], { eggs: 2 } )

                if x == 4 : print x , y ; x , y = y , x

                spam (1)

                dict ['key'] = list [index]

                x             = 1
                y             = 2
                """
        }
      ]
      noextra: 0
      extra: 0
      commits: []
    ) unless convention.whitespace

    noextra = /\S+[\(\)\[\],]\S+|\S+:\s|\S\s=\s/
    extra = /\(\s+|\s+[\(\)\[\]]|\s+[:,]\s+|\s{2,}=|=\s{2,}/

    if extra.test line
      convention.whitespace.extra = convention.whitespace.extra + 1

      convention.whitespace.commits.push commitUrl
      convention.whitespace.commits = _.uniq convention.whitespace .commits
    else if noextra.test line
      convention.whitespace.noextra = convention.whitespace.noextra + 1

      convention.whitespace.commits.push commitUrl
      convention.whitespace.commits = _.uniq convention.whitespace .commits

    convention
