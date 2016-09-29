const _ = require('lodash');

const JsInfo = {
  comma: {
    title: "Last comma vs. First comma",
    desc: [
      { key: "first",
        display: "First comma",
        code:
          `var foo = 1
            , bar = 2
            , baz = 3;

          var obj = {
              foo: 1
            , bar: 2
            , baz: 3
          };`
      }, {
        key: "last",
        display: "Last comma",
        code:
          `var foo = 1,
              bar = 2,
              baz = 3;

          var obj = {
              foo: 1,
              bar: 2,
              baz: 3
          };`
      }
    ]
  },
  indent: {
    title: "Space vs. Tab",
    column: [
      { key: "tab",
        display: "Tab",
        code:
          `function foo() {
              // use tab for indentation
              return "bar";
          }`
      }, {
        key: "space",
        display: "Space",
        code:
          `function foo() {
            return "bar";
          }`
      }
    ]
  },
  functiondef: {
    title: "Function followed by one space vs. Function followed by no space",
    column: [
      { key: "onespace",
        display: "One space",
        code:
          `function foo () {
            return "bar";
          }`
      }, {
        key: "nospace",
        display: "No space",
        code:
          `function foo() {
            return "bar";
          }`
      }
    ]
  },
  argumentdef: {
    title: "Arguments definition with one space vs. no space",
    column: [
      { key: "onespace",
        display: "One space",
        code:
          `function fn( arg1, arg2 ) {
            // ...
          }

          // or

          if ( true ) {
            // ...
          }`
      }, {
        key: "nospace",
        display: "No space",
        code:
          `function fn(arg1, arg2) {
          }

          // or

          if (true) {
          }`
      }
    ],
  },
  literaldef: {
    title: "Object Literal Definition types",
    column: [
      { key: "tracespace",
        display: "Followed by space",
        code:
          `{
            foo: 1,
            bar: 2,
            baz: 3
          }`
      }, {
        key: "bothspace",
        display: "Using space in before/after",
        code:
          `{
            foo : 1,
            bar : 2,
            baz : 3
          }`
      }, {
        key: "nospace",
        display: "No space",
        code:
          `{
            foo:1,
            bar:2,
            baz:3
          }`
      }
    ]
  },
  conditionstatement: {
    title: "How to write conditional statement",
    column: [
      { key: "onespace",
        display: "Condition with one space",
        code:
          `if (true) {
            //...
          }

          while (true) {
            //...
          }

          switch (v) {
            //...
          }`
      }, {
        key: "nospace",
        display: "Condition with no space",
        code:
          `if(true) {
            //...
          }

          while(true) {
            //...
          }

          switch(v) {
            //...
          }`
      }
    ]
  },
  blockstatement: {
    title: "How to write block statement",
    column: [
      { key: "onespace",
        display: "Curlybrace with one space",
        code:
          `if (true) {
            // ...
          }

          while (true) {
            // ...
          }

          switch (v) {
            // ...
          }`
      }, {
        key: "nospace",
        display: "Curlybrace with no space",
        code:
          `if (true){
            // ...
          }

          while (true){
            // ...
          }

          switch (v){
            // ...
          }`
      }, {
        key: "newline",
        display: "Curlybrace at new line",
        code:
          `if (true)
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
          }`
      }
    ]
  },
  linelength: {
    title: "Line length is over 80 characters?",
    column: [
      { key: "char80",
        display: "Line length is within 80 characters.",
        code: `/* width is within 80 characters */`
      }, {
        key: "char120",
        display: "Line length is within 120 characters",
        code: `/* width is within 120 characters */`
      }, {
        key: "char150",
        display: "Line length is within 150 characters",
        code: `/* width is within 150 characters */`
      }
    ]
  },
  quotes: {
    title: "Single quote vs double quotes",
    column: [
      { key: "singleQuote",
        display: "Single quote",
        code:
          `var foo = 'bar';

          var obj = { 'foo': 'bar'};`
      }, {
        key: "doubleQuote",
        display: "Double quotes",
        code:
          `var foo = "bar";

          var obj = { "foo": "bar"};`
      }
    ]
  }
};

for (let prop in JsInfo) {
  JsInfo[prop].column = _.map(JsInfo[prop].column, (item) => {
    item.code = item.code.replace(/          /gm, '');
    return item;
  });
}

module.exports = JsInfo;
