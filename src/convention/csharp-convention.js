const _ = require('lodash');

let CsharpInfo = {
  indent: {
    title: "Space vs. Tab",
    column: [
      { key: 'tab',
        display: 'Tab',
        code:
          `public string GetSomething()
          {
            // use tab for indentation
            return something;
          }`
      }, {
        key: 'space',
        display: 'Space',
        code:
          `public string GetSomething()
          {
            return something;
          }`
      }
    ]
  },
  blockstatement: {
    title: 'How to write block statements',
    column: [
      { key: 'onespace',
        display: 'Curlybrace with one space',
        code:
          `if (height < MIN_HEIGHT) {
            //..
          }

          while (isTrue) {
            //..
          }

          switch (foo) {
            //..
          }`
      }, {
        key: 'nospace',
        display: 'Curlybrace with no space',
        code:
          `if (height < MIN_HEIGHT){
            //..
          }

          while (isTrue){
            //..
          }

          switch (foo){
            //..
          }`
      }, {
        key: 'newline',
        display: 'Curlybrace at new line',
        code:
          `if (height < MIN_HEIGHT)
          {
            //..
          }

          while (isTrue)
          {
            //..
          }

          switch (foo)
          {
            //..
          }`
       }
    ]
  },
  constant: {
    title: 'Constant name',
    column: [
      { key: 'pascal',
        display: 'Constant is Pascal cased',
        code: `const string FooBar = "baz";`
      }, {
        key: 'allcaps',
        display: 'Constant name is all caps with underscore(_)',
        code: `const string FOO_BAR = "baz";`
      }, {
        key: 'notallcaps',
        display: 'Constant name is neither all caps and pascal cased',
        code:
          `const string foo_bar = "baz";
          
          const string fooBar = "baz";`
      }
    ]
  },
  conditionstatement: {
    title: 'How to write conditional statement',
    column: [
      { key: 'onespace',
        display: 'Condition with one space',
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
        key: 'nospace',
        display: 'Condition with no space',
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
  argumentdef: {
    title: 'Arguments definition with one space vs. no space',
    column: [
      { key: 'onespace',
        display: 'One space',
        code: 
          `public void SetName( String name ) {
            // ...
          }
          
          if( isTrue ) {}
          
          while( isTrue ) {}`
      }, {
        key: 'nospace',
        display: 'No space',
        code:
          `public void SetName(String name) {
            // ...
          }
          
          if(isTrue) {}
          
          while(isTrue) {}`
      }
    ]
  },
  linelength: {
    title: 'Line length is over 80 characters?',
    column: [
      { key: 'char80',
        display: 'Line length is within 80 characters.',
        code: `/* width is within 80 characters */`
      }, {
        key: 'char120',
        display: 'Line length is within 120 characters',
        code: `/* width is within 120 characters */`
      }, {
        key: 'char150',
        display: 'Line length is within 150 characters',
        code: `/* width is within 150 characters */`
      }
    ]
  }
}

for (let prop in CsharpInfo) {
  CsharpInfo[prop].column = _.map(CsharpInfo[prop].column, (item) => {
    item.code = item.code.replace(/          /gm, '');
    return item;
  });
}

module.exports = CsharpInfo;
