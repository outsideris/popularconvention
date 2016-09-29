const _ = require('lodash');

let PhpInfo = {
  indent: {
    title: "Space vs. Tab",
    desc: [
      { key: "tab",
        display: "Tab",
        code:
          `class Foo {
              function bar($baz) {
                  // uses one tab for indentation
              }
          }`
      }, {
        key: "space",
        display: "Space",
        code:
          `class Foo {
            function bar($baz) {
              // uses spaces for indentation
            }
          }`
      }
    ]
  },
  classBrace: {
    title: "Brace Placement (Class)",
    desc: [
      { key: "newline",
        display: "Class opening/closing braces on seperate line (Allman)",
        code:
          `class Foo
          {
            // ...
          }`
      }, {
        key: "sameline",
        display: "Class structure opening/closing braces on same line as declaration (OTBS)",
        code:
          `class Foo {
            // ...
          }`
      }
    ]
  },
  controlBrace: {
    title: "Brace Placement (Control Structures)",
    desc: [
      { key: "sameline",
        display: "Control structure opening/closing braces on same line as declaration",
        code:
          `if($baz) {
            // ..
          } elseif($bar) {
            // ..
          } else {
            // ..
          }

          while ($i <= 10) {
            // ..
          }

          switch($beer) {
            // ..
          }`
      }, {
        key: "newline",
        display: "Control structure opening/closing braces on seperate line from declaration",
        code:
          `if($baz)
          {
            // ..
          }
          elseif($bar)
          {
            // ..
          }
          else
          {
            // ..
          }

          while ($i <= 10)
          {
            // ..
          }

          switch($beer)
          {
            // ..
          }`
      }
    ]
  },
  methodBrace: {
    title: "Brace Placement (Methods)",
    desc: [
      { key: "sameline",
        display: "Method structure opening braces on same line as declaration (OTBS)",
        code:
          `function bar($baz) {
            // ...
          }`
      }, {
        key: "newline",
        display: "Method opening/closing braces on seperate line (Allman)",
        code:
          `function bar($baz)
          {
            // ...
          }`
      }
    ]
  },
  spaceAroundControl: {
    title: "Space Around Control Structure Evaluation Block",
    desc: [
      { key: "space",
        display: "Space around control structure Evaluation block",
        code:
          `if ($baz) {
            // ...
          } elseif ($bar) {
            // ...
          } else {
            // ...
          }

          while ($i <= 10) {
            // ...
          }

          switch ($beer) {
            // ...
          }`
      }, {
        key: "nospace",
        display: "No space around control structure Evaluation block",
        code:
          `if($baz){
            // ...
          }elseif($bar){
            // ...
          }else{
            // ...
          }

          while($i <= 10){
            // ...
          }

          switch($beer){
            // ...
          }`
      }
    ]
  },
  spaceInsideControl: {
    title: "Space Inside Control Structure Evaluation Block",
    desc: [
      { key: "space",
        display: "Space inside control structure Evaluation block",
        code:
          `if ( $baz ) {
            // ...
          } elseif ( $bar ) {
            // ...
          }

          while ( $i <= 10 ) {
            // ...
          }

          switch ( $beer ) {
            // ...
          }`
      }, {
        key: "nospace",
        display: "No space inside control structure Evaluation block",
        code:
          `if ($baz) {
            // ...
          } elseif ($bar) {
            // ...
          }

          while ($i <= 10) {
            // ...
          }

          switch ($beer) {
            // ...
          }`
      }
    ]
  },
  spaceAroundMethod: {
    title: "Space Around Method Declaration Param Block",
    desc: [
      { key: "space",
        display: "Space around parameter declaration block",
        code:
          `function bar ($baz) {
            // ...
          }`
      }, {
        key: "nospace",
        display: "No space around parameter declaration block",
        code:
          `function bar($baz){
            // ...
          }`
      }
    ]
  },
  spaceInsideMethod: {
    title: "Space Inside Method Declaration Param Block",
    desc: [
      { key: "space",
        display: "Space inside parameter declaration block",
        code:
          `function bar( $baz ){
            // ...
          }`
      }, {
        key: "nospace",
        display: "No space inside parameter declaration block",
        code:
          `function bar($baz){
            // ...
          }`
      }
    ]
  },
  className: {
    title: "Class Names",
    desc: [
      { key: "camel",
        display: "Class Name in camelCase",
        code:
          `class fooBarBaz {
            // ...
          }`
      }, {
        key: "pascal",
        display: "Class Name in PascalCase",
        code:
          `class FooBarBaz {
            // ...
          }`
      }, {
        key: "capssnake",
        display: "Class Name in CAPS_SNAKE_CASE",
        code:
          `class FOO_BAR_BAZ {
            // ...
          }`
      }, {
        key: "snakepascal",
        display: "Class Name in Snake_Pascal_Case",
        code:
          `class Foo_Bar_Baz {
            // ...
          }`
      }, {
        key: "snake",
        display: "Class Name in snake_case",
        code:
          `class foo_bar_baz {
            // ...
          }`
      }, {
        key: "uppersnake",
        display: "Class Snake_first_letter_uppercase",
        code:
          `class Foo_bar_baz {
            // ...
          }`
      }
    ]
  },
  constName: {
    title: "Constant Names",
    desc: [
      { key: "camel",
        display: "Constant Name in camelCase",
        code:
          `const barBaz = 0;

          define('barBaz', 0);`
      }, {
        key: "pascal",
        display: "Constant Name in PascalCase",
        code:
          `const BarBaz = 0;

          define('BarBaz', 0);`
      }, {
        key: "capssnake",
        display: "Constant Name in CAPS_SNAKE_CASE",
        code:
          `const BAR_BAZ = 0;

          define('BAR_BAZ', 0);`
      }, {
        key: "snakepascal",
        display: "Constant Name in Snake_Pascal_Case",
        code:
          `const Bar_Baz = 0;

          define('Bar_Baz', 0);`
      }, {
        key: "snake",
        display: "Constant Name in snake_case",
        code:
          `const bar_baz = 0;

          define('bar_baz', 0);`
      }
    ]
  },
  functionName: {
    title: "Function Names",
    desc: [
      { key: "camel",
        display: "Function Name in camelCase",
        code:
          `function barBaz(){
            // ...
          }`
      }, {
        key: "pascal",
        display: "Function Name in PascalCase",
        code:
          `function BarBaz(){
            // ...
          }`
      }, {
        key: "capssnake",
        display: "Function Name in CAPS_SNAKE_CASE",
        code:
          `function BAR_BAZ(){
            // ...
          }`
      }, {
        key: "snakepascal",
        display: "Function Name in Snake_Pascal_Case",
        code:
          `function Bar_Baz(){
            // ...
          }`
      }, {
        key: "snake",
        display: "Function Name in snake_case",
        code:
          `function bar_baz(){
            // ...
          }`
      }
    ]
  },
  methodDeclare: {
    title: "Method Declare Order",
    desc: [
      { key: "staticlate",
        display: "static declared after visibility",
        code:
          `class Foo
          {
            public static function bar($baz)
            {
              // ...
            }
          }`
      }, {
        key: "staticfirst",
        display: "static declared before visibility",
        code:
          `class Foo
          {
            static public function bar($baz)
            {
              // ...
            }
          }`
      }, {
        key: "abstractlate",
        display: "abstract (or final) declared after visibility",
        code:
          `class Foo
          {
            public abstract function bar($baz);
            // ...
          }`
      }, {
        key: "abstractfirst",
        display: "abstract (or final) declared before visibility",
        code:
          `class Foo
          {
            abstract public function bar($baz);
            // ...
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
  }
};

for (let prop in PhpInfo) {
  PhpInfo[prop].column = _.map(PhpInfo[prop].column, (item) => {
    item.code = item.code.replace(/          /gm, '');
    return item;
  });
}

module.exports = PhpInfo;
