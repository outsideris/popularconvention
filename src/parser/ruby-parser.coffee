# parsing Ruby code
#
# Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
# Licensed under the MIT license.
# <http://outsider.mit-license.org/>

helpers = require '../helpers'
_ = require 'underscore'

rubyParser = module.exports =
  lang: 'rb'

  parse: (line, convention, commitUrl) ->
    convention = this.indent line, convention, commitUrl
    convention = this.linelength line, convention, commitUrl
    convention = this.whitespace line, convention, commitUrl
    convention = this.asignDefaultValue line, convention, commitUrl
    convention = this.numericLiteral line, convention, commitUrl
    convention = this.defNoArgs line, convention, commitUrl
    convention = this.defArgs line, convention, commitUrl

  indent: (line, convention, commitUrl) ->
    convention = {lang: this.lang} unless convention
    (convention.indent =
      title: "Space vs. Tab"
      column: [
        {
          key: "tab", display: "Tab",
          code: """
                def foo(test)
                  # use tab for indentation
                  Thread.new do |blockvar|
                    # use tab for indentation
                    ABC::DEF.reverse(:a_symbol, :'a symbol', :<=>, 'test' + test)
                  end.join
                end
                """
        }
        {
          key: "space", display: "Space",
          code: """
                def foo(test)
                  Thread.new do |blockvar|
                    ABC::DEF.reverse(:a_symbol, :'a symbol', :<=>, 'test' + test)
                  end.join
                end
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

  whitespace: (line, convention, commitUrl) ->
    convention = {lang: this.lang} unless convention
    (convention.whitespace =
      title: "Whitespace around operators, colons, { and }, after commas, semicolons"
      column: [
        {
          key: "spaces", display: "Using spaces",
          code: """
                sum = 1 + 2

                a, b = 1, 2

                1 > 2 ? true : false; puts 'Hi'

                [1, 2, 3].each { |e| puts e }
                """
        }

        {
          key: "nospace", display: "Using no space",
          code: """
                sum = 1 +2

                a,b = 1, 2

                1>2 ? true : false;puts 'Hi'

                [1, 2, 3].each {|e| puts e}
                """
        }
      ]
      spaces: 0
      nospace: 0
      commits: []
    ) unless convention.whitespace

    placeholder = "CONVENTION-PLACEHOLDER"
    operators = '[+=*/%>?:{}]'
    symbols = '[,;]'

    spaces = (line) ->
      temp = line.replace /'.*?'/g, placeholder
      temp = temp.replace /".*?"/g, placeholder

      !///\w+#{operators}///.test(temp) and !///#{operators}\w+///.test(temp) and
      !///#{symbols}\w+///.test(temp) and
      (///\s+#{operators}\s+///.test temp or ///#{symbols}\s+///.test(temp))
    nospace = (line) ->
      temp = line.replace /'.*?'/g, placeholder
      temp = temp.replace /".*?"/g, placeholder

      ///\w+#{operators}///.test(temp) or ///#{operators}\w+///.test(temp) or
      ///#{symbols}\w+///.test(temp)

    convention.whitespace.spaces = convention.whitespace.spaces + 1 if spaces line
    convention.whitespace.nospace = convention.whitespace.nospace + 1 if nospace line

    convention.whitespace.commits.push commitUrl if spaces(line) or nospace(line)
    convention.whitespace.commits = _.uniq convention.whitespace .commits

    convention

  asignDefaultValue: (line, convention, commitUrl) ->
    convention = {lang: this.lang} unless convention
    (convention.asignDefaultValue =
      title: "How to write assigning default values to method parameters"
      column: [
        {
          key: "space", display: "Use spaces",
          code: """
                def some_method(arg1 = :default, arg2 = nil, arg3 = [])
                  # do something...
                end
                """
        }
        {
          key: "nospace", display: "Use spaces before = or after =",
          code: """
                def some_method(arg1=:default, arg2=nil, arg3=[])
                  # do something...
                end
                """
        }
      ]
      space: 0
      nospace: 0
      commits: []
    ) unless convention.asignDefaultValue

    space = /^[\s\t]*def.*\((\s*\w+\s+=\s+[\[\]:\w,]+\s*)+\)/
    nospace = /^[\s\t]*def.*\((\s*\w+=[\[\]:\w,]+\s*)+\)/

    convention.asignDefaultValue.space = convention.asignDefaultValue.space + 1 if space.test line
    convention.asignDefaultValue.nospace = convention.asignDefaultValue.nospace + 1 if nospace.test line

    convention.asignDefaultValue.commits.push commitUrl if space.test(line) or nospace.test(line)
    convention.asignDefaultValue.commits = _.uniq convention.asignDefaultValue.commits
    convention

  numericLiteral: (line, convention, commitUrl) ->
    convention = {lang: this.lang} unless convention
    (convention.numericLiteral =
      title: "How to write large numeric literals"
      column: [
        {
          key: "underscore", display: "Write with underscore",
          code: """
                num = 1_000_000
                """
        }
        {
          key: "nounderscore", display: "Write without underscore",
          code: """
                num = 1000000
                """
        }
      ]
      underscore: 0
      nounderscore: 0
      commits: []
    ) unless convention.numericLiteral

    placeholder = "CONVENTION-PLACEHOLDER"
    underscore = (line) ->
      temp = line.replace /'.*?'/g, placeholder
      temp = temp.replace /".*?"/g, placeholder
      /[0-9]+(_[0-9]{3,})+/.test(temp)

    nounderscore = (line) ->
      temp = line.replace /'.*?'/g, placeholder
      temp = temp.replace /".*?"/g, placeholder
      /[0-9]{4,}/.test(temp)

    convention.numericLiteral.underscore = convention.numericLiteral.underscore + 1 if underscore line
    convention.numericLiteral.nounderscore = convention.numericLiteral.nounderscore + 1 if nounderscore line

    convention.numericLiteral.commits.push commitUrl if underscore(line) or nounderscore(line)
    convention.numericLiteral.commits = _.uniq convention.numericLiteral.commits
    convention

  defNoArgs: (line, convention, commitUrl) ->
    convention = {lang: this.lang} unless convention
    (convention.defNoArgs =
      title: "Omit parentheses when there aren't any arguments"
      column: [
        {
          key: "omit", display: "Omit",
          code: """
                def some_method
                  # do something...
                end
                """
        }
        {
          key: "use", display: "Use the parentheses",
          code: """
                def some_method()
                  # do something...
                end
                """
        }
      ]
      omit: 0
      use: 0
      commits: []
    ) unless convention.defNoArgs

    omit = /^[\s\t]*def\s+\w+\s*[^(),\w]*(#+.*)*$/
    use = /^[\s\t]*def\s+\w+\s*\(\s*\)/

    convention.defNoArgs.omit = convention.defNoArgs.omit + 1 if omit.test line
    convention.defNoArgs.use = convention.defNoArgs.use + 1 if use.test line

    convention.defNoArgs.commits.push commitUrl if omit.test(line) or use.test(line)
    convention.defNoArgs.commits = _.uniq convention.defNoArgs.commits
    convention

  defArgs: (line, convention, commitUrl) ->
    convention = {lang: this.lang} unless convention
    (convention.defArgs =
      title: "Parentheses around arguments in def"
      column: [
        {
          key: "omit", display: "Omit",
          code: """
                def some_method arg1, arg2
                  # do something...
                end
                """
        }
        {
          key: "use", display: "Use the parentheses",
          code: """
                def some_method(arg1, arg2)
                  # do something...
                end
                """
        }
      ]
      omit: 0
      use: 0
      commits: []
    ) unless convention.defArgs

    omit = /^[\s\t]*def\s+\w+\s*[^()]*(#+.*)*$/
    use = /^[\s\t]*def\s+\w+\s*\((\s*[\w=]+,?)+\s*/

    convention.defArgs.omit = convention.defArgs.omit + 1 if omit.test line
    convention.defArgs.use = convention.defArgs.use + 1 if use.test line

    convention.defArgs.commits.push commitUrl if omit.test(line) or use.test(line)
    convention.defArgs.commits = _.uniq convention.defArgs.commits
    convention
