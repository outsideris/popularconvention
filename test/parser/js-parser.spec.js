const expect = require('chai').expect;
const parser = require('../../src/parser/js-parser');

describe('JS-parser >', () => {
  describe('comma >', () => {
    it('check first comma #1', () => {
      let convention = parser.comma(`,fs = require('fs')`);
      expect(convention.first).equal(1);
    });

    it('check first comma #2', () => {
      let convention = parser.comma(`  ,fs = require('fs')`);
      expect(convention.first).equal(1);
    });
    
    it('check first comma #3', () => {
      let convention = parser.comma(`  fs = , require('fs'),`);
      expect(convention.first).equal(0);
    });
    
    it('check first comma #4', () => {
      let convention = parser.comma(`  , fs = require('fs')`);
      expect(convention.first).equal(1);
    });
    
    it('check last comma #1', () => {
      let convention = parser.comma(`fs = require('fs'),`);
      expect(convention.last).equal(1);
    });
    
    it('check last comma #2', () => {
      let convention = parser.comma(`  fs = require('fs'),`);
      expect(convention.last).equal(1);
    });
    
    it('check last comma #3', () => {
      let convention = parser.comma(`  fs = require('fs'),  `);
      expect(convention.last).equal(1);
    });
    
    it('check last comma #4', () => {
      let convention = parser.comma(` ,fs = ,require('fs'),`);
      expect(convention.last).equal(1);
    });
  });

  describe('indent >', () => {
    it('check space indent #1', () => {
      let convention = parser.indent(`var a = 1;`);
      expect(convention.space).equal(0);
    });
    
    it('check space indent #2', () => {
      let convention = parser.indent(`  var a = 1;`);
      expect(convention.space).equal(1);
    });
    
    it('check space indent #3', () => {
      let convention = parser.indent(` var a = 1;`);
      expect(convention.space).equal(1);
    });
    
    it('check space indent #4', () => {
      let convention = parser.indent(`   var a = 1;`);
      expect(convention.space).equal(1);
    });
    
    it('check tab indent #1', () => {
      let convention = parser.indent(`\tvar a = 1;`);
      expect(convention.tab).equal(1);
    });
    
    it('check tab indent #2', () => {
      let convention = parser.indent(`\t\tvar a = 1;`);
      expect(convention.tab).equal(1);
    });
    
    it('check tab indent #3', () => {
      let convention = parser.indent(`\t\t  var a = 1;  `);
      expect(convention.tab).equal(1);
    });
    
    it('check tab indent #4', () => {
      let convention = parser.indent(`  \tvar a = 1;`);
      expect(convention.tab).equal(0);
    });
    
    it('check tab indent #5', () => {
      let convention = parser.indent(`var a = 1;`);
      expect(convention.tab).equal(0);
    });
  });

  describe('functiondef >', () => {
    it('check function definition followed by no space #1', () => {
      let convention = parser.functiondef(`var a = function() {`);
      expect(convention.nospace).equal(1);
    });
    
    it('check function definition followed by no space #2', () => {
      let convention = parser.functiondef(`var a = function() { return 1; };`);
      expect(convention.nospace).equal(1);
    });
    
    it('check function definition followed by no space #3', () => {
      let convention = parser.functiondef(`function a() {}`);
      expect(convention.nospace).equal(1);
    });
    
    it('check function definition followed by no space #4', () => {
      let convention = parser.functiondef(`a.fn(function() {})`);
      expect(convention.nospace).equal(1);
    });
    
    it('check function definition followed by no space #5', () => {
      let convention = parser.functiondef(`a.fn(function () {})`);
      expect(convention.nospace).equal(0);
    });
    
    it('check function definition followed by one space #1', () => {
      let convention = parser.functiondef(`var a = function () { return 1; };`);
      expect(convention.onespace).equal(1);
    });
    
    it('check function definition followed by one space #2', () => {
      let convention = parser.functiondef(`function a () {}`);
      expect(convention.onespace).equal(1);
    });
    
    it('check function definition followed by one space #3', () => {
      let convention = parser.functiondef(`a.fn(function () {})`);
      expect(convention.onespace).equal(1);
    });
    
    it('check function definition followed by one space #4', () => {
      let convention = parser.functiondef(`a.fn(function() {})`);
      expect(convention.onespace).equal(0);
    });
  });

  describe('argumentdef  >', () => {
    it('check argument definition with one space #1', () => {
      let convention = parser.argumentdef(`function a( arg1, arg2 ) {}`);
      expect(convention.onespace).equal(1);
    });
    
    it('check argument definition with one space #2', () => {
      let convention = parser.argumentdef(`function a ( arg1, arg2 ) {}`);
      expect(convention.onespace).equal(1);
    });
    
    it('check argument definition with one space #3', () => {
      let convention = parser.argumentdef(`a.fn(function( arg1, arg2 ) {})`);
      expect(convention.onespace).equal(1);
    });
    
    it('check argument definition with one space #4', () => {
      let convention = parser.argumentdef(`a.fn(function (arg1, arg2) {})`);
      expect(convention.onespace).equal(0);
    });
    
    it('check argument definition with no space #1', () => {
      let convention = parser.argumentdef(`var a = function(arg1, arg2) {`);
      expect(convention.nospace).equal(1);
    });
    
    it('check argument definition with no space #2', () => {
      let convention = parser.argumentdef(`var a = function (arg1, arg2) { return 1; };`);
      expect(convention.nospace).equal(1);
    });
    
    it('check argument definition with no space #3', () => {
      let convention = parser.argumentdef(`function a(arg1, arg2 ) {}`);
      expect(convention.nospace).equal(1);
    });
    
    it('check argument definition with no space #4', () => {
      let convention = parser.argumentdef(`a.fn(function (arg1, arg2) {})`);
      expect(convention.nospace).equal(1);
    });
    
    it('check argument definition with no space #5', () => {
      let convention = parser.argumentdef(`function a ( arg1, arg2 ) {}`);
      expect(convention.nospace).equal(0);
    });
   
    it('check argument definition with no space #6', () => {
      let convention = parser.argumentdef(`       }//if                                               -`);
      expect(convention.nospace).equal(0);
      expect(convention.onespace).equal(0);
    });
  });
  
  describe('literaldef >', () => {
    it('check object literal definition with trace space #1', () => {
      let convention = parser.literaldef(`  init: "value",`);
      expect(convention.tracespace).equal(1);
    });
    
    it('check object literal definition with trace space #2', () => {
      let convention = parser.literaldef(` init: function() { `);
      expect(convention.tracespace).equal(1);
    });
    
    it('check object literal definition with trace space #3', () => {
      let convention = parser.literaldef(`{ key: value, key: value }`);
      expect(convention.tracespace).equal(1);
    });
    
    it('check object literal definition with trace space #4', () => {
      let convention = parser.literaldef(` init : function() { `);
      expect(convention.tracespace).equal(0);
    });
    
    it('check object literal definition with both space #1', () => {
      let convention = parser.literaldef(`  init : "value",`);
      expect(convention.bothspace).equal(1);
    });
    
    it('check object literal definition with both space #2', () => {
      let convention = parser.literaldef(` init : function() { `);
      expect(convention.bothspace).equal(1);
    });
    
    it('check object literal definition with both space #3', () => {
      let convention = parser.literaldef(`{ key : value, key: value }`);
      expect(convention.bothspace).equal(1);
    });
    
    it('check object literal definition with both space #4', () => {
      let convention = parser.literaldef(` init: function() { `);
      expect(convention.bothspace).equal(0);
    });
    
    it('check object literal definition with no space #1', () => {
      let convention = parser.literaldef(`  init:"value",`);
      expect(convention.nospace).equal(1);
    });
    
    it('check object literal definition with no space #2', () => {
      let convention = parser.literaldef(` init:function() { `);
      expect(convention.nospace).equal(1);
    });
    
    it('check object literal definition with no space #3', () => {
      let convention = parser.literaldef(`{ key:value, key: value }`);
      expect(convention.nospace).equal(1);
    });
    
    it('check object literal definition with no space #4', () => {
      let convention = parser.literaldef(` init :function() { `);
      expect(convention.nospace).equal(0);
    });
  });

  describe('conditionstatement  >', () => {
    it('check condition statement with one space #1', () => {
      let convention = parser.conditionstatement(`if ( a = 1) {`);
      expect(convention.onespace).equal(1);
    });
    
    it('check condition statement with one space #2', () => {
      let convention = parser.conditionstatement(`while ( ture ) {`);
      expect(convention.onespace).equal(1);
    });
    
    it('check condition statement with one space #3', () => {
      let convention = parser.conditionstatement(`switch ( a ) {`);
      expect(convention.onespace).equal(1);
    });
    
    it('check condition statement with one space #4', () => {
      let convention = parser.conditionstatement(`if( a = 1) {`);
      expect(convention.onespace).equal(0);
    });
    
    it('check condition statement with no space #1', () => {
      let convention = parser.conditionstatement(`if( a = 1) {`);
      expect(convention.nospace).equal(1);
    });
    
    it('check condition statement with no space #2', () => {
      let convention = parser.conditionstatement(`while( ture ) {`);
      expect(convention.nospace).equal(1);
    });
    
    it('check condition statement with no space #3', () => {
      let convention = parser.conditionstatement(`switch( a ) {`);
      expect(convention.nospace).equal(1);
    });
    
    it('check condition statement with no space #4', () => {
      let convention = parser.conditionstatement(`if ( a = 1) {`);
      expect(convention.nospace).equal(0);
    });
  });
  
  describe('blockstatement >', () => {
    it('check block statement with one space #1', () => {
      let convention = parser.blockstatement(`if (true) { return; }`);
      expect(convention.onespace).equal(1);
    });
    
    it('check block statement with one space #2', () => {
      let convention = parser.blockstatement(`} else if ( true ) {`);
      expect(convention.onespace).equal(1);
    });
    
    it('check block statement with one space #3', () => {
      let convention = parser.blockstatement(`} else if ( true ) {`);
      expect(convention.onespace).equal(1);
    });
    
    it('check block statement with one space #4', () => {
      let convention = parser.blockstatement(`else if (true) {`);
      expect(convention.onespace).equal(1);
    });
    
    it('check block statement with one space #5', () => {
      let convention = parser.blockstatement(`if (true){ return; }`);
      expect(convention.onespace).equal(0);
    });
    
    it('check block statement with no space #1', () => {
      let convention = parser.blockstatement(`if (true){ return (); }`);
      expect(convention.nospace).equal(1);
    });
    
    it('check block statement with no space #2', () => {
      let convention = parser.blockstatement(`}else if (true){`);
      expect(convention.nospace).equal(1);
    });
    
    it('check block statement with no space #3', () => {
      let convention = parser.blockstatement(`if (true)`);
      expect(convention.nospace).equal(0);
    });
    
    it('check block statement with no space #4', () => {
      let convention = parser.blockstatement(`} else if(true) {`);
      expect(convention.nospace).equal(0);
    });
    
    it('check block statement at new line #1', () => {
      let convention = parser.blockstatement(`if (true)`);
      expect(convention.newline).equal(1);
    });
    
    it('check block statement at new line #2', () => {
      let convention = parser.blockstatement(`if (true) // comment`);
      expect(convention.newline).equal(1);
    });
    
    it('check block statement at new line #3', () => {
      let convention = parser.blockstatement(`if (true)/* */`);
      expect(convention.newline).equal(1);
    });
    
    it('check block statement at new line #4', () => {
      let convention = parser.blockstatement(`else if (true)`);
      expect(convention.newline).equal(1);
    });
    
    it('check block statement at new line #5', () => {
      let convention = parser.blockstatement(`else if (true) {`);
      expect(convention.newline).equal(1);
    });
    
    it('check block statement at new line #6', () => {
      let convention = parser.blockstatement(`}  else if ( true ) {`);
      expect(convention.newline).equal(0);
    });
  });
  
  describe('linelength >', () => {
    it('line length is 80 characters #1', () => {
      let convention = parser.linelength(`    public String findFirstName( String name, String age) { return \"a\"; }`);
      expect(convention.char80).equal(1);
    });
    
    it('line length is 80 characters #2', () => {
      let convention = parser.linelength(`\t\tpublic String findFirstName( String name, String age) { return \"a\"; }`);
      expect(convention.char80).equal(1);
    });
    
    it('line length is 80 characters #3', () => {
      let convention = parser.linelength(`\t\t\tpublic String findFirstName( String name, String age) { return \"a\"; }`);
      expect(convention.char80).equal(0);
    });
    
    it('line length is 120 characters #1', () => {
      let convention = parser.linelength(`    public String findFirstName( String name, String age, String job) { return \"a\"; }`);
      expect(convention.char120).equal(1);
    });
    
    it('line length is 120 characters #2', () => {
      let convention = parser.linelength(`\t\tpublic String findFirstName( String name, String age, String job) { return \"a\"; }`);
      expect(convention.char120).equal(1);
    });
    
    it('line length is 120 characters #3', () => {
      let convention = parser.linelength(`\t\tpublic String findFirstName( String name, String age) { return \"a\"; }`);
      expect(convention.char120).equal(0);
    });
    
    it('line length is 150 characters #1', () => {
      let convention = parser.linelength(`    public String findFirstName( String name, String age, String job) { return \"a\"; } //afijfjeovjfiejffjeifjidjvosjfiejfioejovfjeifjiejfosjfioejfoiejfoi`);
      expect(convention.char150).equal(1);
    });
  });
  
  describe('quotes >', () => {
    it('single quote #1', () => {
      let convention = parser.quotes(`  var foo = 'bar';`);
      expect(convention.single).equal(1);
    });
    
    it('single quote #2', () => {
      let convention = parser.quotes(`  var foo = '<div id="bar">baz</div>';`);
      expect(convention.single).equal(1);
    });
    
    it('single quote #3', () => {
      let convention = parser.quotes(`  var foo = '<div id=\'bar\'>baz</div>';`);
      expect(convention.single).equal(1);
    });
    
    it('single quote #4', () => {
      let convention = parser.quotes(` 'key': 'value' `);
      expect(convention.single).equal(1);
    });
    
    it('single quote #5', () => {
      let convention = parser.quotes(` 'key': true `);
      expect(convention.single).equal(1);
    });
    
    it('single quote #6', () => {
      let convention = parser.quotes(`  var foo = "bar";`);
      expect(convention.single).equal(0);
    });
    
    it('single quote #7', () => {
      let convention = parser.quotes(`  var foo = "<div id='bar'>baz</div>";`);
      expect(convention.single).equal(0);
    });
    
    it('single quote #8', () => {
      let convention = parser.quotes(` 'key': "value" `);
      expect(convention.single).equal(0);
    });
    
    it('double quotes #1', () => {
      let convention = parser.quotes(`  var foo = "bar";`);
      expect(convention.double).equal(1);
    });
    
    it('double quotes #2', () => {
      let convention = parser.quotes(`  var foo = "<div id='bar'>baz</div>";`);
      expect(convention.double).equal(1);
    });
    
    it('double quotes #3', () => {
      let convention = parser.quotes(`  var foo = "<div id=\"bar\">baz</div>";`);
      expect(convention.double).equal(1);
    });
    
    it('double quotes #4', () => {
      let convention = parser.quotes(` "key": "value" `);
      expect(convention.double).equal(1);
    });
    
    it('double quotes #5', () => {
      let convention = parser.quotes(` "key": true `);
      expect(convention.double).equal(1);
    });
    
    it('double quotes #6', () => {
      let convention = parser.quotes(`  var foo = 'bar';`);
      expect(convention.double).equal(0);
    });
    
    it('double quotes #7', () => {
      let convention = parser.quotes(`  var foo = '<div id="bar">baz</div>';`);
      expect(convention.double).equal(0);
    });
    
    it('double quotes #8', () => {
      let convention = parser.quotes(` 'key': "value" `);
      expect(convention.double).equal(0);
    });
  });
});
    
