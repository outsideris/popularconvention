const _ = require('lodash');

const ScalaInfo = {
  indent: {
    title: "Space vs. Tab",
    desc: [
      { key: "tab",
        display: "Tab",
        code:
          `class Foo {
              // use tab for indentation
              def bar = {}
          }`
      }, {
        key: "space",
        display: "Space",
        code:
          `class Foo {
            def bar = {}
          }`
      }
    ]
  },
  linelength: {
    title: "Line length is over 80 characters?",
    desc: [
      { key: "char80",
        display: "Line length is within 80 characters.",
        code:
          `/* width is within 80 characters */`
      }, {
        key: "char120",
        display: "Line length is within 120 characters",
        code:
          `/* width is within 120 characters */`
      }, {
        key: "char150",
        display: "Line length is within 150 characters",
        code:
          `/* width is within 150 characters */`
      }
    ]
  },
  classname: {
    title: "Classes/Traits naming",
    desc: [
      { key: "capital",
        display: "CamelCase with a capital first letter",
        code:
          `class MyFairLady

          trait MyFairLady`
      }, {
        key: "nocapital",
        display: "CamelCase without a capital first letter",
        code:
          `class myFairLady

          trait myFairLady`
      }
    ]
  },
  variablename: {
    title: "Values, Variable and Methods naming",
    desc: [
      { key: "camelcase",
        display: "CamelCase with the first letter lower-case",
        code:
          `val myValue = ...

          def myMethod = ...

          var myVariable`
      }, {
        key: "noncamelcase",
        display: "CamelCase without the first letter lower-case",
        code:
          `val MyValue = ...

          def MyMethod = ...

          var MyVariable`
      }
    ]
  },
  parametertype: {
    title: "Type of Parameters Definition",
    desc: [
      { key: "tracespace",
        display: "Followed by space",
        code:
          `def add(a: Int, b: Int) = a + b`
      }, {
        key: "bothspace",
        display: "Using space in before/after",
        code:
          `def add(a : Int, b : Int) = a + b`
      }, {
        key: "nospace",
        display: "No space",
        code:
          `def add(a:Int, b:Int) = a + b`
      }
    ]
  }
};

for (let prop in ScalaInfo) {
  ScalaInfo[prop].column = _.map(ScalaInfo[prop].column, (item) => {
    item.code = item.code.replace(/          /gm, '');
    return item;
  });
}

module.exports = ScalaInfo;
