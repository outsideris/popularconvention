const expect = require('chai').expect;
const parser = require('../../src/parser/php-parser');

describe('PHP-parser >', () => {
  describe('indent >', () => {
    it('check space indent #1', () => {
      const convention = parser.indent(`function bar($baz) {`);
      expect(convention.space).equal(0);
    });

    it('check space indent #2', () => {
      const convention = parser.indent(`  function bar($baz) {`);
      expect(convention.space).equal(1);
    });

    it('check space indent #3', () => {
      const convention = parser.indent(`    function bar($baz) {`);
      expect(convention.space).equal(1);
    });

    it('check space indent #4', () => {
      const convention = parser.indent(`  \tfunction bar($baz) {`);
      expect(convention.space).equal(1);
    });

    it('check tab indent #1', () => {
      const convention = parser.indent(`\tfunction bar($baz) {`);
      expect(convention.tab).equal(1);
    });

    it('check tab indent #2', () => {
      const convention = parser.indent(`\t\tfunction bar($baz) {`);
      expect(convention.tab).equal(1);
    });

    it('check tab indent #3', () => {
      const convention = parser.indent(`\t\t  function bar($baz) {`);
      expect(convention.tab).equal(1);
    });

    it('check tab indent #4', () => {
      const convention = parser.indent(`  \tfunction bar($baz) {`);
      expect(convention.tab).equal(0);
    });

    it('check tab indent #5', () => {
      const convention = parser.indent(`function bar($baz) {`);
      expect(convention.tab).equal(0);
    });
  });

  describe('class brace placement >', () => {
    it('check class brace is in newline #1', () => {
      const convention = parser.classBrace(`class Foo`);
      expect(convention.newline).equal(1);
    });

    it('check class brace is in newline #2', () => {
      const convention = parser.classBrace(`  class  Cart `);
      expect(convention.newline).equal(1);
    });

    it('check class brace is in newline #3', () => {
      const convention = parser.classBrace(`\tclass Cart `);
      expect(convention.newline).equal(1);
    });

    it('check class brace is in newline #4', () => {
      const convention = parser.classBrace(`class Bar extends Foo `);
      expect(convention.newline).equal(1);
    });

    it('check class brace is in newline #5', () => {
      const convention = parser.classBrace(`class Cart  // {}`);
      expect(convention.newline).equal(1);
    });

    it('check class brace is in newline #6', () => {
      const convention = parser.classBrace(`class Foo {`);
      expect(convention.newline).equal(0);
    });

    it('check class brace is in same line #1', () => {
      const convention = parser.classBrace(`class Foo {`);
      expect(convention.sameline).equal(1);
    });

    it('check class brace is in same line #2', () => {
      const convention = parser.classBrace(`  class  Cart { `);
      expect(convention.sameline).equal(1);
    });

    it('check class brace is in same line #3', () => {
      const convention = parser.classBrace(`\tclass Cart {`);
      expect(convention.sameline).equal(1);
    });

    it('check class brace is in same line #4', () => {
      const convention = parser.classBrace(`class Bar extends Foo { } `);
      expect(convention.sameline).equal(1);
    });

    it('check class brace is in same line #5', () => {
      const convention = parser.classBrace(`class Cart  { // {}`);
      expect(convention.sameline).equal(1);
    });

    it('check class brace is in same line #6', () => {
      const convention = parser.classBrace(`class Cart  // {}`);
      expect(convention.sameline).equal(0);
    });
  });

  describe('control brace placement >', () => {
    it('check control brace is in same line #1', () => {
      const convention = parser.controlBrace(`if ($baz) {`);
      expect(convention.sameline).equal(1);
    });

    it('check control brace is in same line #2', () => {
      const convention = parser.controlBrace(`} else {`);
      expect(convention.sameline).equal(1);
    });

    it('check control brace is in same line #3', () => {
      const convention = parser.controlBrace(`  } elseif ($i == 1) { `);
      expect(convention.sameline).equal(1);
    });

    it('check control brace is in same line #4', () => {
      const convention = parser.controlBrace(`\twhile ($i <= 10) {`);
      expect(convention.sameline).equal(1);
    });

    it('check control brace is in same line #5', () => {
      const convention = parser.controlBrace(`  switch ($i) {  `);
      expect(convention.sameline).equal(1);
    });

    it('check control brace is in same line #6', () => {
      const convention = parser.controlBrace(`} elseif ($i == 1) `);
      expect(convention.sameline).equal(0);
    });

    it('check control brace is in same line #7', () => {
      const convention = parser.controlBrace(`while ($i <= 10):`);
      expect(convention.sameline).equal(0);
    });

    it('check control brace is in same line #8', () => {
      const convention = parser.controlBrace(`switch ($i):`);
      expect(convention.sameline).equal(0);
    });

    it('check control brace is in same line #9', () => {
      const convention = parser.controlBrace(`while ($i <= 10):`);
      expect(convention.sameline).equal(0);
    });

    it('check control brace is in new line #1', () => {
      const convention = parser.controlBrace(`  if($baz) `);
      expect(convention.newline).equal(1);
    });

    it('check control brace is in new line #2', () => {
      const convention = parser.controlBrace(`\t\t  else `);
      expect(convention.newline).equal(1);
    });

    it('check control brace is in new line #3', () => {
      const convention = parser.controlBrace(` elseif ($i == 1) `);
      expect(convention.newline).equal(1);
    });

    it('check control brace is in new line #4', () => {
      const convention = parser.controlBrace(`\t\twhile ($i <= 10) `);
      expect(convention.newline).equal(1);
    });

    it('check control brace is in new line #5', () => {
      const convention = parser.controlBrace(`switch ($i) `);
      expect(convention.newline).equal(1);
    });

    it('check control brace is in new line #6', () => {
      const convention = parser.controlBrace(`  else{`);
      expect(convention.newline).equal(0);
    });

    it('check control brace is in new line #7', () => {
      const convention = parser.controlBrace(`while ($i <= 10) :`);
      expect(convention.newline).equal(0);
    });

    it('check control brace is in new line #8', () => {
      const convention = parser.controlBrace(`switch ($i):`);
      expect(convention.newline).equal(0);
    });

    it('check control brace is in new line #9', () => {
      const convention = parser.controlBrace(`} else `);
      expect(convention.newline).equal(0);
    });
  });

  describe('method brace placement >', () => {
    it('check method brace is in same line #1', () => {
      const convention = parser.methodBrace(`function bar($baz) {`);
      expect(convention.sameline).equal(1);
    });

    it('check method brace is in same line #2', () => {
      const convention = parser.methodBrace(`  function bar($baz, $foo) { `);
      expect(convention.sameline).equal(1);
    });

    it('check method brace is in same line #3', () => {
      const convention = parser.methodBrace(`\t\tfunction foo() { `);
      expect(convention.sameline).equal(1);
    });

    it('check method brace is in same line #4', () => {
      const convention = parser.methodBrace(`function bar($baz, $foo) // {}`);
      expect(convention.sameline).equal(0);
    });

    it('check method brace is in new line #1', () => {
      const convention = parser.methodBrace(`function bar($baz)`);
      expect(convention.newline).equal(1);
    });

    it('check method brace is in new line #2', () => {
      const convention = parser.methodBrace(`  function bar($baz, $foo) `);
      expect(convention.newline).equal(1);
    });

    it('check method brace is in new line #3', () => {
      const convention = parser.methodBrace(`\t\tfunction foo()`);
      expect(convention.newline).equal(1);
    });

    it('check method brace is in new line #4', () => {
      const convention = parser.methodBrace(`function bar($baz, $foo) {`);
      expect(convention.newline).equal(0);
    });
  });

  describe('space around control statement >', () => {
    it('check space around control statement #1', () => {
      const convention = parser.spaceAroundControl(`  if ($baz) { `);
      expect(convention.space).equal(1);
    });

    it('check space around control statement #2', () => {
      const convention = parser.spaceAroundControl(`\t} elseif ($bar) { `);
      expect(convention.space).equal(1);
    });

    it('check space around control statement #3', () => {
      const convention = parser.spaceAroundControl(`if ($a > $b) :`);
      expect(convention.space).equal(1);
    });

    it('check space around control statement #4', () => {
      const convention = parser.spaceAroundControl(`   elseif ($a == $b) :`);
      expect(convention.space).equal(1);
    });

    it('check space around control statement #5', () => {
      const convention = parser.spaceAroundControl(` while ($i <= 10) {`);
      expect(convention.space).equal(1);
    });

    it('check space around control statement #6', () => {
      const convention = parser.spaceAroundControl(` while ($i <= 10) :`);
      expect(convention.space).equal(1);
    });

    it('check space around control statement #7', () => {
      const convention = parser.spaceAroundControl(`do {`);
      expect(convention.space).equal(1);
    });

    it('check space around control statement #8', () => {
      const convention = parser.spaceAroundControl(`\t\tfor ($i = 1; $i <= 10; $i++) {`);
      expect(convention.space).equal(1);
    });

    it('check space around control statement #9', () => {
      const convention = parser.spaceAroundControl(`  if($baz){ `);
      expect(convention.space).equal(0);
    });

    it('check space around control statement #10', () => {
      const convention = parser.spaceAroundControl(`\t\tfor($i = 1; $i <= 10; $i++) {`);
      expect(convention.space).equal(0);
    });

    it('check no space around control statement #1', () => {
      const convention = parser.spaceAroundControl(`if($baz){`);
      expect(convention.nospace).equal(1);
    });

    it('check no space around control statement #2', () => {
      const convention = parser.spaceAroundControl(`}elseif($bar){`);
      expect(convention.nospace).equal(1);
    });

    it('check no space around control statement #3', () => {
      const convention = parser.spaceAroundControl(`  if($a > $b):`);
      expect(convention.nospace).equal(1);
    });

    it('check no space around control statement #4', () => {
      const convention = parser.spaceAroundControl(`\t\telseif($a == $b):  `);
      expect(convention.nospace).equal(1);
    });

    it('check no space around control statement #5', () => {
      const convention = parser.spaceAroundControl(` while($i <= 10){ `);
      expect(convention.nospace).equal(1);
    });

    it('check no space around control statement #6', () => {
      const convention = parser.spaceAroundControl(` while($i <= 10):`);
      expect(convention.nospace).equal(1);
    });

    it('check no space around control statement #7', () => {
      const convention = parser.spaceAroundControl(`do{`);
      expect(convention.nospace).equal(1);
    });

    it('check no space around control statement #8', () => {
      const convention = parser.spaceAroundControl(`  for($i = 1; $i <= 10; $i++){ `);
      expect(convention.nospace).equal(1);
    });

    it('check no space around control statement #9', () => {
      const convention = parser.spaceAroundControl(`  if ($baz) { `);
      expect(convention.nospace).equal(0);
    });

    it('check no space around control statement #10', () => {
      const convention = parser.spaceAroundControl(`  for($i = 1; $i <= 10; $i++) { `);
      expect(convention.nospace).equal(0);
    });
  });

  describe('space inside control statement >', () => {
    it('check space inside control statement #1', () => {
      const convention = parser.spaceInsideControl(`  if ( $baz ) { `);
      expect(convention.space).equal(1);
    });

    it('check space inside control statement #2', () => {
      const convention = parser.spaceInsideControl(`\t\t} elseif ( $bar ) { `);
      expect(convention.space).equal(1);
    });

    it('check space inside control statement #3', () => {
      const convention = parser.spaceInsideControl(`if ( $a > $b ) :`);
      expect(convention.space).equal(1);
    });

    it('check space inside control statement #4', () => {
      const convention = parser.spaceInsideControl(` elseif ( $a == $b ) : `);
      expect(convention.space).equal(1);
    });

    it('check space inside control statement #5', () => {
      const convention = parser.spaceInsideControl(` while ( $i <= 10 ) { `);
      expect(convention.space).equal(1);
    });

    it('check space inside control statement #6', () => {
      const convention = parser.spaceInsideControl(` while ( $i <= 10 ) : `);
      expect(convention.space).equal(1);
    });

    it('check space inside control statement #7', () => {
      const convention = parser.spaceInsideControl(` for ( $i = 1; $i <= 10; $i++ ) { `);
      expect(convention.space).equal(1);
    });

    it('check space inside control statement #8', () => {
      const convention = parser.spaceInsideControl(` if ($baz) { `);
      expect(convention.space).equal(0);
    });

    it('check space inside control statement #9', () => {
      const convention = parser.spaceInsideControl(` if ($baz ) { `);
      expect(convention.space).equal(0);
    });

    it('check no space inside control statement #1', () => {
      const convention = parser.spaceInsideControl(`  if ($baz) { `);
      expect(convention.nospace).equal(1);
    });

    it('check no space inside control statement #2', () => {
      const convention = parser.spaceInsideControl(`} elseif ($bar) {`);
      expect(convention.nospace).equal(1);
    });

    it('check no space inside control statement #3', () => {
      const convention = parser.spaceInsideControl(`if ($a > $b) :`);
      expect(convention.nospace).equal(1);
    });

    it('check no space inside control statement #4', () => {
      const convention = parser.spaceInsideControl(`\t\telseif ($a == $b) :`);
      expect(convention.nospace).equal(1);
    });

    it('check no space inside control statement #5', () => {
      const convention = parser.spaceInsideControl(` while ($i <= 10) {  `);
      expect(convention.nospace).equal(1);
    });

    it('check no space inside control statement #6', () => {
      const convention = parser.spaceInsideControl(` while ($i <= 10) : `);
      expect(convention.nospace).equal(1);
    });

    it('check no space inside control statement #7', () => {
      const convention = parser.spaceInsideControl(`\t\tfor ($i = 1; $i <= 10; $i++) { `);
      expect(convention.nospace).equal(1);
    });

    it('check no space inside control statement #8', () => {
      const convention = parser.spaceInsideControl(` } elseif ( $bar ) { `);
      expect(convention.nospace).equal(0);
    });

    it('check no space inside control statement #9', () => {
      const convention = parser.spaceInsideControl(` } elseif ( $bar) { `);
      expect(convention.nospace).equal(0);
    });
  });

  describe('space around method params >', () => {
    it('check space around method params #1', () => {
      const convention = parser.spaceAroundMethod(`function bar ($baz) {`);
      expect(convention.space).equal(1);
    });

    it('check space around method params #2', () => {
      const convention = parser.spaceAroundMethod(`  function bar ($baz, $foo) { `);
      expect(convention.space).equal(1);
    });

    it('check space around method params #3', () => {
      const convention = parser.spaceAroundMethod(`\t\tfunction foo () { `);
      expect(convention.space).equal(1);
    });

    it('check space around method params #4', () => {
      const convention = parser.spaceAroundMethod(`function bar ($baz, $foo) // {`);
      expect(convention.space).equal(0);
    });

    it('check space around method params #5', () => {
      const convention = parser.spaceAroundMethod(`function bar($baz) {`);
      expect(convention.space).equal(0);
    });

    it('check space around method params #6', () => {
      const convention = parser.spaceAroundMethod(`function bar($baz){`);
      expect(convention.space).equal(0);
    });

    it('check no space around method params #1', () => {
      const convention = parser.spaceAroundMethod(`function bar($baz){`);
      expect(convention.nospace).equal(1);
    });

    it('check no space around method params #2', () => {
      const convention = parser.spaceAroundMethod(`  function bar($baz, $foo){ `);
      expect(convention.nospace).equal(1);
    });

    it('check no space around method params #3', () => {
      const convention = parser.spaceAroundMethod(`\t\tfunction foo(){ `);
      expect(convention.nospace).equal(1);
    });

    it('check no space around method params #4', () => {
      const convention = parser.spaceAroundMethod(`  function bar($baz, $foo)//{`);
      expect(convention.nospace).equal(0);
    });

    it('check no space around method params #5', () => {
      const convention = parser.spaceAroundMethod(`function bar ($baz) {`);
      expect(convention.nospace).equal(0);
    });

    it('check no space around method params #6', () => {
      const convention = parser.spaceAroundMethod(`function bar ($baz){`);
      expect(convention.nospace).equal(0);
    });
  });

  describe('space inside method params >', () => {
    it('check space inside method params #1', () => {
      const convention = parser.spaceInsideMethod(`function bar ( $baz ) {`);
      expect(convention.space).equal(1);
    });

    it('check space inside method params #2', () => {
      const convention = parser.spaceInsideMethod(`  function bar ( $baz, $foo ) { `);
      expect(convention.space).equal(1);
    });

    it('check space inside method params #3', () => {
      const convention = parser.spaceInsideMethod(`\t\tfunction bar( $baz, $foo ){ `);
      expect(convention.space).equal(1);
    });

    it('check space inside method params #4', () => {
      const convention = parser.spaceInsideMethod(`function foo () {`);
      expect(convention.space).equal(0);
    });

    it('check space inside method params #5', () => {
      const convention = parser.spaceInsideMethod(`function bar ($baz ) {`);
      expect(convention.space).equal(0);
    });

    it('check space inside method params #6', () => {
      const convention = parser.spaceInsideMethod(`function bar ($baz) {`);
      expect(convention.space).equal(0);
    });

    it('check no space inside method params #1', () => {
      const convention = parser.spaceInsideMethod(`function bar ($baz) {`);
      expect(convention.nospace).equal(1);
    });

    it('check no space inside method params #2', () => {
      const convention = parser.spaceInsideMethod(`  function bar ($baz, $foo) { `);
      expect(convention.nospace).equal(1);
    });

    it('check no space inside method params #3', () => {
      const convention = parser.spaceInsideMethod(`\t\tfunction bar($baz, $foo){ `);
      expect(convention.nospace).equal(1);
    });

    it('check no space inside method params #4', () => {
      const convention = parser.spaceInsideMethod(` function foo () {`);
      expect(convention.nospace).equal(0);
    });

    it('check no space inside method params #5', () => {
      const convention = parser.spaceInsideMethod(`  function bar ($baz ) { `);
      expect(convention.nospace).equal(0);
    });

    it('check no space inside method params #6', () => {
      const convention = parser.spaceInsideMethod(`function bar( $baz, $foo ){`);
      expect(convention.nospace).equal(0);
    });
  });

  describe('class naming >', () => {
    it('check whether class name in camel case #1', () => {
      const convention = parser.className(`  class fooBarBaz { `);
      expect(convention.camel).equal(1);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(0);
      expect(convention.uppersnake).equal(0);
    });

    it('check whether class name in camel case #2', () => {
      const convention = parser.className(`\t\tclass fooBarBaz2{ `);
      expect(convention.camel).equal(1);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(0);
      expect(convention.uppersnake).equal(0);
    });

    it('check whether class name in camel case #3', () => {
      const convention = parser.className(`class fooBar1Baz`);
      expect(convention.camel).equal(1);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(0);
      expect(convention.uppersnake).equal(0);
    });

    it('check whether class name in pascal case #1', () => {
      const convention = parser.className(`  class FooBarBaz { `);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(1);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(0);
      expect(convention.uppersnake).equal(0);
    });

    it('check whether class name in pascal case #2', () => {
      const convention = parser.className(`\t\tclass FooBarBaz1{ `);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(1);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(0);
      expect(convention.uppersnake).equal(0);
    });

    it('check whether class name in pascal case #3', () => {
      const convention = parser.className(` class FooBar1Baz`);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(1);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(0);
      expect(convention.uppersnake).equal(0);
    });

    it('check whether class name in caps snake case #1', () => {
      const convention = parser.className(` class FOO_BAR_BAZ { `);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(1);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(0);
      expect(convention.uppersnake).equal(0);
    });

    it('check whether class name in caps snake case #2', () => {
      const convention = parser.className(`\t\tclass FOO_BAR_BAZ2{ `);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(1);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(0);
      expect(convention.uppersnake).equal(0);
    });

    it('check whether class name in caps snake case #3', () => {
      const convention = parser.className(` class FOO_BAR1_BAZ`);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(1);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(0);
      expect(convention.uppersnake).equal(0);
    });

    it('check whether class name in snake pascal case #1', () => {
      const convention = parser.className(`  class Foo_Bar_Baz { `);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(1);
      expect(convention.snake).equal(0);
      expect(convention.uppersnake).equal(0);
    });

    it('check whether class name in snake pascal case #2', () => {
      const convention = parser.className(`\t\tclass Foo_Bar_Baz1{ `);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(1);
      expect(convention.snake).equal(0);
      expect(convention.uppersnake).equal(0);
    });

    it('check whether class name in snake pascal case #3', () => {
      const convention = parser.className(`  class Foo_Bar2_Baz`);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(1);
      expect(convention.snake).equal(0);
      expect(convention.uppersnake).equal(0);
    });

    it('check whether class name in snake case #1', () => {
      const convention = parser.className(`  class foo_bar_baz { `);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(1);
      expect(convention.uppersnake).equal(0);
    });

    it('check whether class name in snake case #2', () => {
      const convention = parser.className(`\t\tclass foo_bar_baz2{ `);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(1);
      expect(convention.uppersnake).equal(0);
    });

    it('check whether class name in snake case #3', () => {
      const convention = parser.className(`  class foo_bar1_baz`);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(1);
      expect(convention.uppersnake).equal(0);
    });

    it('check whether class name in uppercase snake case #1', () => {
      const convention = parser.className(`  class Foo_bar_baz {`);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(0);
      expect(convention.uppersnake).equal(1);
    });

    it('check whether class name in uppercase snake case #2', () => {
      const convention = parser.className(`\t\tclass Foo_bar1_baz2{ `);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(0);
      expect(convention.uppersnake).equal(1);
    });

    it('check whether class name in uppercase snake case #3', () => {
      const convention = parser.className(`  class Foo_bar1_baz2`);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(0);
      expect(convention.uppersnake).equal(1);
    });

    it('all rules ingnore this #1', () => {
      const convention = parser.className(`  class _Foo_bar_baz { `);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(0);
      expect(convention.uppersnake).equal(0);
    });

    it('all rules ingnore this #2', () => {
      const convention = parser.className(`  class Foo_bar_baz_{ `);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(0);
      expect(convention.uppersnake).equal(0);
    });

    it('all rules ingnore this #3', () => {
      const convention = parser.className(`  class Foo_BAR_baz {  `);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(0);
      expect(convention.uppersnake).equal(0);
    });

    it('all rules ingnore this #4', () => {
      const convention = parser.className(` class Foo_bar_Baz {  `);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(0);
      expect(convention.uppersnake).equal(0);
    });

    it('all rules ingnore this #5', () => {
      const convention = parser.className(`class foo_BAR_Baz { `);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(0);
      expect(convention.uppersnake).equal(0);
    });

    it('all rules ingnore this #6', () => {
      const convention = parser.className(` class foo_BAR_baz { `);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(0);
      expect(convention.uppersnake).equal(0);
    });

    it('all rules ingnore this #7', () => {
      const convention = parser.className(`class foo_BarBaz { `);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(0);
      expect(convention.uppersnake).equal(0);
    });

    it('all rules ingnore this #8', () => {
      const convention = parser.className(`class fooBARBaz {`);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(0);
      expect(convention.uppersnake).equal(0);
    });

    it('all rules ingnore this #9', () => {
      const convention = parser.className(`class foo {`);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(0);
      expect(convention.uppersnake).equal(0);
    });

    it('all rules ingnore this #10', () => {
      const convention = parser.className(`class FOO {`);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(0);
      expect(convention.uppersnake).equal(0);
    });

    it('all rules ingnore this #11', () => {
      const convention = parser.className(`class Foo {`);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(0);
      expect(convention.uppersnake).equal(0);
    });
  });

  describe('const naming >', () => {
    it('check whether const name in camel case #1', () => {
      const convention = parser.constName(`  const fooBarBaz = 0; `);
      expect(convention.camel).equal(1);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(0);
    });

    it('check whether const name in camel case #2', () => {
      const convention = parser.constName(`\t\tconst fooBarBaz2=0; `);
      expect(convention.camel).equal(1);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(0);
    });

    it('check whether const name in camel case #3', () => {
      const convention = parser.constName(`const fooBar1Baz = 0 ;`);
      expect(convention.camel).equal(1);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(0);
    });

    it('check whether const name in camel case #4', () => {
      const convention = parser.constName(`define('barBaz', 0);`);
      expect(convention.camel).equal(1);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(0);
    });

    it('check whether const name in pascal case #1', () => {
      const convention = parser.constName(`  const FooBarBaz = 0;  `);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(1);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(0);
    });

    it('check whether const name in pascal case #2', () => {
      const convention = parser.constName(`\t\tconst FooBarBaz1=0; `);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(1);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(0);
    });

    it('check whether const name in pascal case #3', () => {
      const convention = parser.constName(` const FooBar1Baz = 0;`);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(1);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(0);
    });

    it('check whether const name in pascal case #4', () => {
      const convention = parser.constName(`define('BarBaz', 0);`);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(1);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(0);
    });

    it('check whether const name in caps snake case #1', () => {
      const convention = parser.constName(` const FOO_BAR_BAZ = 0; `);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(1);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(0);
    });

    it('check whether const name in caps snake case #2', () => {
      const convention = parser.constName(`\t\tconst FOO_BAR_BAZ2=0; `);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(1);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(0);
    });

    it('check whether const name in caps snake case #3', () => {
      const convention = parser.constName(` const FOO_BAR1_BAZ = 0;`);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(1);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(0);
    });

    it('check whether const name in caps snake case #4', () => {
      const convention = parser.constName(`define("BAR_BAZ", 0);`);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(1);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(0);
    });

    it('check whether const name in snake pascal case #1', () => {
      const convention = parser.constName(`  const Foo_Bar_Baz = 0; `);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(1);
      expect(convention.snake).equal(0);
    });

    it('check whether const name in snake pascal case #2', () => {
      const convention = parser.constName(`\t\tconst Foo_Bar_Baz1=0; `);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(1);
      expect(convention.snake).equal(0);
    });

    it('check whether const name in snake pascal case #3', () => {
      const convention = parser.constName(`  const Foo_Bar2_Baz=0;`);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(1);
      expect(convention.snake).equal(0);
    });

    it('check whether const name in snake pascal case #4', () => {
      const convention = parser.constName(` define("Bar_Baz", 0); `);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(1);
      expect(convention.snake).equal(0);
    });

    it('check whether const name in snake case #1', () => {
      const convention = parser.constName(`  const foo_bar_baz = 0; `);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(1);
    });

    it('check whether const name in snake case #2', () => {
      const convention = parser.constName(`\t\tconst foo_bar_baz2=0; `);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(1);
    });

    it('check whether const name in snake case #3', () => {
      const convention = parser.constName(`  const foo_bar1_baz = 0;`);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(1);
    });

    it('check whether const name in snake case #4', () => {
      const convention = parser.constName(`\t\tdefine('bar_baz', 0);  `);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(1);
    });

    it('all rules ingnore this #1', () => {
      const convention = parser.constName(`  const _Foo_bar_baz = 0;  `);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(0);
    });

    it('all rules ingnore this #2', () => {
      const convention = parser.constName(`  const Foo_bar_baz_=0; `);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(0);
    });

    it('all rules ingnore this #3', () => {
      const convention = parser.constName(`  const Foo_BAR_baz = 0;   `);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(0);
    });

    it('all rules ingnore this #4', () => {
      const convention = parser.constName(` const Foo_bar_Baz = 0;   `);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(0);
    });

    it('all rules ingnore this #5', () => {
      const convention = parser.constName(`const foo_BAR_Baz  = 0; `);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(0);
    });

    it('all rules ingnore this #6', () => {
      const convention = parser.constName(` const foo_BAR_baz = 0; `);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(0);
    });

    it('all rules ingnore this #7', () => {
      const convention = parser.constName(`const foo_BarBaz = 0; `);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(0);
    });

    it('all rules ingnore this #8', () => {
      const convention = parser.constName(`const fooBARBaz = 0;`);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(0);
    });

    it('all rules ingnore this #9', () => {
      const convention = parser.constName(`const foo = 0;`);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(0);
    });

    it('all rules ingnore this #10', () => {
      const convention = parser.constName(`const FOO = 0;`);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(0);
    });

    it('all rules ingnore this #11', () => {
      const convention = parser.constName(`const Foo = 0;`);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(0);
    });

    it('all rules ingnore this #12', () => {
      const convention = parser.constName(`define("bar", 0);`);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(0);
    });

    it('all rules ingnore this #13', () => {
      const convention = parser.constName(`define("barBAR", 0);`);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(0);
    });

    it('all rules ingnore this #14', () => {
      const convention = parser.constName(`define("barBARBaz", 0);`);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(0);
    });
  });

  describe('function naming >', () => {
    it('check whether function name in camel case #1', () => {
      const convention = parser.functionName(`function barBaz(){`);
      expect(convention.camel).equal(1);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(0);
    });

    it('check whether function name in camel case #2', () => {
      const convention = parser.functionName(`\t\tfunction barBaz(){`);
      expect(convention.camel).equal(1);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(0);
    });

    it('check whether function name in camel case #3', () => {
      const convention = parser.functionName(`  public function barBaz(){ `);
      expect(convention.camel).equal(1);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(0);
    });

    it('check whether function name in pascal case #1', () => {
      const convention = parser.functionName(`function BarBaz(){`);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(1);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(0);
    });

    it('check whether function name in pascal case #2', () => {
      const convention = parser.functionName(`\t\tfunction BarBaz(){`);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(1);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(0);
    });

    it('check whether function name in pascal case #3', () => {
      const convention = parser.functionName(`  public function BarBaz(){`);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(1);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(0);
    });

    it('check whether function name in caps snake case #1', () => {
      const convention = parser.functionName(`function BAR_BAZ(){`);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(1);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(0);
    });

    it('check whether function name in caps snake case #2', () => {
      const convention = parser.functionName(`\t\tfunction BAR_BAZ(){`);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(1);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(0);
    });

    it('check whether function name in caps snake case #3', () => {
      const convention = parser.functionName(`public function BAR_BAZ(){`);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(1);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(0);
    });

    it('check whether function name in snake pascal case #1', () => {
      const convention = parser.functionName(`function Bar_Baz(){`);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(1);
      expect(convention.snake).equal(0);
    });

    it('check whether function name in snake pascal case #2', () => {
      const convention = parser.functionName(`\t\tfunction Bar_Baz(){`);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(1);
      expect(convention.snake).equal(0);
    });

    it('check whether function name in snake pascal case #3', () => {
      const convention = parser.functionName(`public function Bar_Baz(){`);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(1);
      expect(convention.snake).equal(0);
    });

    it('check whether function name in snake case #1', () => {
      const convention = parser.functionName(`function bar_baz(){`);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(1);
    });

    it('check whether function name in snake case #2', () => {
      const convention = parser.functionName(`\t\tfunction bar_baz(){`);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(1);
    });

    it('check whether function name in snake case #3', () => {
      const convention = parser.functionName(`public function bar_baz(){`);
      expect(convention.camel).equal(0);
      expect(convention.pascal).equal(0);
      expect(convention.capssnake).equal(0);
      expect(convention.snakepascal).equal(0);
      expect(convention.snake).equal(1);
    });
  });

  describe('method declare order >', () => {
    it('check visibility - static case #1', () => {
      const convention = parser.methodDeclare(`  public static function bar($baz) `);
      expect(convention.staticlate).equal(1);
    });

    it('check visibility - static case #2', () => {
      const convention = parser.methodDeclare(`\t\tprotected static $my_static = 'foo'; `);
      expect(convention.staticlate).equal(1);
    });

    it('check visibility - static case #3', () => {
      const convention = parser.methodDeclare(`private static $my_static = 'foo'; `);
      expect(convention.staticlate).equal(1);
    });

    it('check visibility - static case #4', () => {
      const convention = parser.methodDeclare(` static public function bar($baz)  `);
      expect(convention.staticlate).equal(0);
    });

    it('check static - visibility case #1', () => {
      const convention = parser.methodDeclare(` static public function bar($baz)  `);
      expect(convention.staticfirst).equal(1);
    });

    it('check static - visibility case #2', () => {
      const convention = parser.methodDeclare(`\t\tstatic protected $my_static = 'foo'; `);
      expect(convention.staticfirst).equal(1);
    });

    it('check static - visibility case #3', () => {
      const convention = parser.methodDeclare(` static private $my_static = 'foo'; `);
      expect(convention.staticfirst).equal(1);
    });

    it('check static - visibility case #4', () => {
      const convention = parser.methodDeclare(`protected static $my_static = 'foo';`);
      expect(convention.staticfirst).equal(0);
    });

    it('check visibility - abstract(final) case #1', () => {
      const convention = parser.methodDeclare(`  public abstract function bar($baz); `);
      expect(convention.abstractlate).equal(1);
    });

    it('check visibility - abstract(final) case #2', () => {
      const convention = parser.methodDeclare(`\t\tprotected abstract function getValue(); `);
      expect(convention.abstractlate).equal(1);
    });

    it('check visibility - abstract(final) case #3', () => {
      const convention = parser.methodDeclare(`private abstract function getValue();`);
      expect(convention.abstractlate).equal(1);
    });

    it('check visibility - abstract(final) case #4', () => {
      const convention = parser.methodDeclare(`  private final function getValue(); `);
      expect(convention.abstractlate).equal(1);
    });

    it('check visibility - abstract(final) case #5', () => {
      const convention = parser.methodDeclare(` abstract public function bar($baz); `);
      expect(convention.abstractlate).equal(0);
    });

    it('check abstract(final) - visibility case #1', () => {
      const convention = parser.methodDeclare(`  abstract public function bar($baz); `);
      expect(convention.abstractfirst).equal(1);
    });

    it('check abstract(final) - visibility case #2', () => {
      const convention = parser.methodDeclare(`\t\tabstract protected function getValue(); `);
      expect(convention.abstractfirst).equal(1);
    });

    it('check abstract(final) - visibility case #3', () => {
      const convention = parser.methodDeclare(`abstract private function getValue();`);
      expect(convention.abstractfirst).equal(1);
    });

    it('check abstract(final) - visibility case #4', () => {
      const convention = parser.methodDeclare(`  final private function getValue(); `);
      expect(convention.abstractfirst).equal(1);
    });

    it('check abstract(final) - visibility case #5', () => {
      const convention = parser.methodDeclare(`  protected abstract function getValue(); `);
      expect(convention.abstractfirst).equal(0);
    });
  });
});
