const _ = require('lodash');

const RubyInfo = {
  indent: {
    title: "Space vs. Tab",
    desc: [
      { key: "tab",
        display: "Tab",
        code:
          `def foo(test)
            # use tab for indentation
            Thread.new do |blockvar|
              # use tab for indentation
              ABC::DEF.reverse(:a_symbol, :'a symbol', :<=>, 'test' + test)
            end.join
          end`
      }, {
        key: "space",
        display: "Space",
        code:
          `def foo(test)
            Thread.new do |blockvar|
              ABC::DEF.reverse(:a_symbol, :'a symbol', :<=>, 'test' + test)
            end.join
          end`
      }
    ]
  },
  linelength: {
    title: "Line length is over 80 characters?",
    desc: [
      { key: "char80",
        display: "Line length is within 80 characters.",
        code:
          `# width is within 80 characters`
      }, {
        key: "char120",
        display: "Line length is within 120 characters",
        code:
          `# width is within 120 characters`
      }, {
        key: "char150",
        display: "Line length is within 150 characters",
        code:
          `# width is within 150 characters`
      }
    ]
  },
  whitespace: {
    title: "Whitespace around operators, colons, { and }, after commas, semicolons",
    desc: [
      { key: "spaces",
        display: "Using spaces",
        code:
          `sum = 1 + 2

          a, b = 1, 2

          1 > 2 ? true : false; puts 'Hi'

          [1, 2, 3].each { |e| puts e }`
      }, {
        key: "nospace",
        display: "Using no space",
        code:
          `sum = 1 +2

          a,b = 1, 2

          1>2 ? true : false;puts 'Hi'

          [1, 2, 3].each {|e| puts e}`
      }
    ]
  },
  asignDefaultValue: {
    title: "How to write assigning default values to method parameters",
    desc: [
      { key: "space",
        display: "Use spaces",
        code:
          `def some_method(arg1 = :default, arg2 = nil, arg3 = [])
            # do something...
          end`
      }, {
        key: "nospace",
        display: "Use spaces before = or after =",
        code:
          `def some_method(arg1=:default, arg2=nil, arg3=[])
            # do something...
          end`
      }
    ]
  },
  numericLiteral: {
    title: "How to write large numeric literals",
    desc: [
      { key: "underscore",
        display: "Write with underscore",
        code:
          `num = 1_000_000`
      }, {
        key: "nounderscore",
        display: "Write without underscore",
        code:
          `num = 1000000`
      }
    ]
  },
  defNoArgs: {
    title: "Omit parentheses when there aren't any arguments",
    desc: [
      { key: "omit",
        display: "Omit",
        code:
          `def some_method
            # do something...
          end`
      }, {
        key: "use",
        display: "Use the parentheses",
        code:
          `def some_method()
            # do something...
          end`
      }
    ]
  },
  defArgs: {
    title: "Parentheses around arguments in def",
    desc: [
      { key: "omit",
        display: "Omit",
        code:
          `def some_method arg1, arg2
            # do something...
          end`
      }, {
        key: "use",
        display: "Use the parentheses",
        code:
          `def some_method(arg1, arg2)
            # do something...
          end`
      }
    ]
  }
};

for (let prop in RubyInfo) {
  RubyInfo[prop].column = _.map(RubyInfo[prop].column, (item) => {
    item.code = item.code.replace(/          /gm, '');
    return item;
  });
}

module.exports = RubyInfo;
