const _ = require('lodash');

const PythonInfo = {
  indent: {
    title: "Space vs. Tab",
    desc: [
      { key: "tab",
        display: "Tab",
        code:
          `def long_function_name(var_one):
              # use tab for indentation
              print(var_one)`
      }, {
        key: "space",
        display: "Space",
        code:
          `def long_function_name(var_one):
              print(var_one)`
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
  imports: {
    title: "Imports on separate lines",
    desc: [
      { key: "separated",
        display: "Imports on separate lines",
        code:
          `import os
          import sys`
      }, {
        key: "noseparated",
        display: "Import on non-separate lines",
        code:
          `import sys, os`
      }
    ]
  },
  whitespace: {
    title: "Whitespace in Expressions and Statements",
    desc: [
      { key: "noextra",
        display: "Avoiding extraneous whitespace",
        code:
          `spam(ham[1], {eggs: 2})

          if x == 4: print x, y; x, y = y, x

          spam(1)

          dict['key'] = list[index]

          x = 1
          y = 2
          long_variable = 3`
      }, {
        key: "extra",
        display: "Using extraneous whitespace",
        code:
          `spam( ham[ 1 ], { eggs: 2 } )

          if x == 4 : print x , y ; x , y = y , x

          spam (1)

          dict ['key'] = list [index]

          x             = 1
          y             = 2
          long_variable = 3`
      }
    ]
  }
};

for (let prop in PythonInfo) {
  PythonInfo[prop].column = _.map(PythonInfo[prop].column, (item) => {
    item.code = item.code.replace(/          /gm, '');
    return item;
  });
}

module.exports = PythonInfo;
