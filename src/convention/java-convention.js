const _ = require('lodash');

const JavaInfo = {
  indent: {
    title: "Space vs. Tab",
    column: [
      { key: "tab",
        display: "Tab",
        code:
          `public String getName() {
              // use tab for indentation
              return this.name;
          }`
      }, {
        key: "space",
        display: "Space",
        code:
          `public String getName() {
            return this.name;
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
        key: "nospace",
        display: "Curlybrace with no space",
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
        key: "newline",
        display: "Curlybrace at new line",
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
    title: "Constant name is all caps?",
    column: [
      { key: "allcaps",
        display: "Constant name is all caps with underscore(_)",
        code:
          `final static String FOO_BAR = "baz";

          static final String FOO_BAR = "baz";`
      }, {
        key: "notallcaps",
        display: "Constant name is not all caps",
        code:
          `final static String foobar = "baz";

          static final String foobar = "baz";`
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
  argumentdef: {
    title: "Arguments definition with one space vs. no space",
    column: [
      { key: "onespace",
        display: "One space",
        code:
          `public void setName( String name ) {
            // ...
          }

          if( isTrue ) {}

          while( isTrue ) {}`
      }, {
        key: "nospace",
        display: "No space",
        code:
          `public void setName(String name) {
            // ...
          }

          if(isTrue) {}

          while(isTrue) {}`
      }
    ]
  },
  linelength: {
    title: "Line length is over 80 characters?",
    column: [
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
  staticvar: {
    title: "Use special prefix for staticvar",
    column: [
      { key: "prefix",
        display: "Special prefix",
        code:
          `static String _name;`
      }, {
        key: "noprefix",
        display: "No special prefix",
        code:
          `static String name`
      }
    ]
  },
  finalstaticorder: {
    title: "order for final and static",
    column: [
      { key: "accstfin",
        display: "access modifier - static - final|volatile",
        code:
          `public static final String t1 = "";

          public static transient final String t2 = "";

          transient public static final String t3 = "";`
      }, {
        key: "accfinst",
        display: "access modifier - final|volatile - static",
        code:
          `public final static String t1 = "";

          public final static transient String t2 = "";

          transient public final static String t3 = "";`
      }, {
        key: "finaccst",
        display: "final|volatile - access modifier - static",
        code:
          `final public static String t1 = "";

          final public static transient String t2 = "";

          final transient public static String t3 = "";`
      }, {
        key: "staccfin",
        display: "static - access modifier - final|volatile",
        code:
          `static public final String t1 = "";

          static public transient final String t2 = "";

          static transient public final String t3 = "";`
      }
    ]
  }
};

for (let prop in JavaInfo) {
  JavaInfo[prop].column = _.map(JavaInfo[prop].column, (item) => {
    item.code = item.code.replace(/          /gm, '');
    return item;
  });
}

module.exports = JavaInfo;
