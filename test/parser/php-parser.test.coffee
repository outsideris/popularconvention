# Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
# Licensed under the MIT license.
# <http://outsider.mit-license.org/>

should = require 'should'
parser = require '../../src/parser/php-parser'

describe 'php-parser >', ->

  describe 'indent >', ->

    it 'check space indent #1', ->
      convention = parser.indent 'function bar($baz) {', {}
      convention.indent.space.should.equal 0

    it 'check space indent #2', ->
      convention = parser.indent '  function bar($baz) {', {}
      convention.indent.space.should.equal 1

    it 'check space indent #3', ->
      convention = parser.indent '    function bar($baz) {', {}
      convention.indent.space.should.equal 1

    it 'check space indent #4', ->
      convention = parser.indent '  \tfunction bar($baz) {', {}
      convention.indent.space.should.equal 1

    it 'check tab indent #1', ->
      convention = parser.indent '\tfunction bar($baz) {', {}
      convention.indent.tab.should.equal 1

    it 'check tab indent #2', ->
      convention = parser.indent '\t\tfunction bar($baz) {', {}
      convention.indent.tab.should.equal 1

    it 'check tab indent #3', ->
      convention = parser.indent '\t\t  function bar($baz) {', {}
      convention.indent.tab.should.equal 1

    it 'check tab indent #4', ->
      convention = parser.indent '  \tfunction bar($baz) {', {}
      convention.indent.tab.should.equal 0

    it 'check tab indent #5', ->
      convention = parser.indent 'function bar($baz) {', {}
      convention.indent.tab.should.equal 0

  describe 'class brace placement >', ->

    it 'check class brace is in newline #1', ->
      convention = parser.classBrace 'class Foo', {}
      convention.classBrace.newline.should.equal 1

    it 'check class brace is in newline #2', ->
      convention = parser.classBrace '  class  Cart ', {}
      convention.classBrace.newline.should.equal 1

    it 'check class brace is in newline #3', ->
      convention = parser.classBrace '\tclass Cart ', {}
      convention.classBrace.newline.should.equal 1

    it 'check class brace is in newline #4', ->
      convention = parser.classBrace 'class Bar extends Foo ', {}
      convention.classBrace.newline.should.equal 1

    it 'check class brace is in newline #5', ->
      convention = parser.classBrace 'class Cart  // {}', {}
      convention.classBrace.newline.should.equal 1

    it 'check class brace is in newline #6', ->
      convention = parser.classBrace 'class Foo {', {}
      convention.classBrace.newline.should.equal 0

    it 'check class brace is in same line #1', ->
      convention = parser.classBrace 'class Foo {', {}
      convention.classBrace.sameline.should.equal 1

    it 'check class brace is in same line #2', ->
      convention = parser.classBrace '  class  Cart { ', {}
      convention.classBrace.sameline.should.equal 1

    it 'check class brace is in same line #3', ->
      convention = parser.classBrace '\tclass Cart {', {}
      convention.classBrace.sameline.should.equal 1

    it 'check class brace is in same line #4', ->
      convention = parser.classBrace 'class Bar extends Foo { } ', {}
      convention.classBrace.sameline.should.equal 1

    it 'check class brace is in same line #5', ->
      convention = parser.classBrace 'class Cart  { // {}', {}
      convention.classBrace.sameline.should.equal 1

    it 'check class brace is in same line #6', ->
      convention = parser.classBrace 'class Cart  // {}', {}
      convention.classBrace.sameline.should.equal 0

  describe 'control brace placement >', ->

    it 'check control brace is in same line #1', ->
      convention = parser.controlBrace 'if ($baz) {', {}
      convention.controlBrace.sameline.should.equal 1

    it 'check control brace is in same line #2', ->
      convention = parser.controlBrace '} else {', {}
      convention.controlBrace.sameline.should.equal 1

    it 'check control brace is in same line #3', ->
      convention = parser.controlBrace '  } elseif ($i == 1) { ', {}
      convention.controlBrace.sameline.should.equal 1

    it 'check control brace is in same line #4', ->
      convention = parser.controlBrace '\twhile ($i <= 10) {', {}
      convention.controlBrace.sameline.should.equal 1

    it 'check control brace is in same line #5', ->
      convention = parser.controlBrace '  switch ($i) {  ', {}
      convention.controlBrace.sameline.should.equal 1

    it 'check control brace is in same line #6', ->
      convention = parser.controlBrace '} elseif ($i == 1) ', {}
      convention.controlBrace.sameline.should.equal 0

    it 'check control brace is in same line #7', ->
      convention = parser.controlBrace 'while ($i <= 10):', {}
      convention.controlBrace.sameline.should.equal 0

    it 'check control brace is in same line #8', ->
      convention = parser.controlBrace 'switch ($i):', {}
      convention.controlBrace.sameline.should.equal 0

    it 'check control brace is in same line #9', ->
      convention = parser.controlBrace 'while ($i <= 10):', {}
      convention.controlBrace.sameline.should.equal 0

    it 'check control brace is in new line #1', ->
      convention = parser.controlBrace '  if($baz) ', {}
      convention.controlBrace.newline.should.equal 1

    it 'check control brace is in new line #2', ->
      convention = parser.controlBrace '\t\t  else ', {}
      convention.controlBrace.newline.should.equal 1

    it 'check control brace is in new line #3', ->
      convention = parser.controlBrace ' elseif ($i == 1) ', {}
      convention.controlBrace.newline.should.equal 1

    it 'check control brace is in new line #4', ->
      convention = parser.controlBrace '\t\twhile ($i <= 10) ', {}
      convention.controlBrace.newline.should.equal 1

    it 'check control brace is in new line #5', ->
      convention = parser.controlBrace 'switch ($i) ', {}
      convention.controlBrace.newline.should.equal 1

    it 'check control brace is in new line #6', ->
      convention = parser.controlBrace '  else{', {}
      convention.controlBrace.newline.should.equal 0

    it 'check control brace is in new line #7', ->
      convention = parser.controlBrace 'while ($i <= 10) :', {}
      convention.controlBrace.newline.should.equal 0

    it 'check control brace is in new line #8', ->
      convention = parser.controlBrace 'switch ($i):', {}
      convention.controlBrace.newline.should.equal 0

    it 'check control brace is in new line #9', ->
      convention = parser.controlBrace '} else ', {}
      convention.controlBrace.newline.should.equal 0

  describe 'method brace placement >', ->

    it 'check method brace is in same line #1', ->
      convention = parser.methodBrace 'function bar($baz) {', {}
      convention.methodBrace.sameline.should.equal 1

    it 'check method brace is in same line #2', ->
      convention = parser.methodBrace '  function bar($baz, $foo) { ', {}
      convention.methodBrace.sameline.should.equal 1

    it 'check method brace is in same line #3', ->
      convention = parser.methodBrace '\t\tfunction foo() { ', {}
      convention.methodBrace.sameline.should.equal 1

    it 'check method brace is in same line #4', ->
      convention = parser.methodBrace 'function bar($baz, $foo) // {}', {}
      convention.methodBrace.sameline.should.equal 0

    it 'check method brace is in new line #1', ->
      convention = parser.methodBrace 'function bar($baz)', {}
      convention.methodBrace.newline.should.equal 1

    it 'check method brace is in new line #2', ->
      convention = parser.methodBrace '  function bar($baz, $foo) ', {}
      convention.methodBrace.newline.should.equal 1

    it 'check method brace is in new line #3', ->
      convention = parser.methodBrace '\t\tfunction foo()', {}
      convention.methodBrace.newline.should.equal 1

    it 'check method brace is in new line #4', ->
      convention = parser.methodBrace 'function bar($baz, $foo) {', {}
      convention.methodBrace.newline.should.equal 0

  describe 'space around control statement >', ->

    it 'check space around control statement #1', ->
      convention = parser.spaceAroundControl '  if ($baz) { ', {}
      convention.spaceAroundControl.space.should.equal 1

    it 'check space around control statement #2', ->
      convention = parser.spaceAroundControl '\t} elseif ($bar) { ', {}
      convention.spaceAroundControl.space.should.equal 1

    it 'check space around control statement #3', ->
      convention = parser.spaceAroundControl 'if ($a > $b) :', {}
      convention.spaceAroundControl.space.should.equal 1

    it 'check space around control statement #4', ->
      convention = parser.spaceAroundControl '   elseif ($a == $b) :', {}
      convention.spaceAroundControl.space.should.equal 1

    it 'check space around control statement #5', ->
      convention = parser.spaceAroundControl ' while ($i <= 10) {', {}
      convention.spaceAroundControl.space.should.equal 1

    it 'check space around control statement #6', ->
      convention = parser.spaceAroundControl ' while ($i <= 10) :', {}
      convention.spaceAroundControl.space.should.equal 1

    it 'check space around control statement #7', ->
      convention = parser.spaceAroundControl 'do {', {}
      convention.spaceAroundControl.space.should.equal 1

    it 'check space around control statement #8', ->
      convention = parser.spaceAroundControl '\t\tfor ($i = 1; $i <= 10; $i++) {', {}
      convention.spaceAroundControl.space.should.equal 1

    it 'check space around control statement #9', ->
      convention = parser.spaceAroundControl '  if($baz){ ', {}
      convention.spaceAroundControl.space.should.equal 0

    it 'check space around control statement #10', ->
      convention = parser.spaceAroundControl '\t\tfor($i = 1; $i <= 10; $i++) {', {}
      convention.spaceAroundControl.space.should.equal 0

    it 'check no space around control statement #1', ->
      convention = parser.spaceAroundControl 'if($baz){', {}
      convention.spaceAroundControl.nospace.should.equal 1

    it 'check no space around control statement #2', ->
      convention = parser.spaceAroundControl '}elseif($bar){', {}
      convention.spaceAroundControl.nospace.should.equal 1

    it 'check no space around control statement #3', ->
      convention = parser.spaceAroundControl '  if($a > $b):', {}
      convention.spaceAroundControl.nospace.should.equal 1

    it 'check no space around control statement #4', ->
      convention = parser.spaceAroundControl '\t\telseif($a == $b):  ', {}
      convention.spaceAroundControl.nospace.should.equal 1

    it 'check no space around control statement #5', ->
      convention = parser.spaceAroundControl ' while($i <= 10){ ', {}
      convention.spaceAroundControl.nospace.should.equal 1

    it 'check no space around control statement #6', ->
      convention = parser.spaceAroundControl ' while($i <= 10):', {}
      convention.spaceAroundControl.nospace.should.equal 1

    it 'check no space around control statement #7', ->
      convention = parser.spaceAroundControl 'do{', {}
      convention.spaceAroundControl.nospace.should.equal 1

    it 'check no space around control statement #8', ->
      convention = parser.spaceAroundControl '  for($i = 1; $i <= 10; $i++){ ', {}
      convention.spaceAroundControl.nospace.should.equal 1

    it 'check no space around control statement #9', ->
      convention = parser.spaceAroundControl '  if ($baz) { ', {}
      convention.spaceAroundControl.nospace.should.equal 0

    it 'check no space around control statement #10', ->
      convention = parser.spaceAroundControl '  for($i = 1; $i <= 10; $i++) { ', {}
      convention.spaceAroundControl.nospace.should.equal 0

  describe 'space inside control statement >', ->

    it 'check space inside control statement #1', ->
      convention = parser.spaceInsideControl '  if ( $baz ) { ', {}
      convention.spaceInsideControl.space.should.equal 1

    it 'check space inside control statement #2', ->
      convention = parser.spaceInsideControl '\t\t} elseif ( $bar ) { ', {}
      convention.spaceInsideControl.space.should.equal 1

    it 'check space inside control statement #3', ->
      convention = parser.spaceInsideControl 'if ( $a > $b ) :', {}
      convention.spaceInsideControl.space.should.equal 1

    it 'check space inside control statement #4', ->
      convention = parser.spaceInsideControl ' elseif ( $a == $b ) : ', {}
      convention.spaceInsideControl.space.should.equal 1

    it 'check space inside control statement #5', ->
      convention = parser.spaceInsideControl ' while ( $i <= 10 ) { ', {}
      convention.spaceInsideControl.space.should.equal 1

    it 'check space inside control statement #6', ->
      convention = parser.spaceInsideControl ' while ( $i <= 10 ) : ', {}
      convention.spaceInsideControl.space.should.equal 1

    it 'check space inside control statement #7', ->
      convention = parser.spaceInsideControl ' for ( $i = 1; $i <= 10; $i++ ) { ', {}
      convention.spaceInsideControl.space.should.equal 1

    it 'check space inside control statement #8', ->
      convention = parser.spaceInsideControl ' if ($baz) { ', {}
      convention.spaceInsideControl.space.should.equal 0

    it 'check space inside control statement #9', ->
      convention = parser.spaceInsideControl ' if ($baz ) { ', {}
      convention.spaceInsideControl.space.should.equal 0

    it 'check no space inside control statement #1', ->
      convention = parser.spaceInsideControl '  if ($baz) { ', {}
      convention.spaceInsideControl.nospace.should.equal 1

    it 'check no space inside control statement #2', ->
      convention = parser.spaceInsideControl '} elseif ($bar) {', {}
      convention.spaceInsideControl.nospace.should.equal 1

    it 'check no space inside control statement #3', ->
      convention = parser.spaceInsideControl 'if ($a > $b) :', {}
      convention.spaceInsideControl.nospace.should.equal 1

    it 'check no space inside control statement #4', ->
      convention = parser.spaceInsideControl '\t\telseif ($a == $b) :', {}
      convention.spaceInsideControl.nospace.should.equal 1

    it 'check no space inside control statement #5', ->
      convention = parser.spaceInsideControl ' while ($i <= 10) {  ', {}
      convention.spaceInsideControl.nospace.should.equal 1

    it 'check no space inside control statement #6', ->
      convention = parser.spaceInsideControl ' while ($i <= 10) : ', {}
      convention.spaceInsideControl.nospace.should.equal 1

    it 'check no space inside control statement #7', ->
      convention = parser.spaceInsideControl '\t\tfor ($i = 1; $i <= 10; $i++) { ', {}
      convention.spaceInsideControl.nospace.should.equal 1

    it 'check no space inside control statement #8', ->
      convention = parser.spaceInsideControl ' } elseif ( $bar ) { ', {}
      convention.spaceInsideControl.nospace.should.equal 0

    it 'check no space inside control statement #9', ->
      convention = parser.spaceInsideControl ' } elseif ( $bar) { ', {}
      convention.spaceInsideControl.nospace.should.equal 0

  describe 'space around method params >', ->

    it 'check space around method params #1', ->
      convention = parser.spaceAroundMethod 'function bar ($baz) {', {}
      convention.spaceAroundMethod.space.should.equal 1

    it 'check space around method params #2', ->
      convention = parser.spaceAroundMethod '  function bar ($baz, $foo) { ', {}
      convention.spaceAroundMethod.space.should.equal 1

    it 'check space around method params #3', ->
      convention = parser.spaceAroundMethod '\t\tfunction foo () { ', {}
      convention.spaceAroundMethod.space.should.equal 1

    it 'check space around method params #4', ->
      convention = parser.spaceAroundMethod 'function bar ($baz, $foo) // {', {}
      convention.spaceAroundMethod.space.should.equal 0

    it 'check space around method params #5', ->
      convention = parser.spaceAroundMethod 'function bar($baz) {', {}
      convention.spaceAroundMethod.space.should.equal 0

    it 'check space around method params #6', ->
      convention = parser.spaceAroundMethod 'function bar($baz){', {}
      convention.spaceAroundMethod.space.should.equal 0

    it 'check no space around method params #1', ->
      convention = parser.spaceAroundMethod 'function bar($baz){', {}
      convention.spaceAroundMethod.nospace.should.equal 1

    it 'check no space around method params #2', ->
      convention = parser.spaceAroundMethod '  function bar($baz, $foo){ ', {}
      convention.spaceAroundMethod.nospace.should.equal 1

    it 'check no space around method params #3', ->
      convention = parser.spaceAroundMethod '\t\tfunction foo(){ ', {}
      convention.spaceAroundMethod.nospace.should.equal 1

    it 'check no space around method params #4', ->
      convention = parser.spaceAroundMethod '  function bar($baz, $foo)//{', {}
      convention.spaceAroundMethod.nospace.should.equal 0

    it 'check no space around method params #5', ->
      convention = parser.spaceAroundMethod 'function bar ($baz) {', {}
      convention.spaceAroundMethod.nospace.should.equal 0

    it 'check no space around method params #6', ->
      convention = parser.spaceAroundMethod 'function bar ($baz){', {}
      convention.spaceAroundMethod.nospace.should.equal 0

  describe 'space inside method params >', ->

    it 'check space inside method params #1', ->
      convention = parser.spaceInsideMethod 'function bar ( $baz ) {', {}
      convention.spaceInsideMethod.space.should.equal 1

    it 'check space inside method params #2', ->
      convention = parser.spaceInsideMethod '  function bar ( $baz, $foo ) { ', {}
      convention.spaceInsideMethod.space.should.equal 1

    it 'check space inside method params #3', ->
      convention = parser.spaceInsideMethod '\t\tfunction bar( $baz, $foo ){ ', {}
      convention.spaceInsideMethod.space.should.equal 1

    it 'check space inside method params #4', ->
      convention = parser.spaceInsideMethod 'function foo () {', {}
      convention.spaceInsideMethod.space.should.equal 0

    it 'check space inside method params #5', ->
      convention = parser.spaceInsideMethod 'function bar ($baz ) {', {}
      convention.spaceInsideMethod.space.should.equal 0

    it 'check space inside method params #6', ->
      convention = parser.spaceInsideMethod 'function bar ($baz) {', {}
      convention.spaceInsideMethod.space.should.equal 0

    it 'check no space inside method params #1', ->
      convention = parser.spaceInsideMethod 'function bar ($baz) {', {}
      convention.spaceInsideMethod.nospace.should.equal 1

    it 'check no space inside method params #2', ->
      convention = parser.spaceInsideMethod '  function bar ($baz, $foo) { ', {}
      convention.spaceInsideMethod.nospace.should.equal 1

    it 'check no space inside method params #3', ->
      convention = parser.spaceInsideMethod '\t\tfunction bar($baz, $foo){ ', {}
      convention.spaceInsideMethod.nospace.should.equal 1

    it 'check no space inside method params #4', ->
      convention = parser.spaceInsideMethod ' function foo () {', {}
      convention.spaceInsideMethod.nospace.should.equal 0

    it 'check no space inside method params #5', ->
      convention = parser.spaceInsideMethod '  function bar ($baz ) { ', {}
      convention.spaceInsideMethod.nospace.should.equal 0

    it 'check no space inside method params #6', ->
      convention = parser.spaceInsideMethod 'function bar( $baz, $foo ){', {}
      convention.spaceInsideMethod.nospace.should.equal 0

  describe 'class naming >', ->

    it 'check whether class name in camel case #1', ->
      convention = parser.className '  class fooBarBaz { ', {}
      convention.className.camel.should.equal 1
      convention.className.pascal.should.equal 0
      convention.className.capssnake.should.equal 0
      convention.className.snakepascal.should.equal 0
      convention.className.snake.should.equal 0
      convention.className.uppersnake.should.equal 0

    it 'check whether class name in camel case #2', ->
      convention = parser.className '\t\tclass fooBarBaz2{ ', {}
      convention.className.camel.should.equal 1
      convention.className.pascal.should.equal 0
      convention.className.capssnake.should.equal 0
      convention.className.snakepascal.should.equal 0
      convention.className.snake.should.equal 0
      convention.className.uppersnake.should.equal 0

    it 'check whether class name in camel case #3', ->
      convention = parser.className 'class fooBar1Baz', {}
      convention.className.camel.should.equal 1
      convention.className.pascal.should.equal 0
      convention.className.capssnake.should.equal 0
      convention.className.snakepascal.should.equal 0
      convention.className.snake.should.equal 0
      convention.className.uppersnake.should.equal 0

    it 'check whether class name in pascal case #1', ->
      convention = parser.className '  class FooBarBaz { ', {}
      convention.className.camel.should.equal 0
      convention.className.pascal.should.equal 1
      convention.className.capssnake.should.equal 0
      convention.className.snakepascal.should.equal 0
      convention.className.snake.should.equal 0
      convention.className.uppersnake.should.equal 0

    it 'check whether class name in pascal case #2', ->
      convention = parser.className '\t\tclass FooBarBaz1{ ', {}
      convention.className.camel.should.equal 0
      convention.className.pascal.should.equal 1
      convention.className.capssnake.should.equal 0
      convention.className.snakepascal.should.equal 0
      convention.className.snake.should.equal 0
      convention.className.uppersnake.should.equal 0

    it 'check whether class name in pascal case #3', ->
      convention = parser.className ' class FooBar1Baz', {}
      convention.className.camel.should.equal 0
      convention.className.pascal.should.equal 1
      convention.className.capssnake.should.equal 0
      convention.className.snakepascal.should.equal 0
      convention.className.snake.should.equal 0
      convention.className.uppersnake.should.equal 0

    it 'check whether class name in caps snake case #1', ->
      convention = parser.className ' class FOO_BAR_BAZ { ', {}
      convention.className.camel.should.equal 0
      convention.className.pascal.should.equal 0
      convention.className.capssnake.should.equal 1
      convention.className.snakepascal.should.equal 0
      convention.className.snake.should.equal 0
      convention.className.uppersnake.should.equal 0

    it 'check whether class name in caps snake case #2', ->
      convention = parser.className '\t\tclass FOO_BAR_BAZ2{ ', {}
      convention.className.camel.should.equal 0
      convention.className.pascal.should.equal 0
      convention.className.capssnake.should.equal 1
      convention.className.snakepascal.should.equal 0
      convention.className.snake.should.equal 0
      convention.className.uppersnake.should.equal 0

    it 'check whether class name in caps snake case #3', ->
      convention = parser.className ' class FOO_BAR1_BAZ', {}
      convention.className.camel.should.equal 0
      convention.className.pascal.should.equal 0
      convention.className.capssnake.should.equal 1
      convention.className.snakepascal.should.equal 0
      convention.className.snake.should.equal 0
      convention.className.uppersnake.should.equal 0

    it 'check whether class name in snake pascal case #1', ->
      convention = parser.className '  class Foo_Bar_Baz { ', {}
      convention.className.camel.should.equal 0
      convention.className.pascal.should.equal 0
      convention.className.capssnake.should.equal 0
      convention.className.snakepascal.should.equal 1
      convention.className.snake.should.equal 0
      convention.className.uppersnake.should.equal 0

    it 'check whether class name in snake pascal case #2', ->
      convention = parser.className '\t\tclass Foo_Bar_Baz1{ ', {}
      convention.className.camel.should.equal 0
      convention.className.pascal.should.equal 0
      convention.className.capssnake.should.equal 0
      convention.className.snakepascal.should.equal 1
      convention.className.snake.should.equal 0
      convention.className.uppersnake.should.equal 0

    it 'check whether class name in snake pascal case #3', ->
      convention = parser.className '  class Foo_Bar2_Baz', {}
      convention.className.camel.should.equal 0
      convention.className.pascal.should.equal 0
      convention.className.capssnake.should.equal 0
      convention.className.snakepascal.should.equal 1
      convention.className.snake.should.equal 0
      convention.className.uppersnake.should.equal 0

    it 'check whether class name in snake case #1', ->
      convention = parser.className '  class foo_bar_baz { ', {}
      convention.className.camel.should.equal 0
      convention.className.pascal.should.equal 0
      convention.className.capssnake.should.equal 0
      convention.className.snakepascal.should.equal 0
      convention.className.snake.should.equal 1
      convention.className.uppersnake.should.equal 0

    it 'check whether class name in snake case #2', ->
      convention = parser.className '\t\tclass foo_bar_baz2{ ', {}
      convention.className.camel.should.equal 0
      convention.className.pascal.should.equal 0
      convention.className.capssnake.should.equal 0
      convention.className.snakepascal.should.equal 0
      convention.className.snake.should.equal 1
      convention.className.uppersnake.should.equal 0

    it 'check whether class name in snake case #3', ->
      convention = parser.className '  class foo_bar1_baz', {}
      convention.className.camel.should.equal 0
      convention.className.pascal.should.equal 0
      convention.className.capssnake.should.equal 0
      convention.className.snakepascal.should.equal 0
      convention.className.snake.should.equal 1
      convention.className.uppersnake.should.equal 0

    it 'check whether class name in uppercase snake case #1', ->
      convention = parser.className '  class Foo_bar_baz {', {}
      convention.className.camel.should.equal 0
      convention.className.pascal.should.equal 0
      convention.className.capssnake.should.equal 0
      convention.className.snakepascal.should.equal 0
      convention.className.snake.should.equal 0
      convention.className.uppersnake.should.equal 1

    it 'check whether class name in uppercase snake case #2', ->
      convention = parser.className '\t\tclass Foo_bar1_baz2{ ', {}
      convention.className.camel.should.equal 0
      convention.className.pascal.should.equal 0
      convention.className.capssnake.should.equal 0
      convention.className.snakepascal.should.equal 0
      convention.className.snake.should.equal 0
      convention.className.uppersnake.should.equal 1

    it 'check whether class name in uppercase snake case #3', ->
      convention = parser.className '  class Foo_bar1_baz2', {}
      convention.className.camel.should.equal 0
      convention.className.pascal.should.equal 0
      convention.className.capssnake.should.equal 0
      convention.className.snakepascal.should.equal 0
      convention.className.snake.should.equal 0
      convention.className.uppersnake.should.equal 1

    it 'all rules ingnore this #1', ->
      convention = parser.className '  class _Foo_bar_baz { ', {}
      convention.className.camel.should.equal 0
      convention.className.pascal.should.equal 0
      convention.className.capssnake.should.equal 0
      convention.className.snakepascal.should.equal 0
      convention.className.snake.should.equal 0
      convention.className.uppersnake.should.equal 0

    it 'all rules ingnore this #2', ->
      convention = parser.className '  class Foo_bar_baz_{ ', {}
      convention.className.camel.should.equal 0
      convention.className.pascal.should.equal 0
      convention.className.capssnake.should.equal 0
      convention.className.snakepascal.should.equal 0
      convention.className.snake.should.equal 0
      convention.className.uppersnake.should.equal 0

    it 'all rules ingnore this #3', ->
      convention = parser.className '  class Foo_BAR_baz {  ', {}
      convention.className.camel.should.equal 0
      convention.className.pascal.should.equal 0
      convention.className.capssnake.should.equal 0
      convention.className.snakepascal.should.equal 0
      convention.className.snake.should.equal 0
      convention.className.uppersnake.should.equal 0

    it 'all rules ingnore this #4', ->
      convention = parser.className ' class Foo_bar_Baz {  ', {}
      convention.className.camel.should.equal 0
      convention.className.pascal.should.equal 0
      convention.className.capssnake.should.equal 0
      convention.className.snakepascal.should.equal 0
      convention.className.snake.should.equal 0
      convention.className.uppersnake.should.equal 0

    it 'all rules ingnore this #5', ->
      convention = parser.className 'class foo_BAR_Baz { ', {}
      convention.className.camel.should.equal 0
      convention.className.pascal.should.equal 0
      convention.className.capssnake.should.equal 0
      convention.className.snakepascal.should.equal 0
      convention.className.snake.should.equal 0
      convention.className.uppersnake.should.equal 0

    it 'all rules ingnore this #6', ->
      convention = parser.className ' class foo_BAR_baz { ', {}
      convention.className.camel.should.equal 0
      convention.className.pascal.should.equal 0
      convention.className.capssnake.should.equal 0
      convention.className.snakepascal.should.equal 0
      convention.className.snake.should.equal 0
      convention.className.uppersnake.should.equal 0

    it 'all rules ingnore this #7', ->
      convention = parser.className 'class foo_BarBaz { ', {}
      convention.className.camel.should.equal 0
      convention.className.pascal.should.equal 0
      convention.className.capssnake.should.equal 0
      convention.className.snakepascal.should.equal 0
      convention.className.snake.should.equal 0
      convention.className.uppersnake.should.equal 0

    it 'all rules ingnore this #8', ->
      convention = parser.className 'class fooBARBaz {', {}
      convention.className.camel.should.equal 0
      convention.className.pascal.should.equal 0
      convention.className.capssnake.should.equal 0
      convention.className.snakepascal.should.equal 0
      convention.className.snake.should.equal 0
      convention.className.uppersnake.should.equal 0

    it 'all rules ingnore this #9', ->
      convention = parser.className 'class foo {', {}
      convention.className.camel.should.equal 0
      convention.className.pascal.should.equal 0
      convention.className.capssnake.should.equal 0
      convention.className.snakepascal.should.equal 0
      convention.className.snake.should.equal 0
      convention.className.uppersnake.should.equal 0

    it 'all rules ingnore this #10', ->
      convention = parser.className 'class FOO {', {}
      convention.className.camel.should.equal 0
      convention.className.pascal.should.equal 0
      convention.className.capssnake.should.equal 0
      convention.className.snakepascal.should.equal 0
      convention.className.snake.should.equal 0
      convention.className.uppersnake.should.equal 0

    it 'all rules ingnore this #11', ->
      convention = parser.className 'class Foo {', {}
      convention.className.camel.should.equal 0
      convention.className.pascal.should.equal 0
      convention.className.capssnake.should.equal 0
      convention.className.snakepascal.should.equal 0
      convention.className.snake.should.equal 0
      convention.className.uppersnake.should.equal 0

  describe 'const naming >', ->

    it 'check whether const name in camel case #1', ->
      convention = parser.constName '  const fooBarBaz = 0; ', {}
      convention.constName.camel.should.equal 1
      convention.constName.pascal.should.equal 0
      convention.constName.capssnake.should.equal 0
      convention.constName.snakepascal.should.equal 0
      convention.constName.snake.should.equal 0

    it 'check whether const name in camel case #2', ->
      convention = parser.constName '\t\tconst fooBarBaz2=0; ', {}
      convention.constName.camel.should.equal 1
      convention.constName.pascal.should.equal 0
      convention.constName.capssnake.should.equal 0
      convention.constName.snakepascal.should.equal 0
      convention.constName.snake.should.equal 0

    it 'check whether const name in camel case #3', ->
      convention = parser.constName 'const fooBar1Baz = 0 ;', {}
      convention.constName.camel.should.equal 1
      convention.constName.pascal.should.equal 0
      convention.constName.capssnake.should.equal 0
      convention.constName.snakepascal.should.equal 0
      convention.constName.snake.should.equal 0

    it 'check whether const name in camel case #4', ->
      convention = parser.constName "define('barBaz', 0);", {}
      convention.constName.camel.should.equal 1
      convention.constName.pascal.should.equal 0
      convention.constName.capssnake.should.equal 0
      convention.constName.snakepascal.should.equal 0
      convention.constName.snake.should.equal 0

    it 'check whether const name in pascal case #1', ->
      convention = parser.constName '  const FooBarBaz = 0;  ', {}
      convention.constName.camel.should.equal 0
      convention.constName.pascal.should.equal 1
      convention.constName.capssnake.should.equal 0
      convention.constName.snakepascal.should.equal 0
      convention.constName.snake.should.equal 0

    it 'check whether const name in pascal case #2', ->
      convention = parser.constName '\t\tconst FooBarBaz1=0; ', {}
      convention.constName.camel.should.equal 0
      convention.constName.pascal.should.equal 1
      convention.constName.capssnake.should.equal 0
      convention.constName.snakepascal.should.equal 0
      convention.constName.snake.should.equal 0

    it 'check whether const name in pascal case #3', ->
      convention = parser.constName ' const FooBar1Baz = 0;', {}
      convention.constName.camel.should.equal 0
      convention.constName.pascal.should.equal 1
      convention.constName.capssnake.should.equal 0
      convention.constName.snakepascal.should.equal 0
      convention.constName.snake.should.equal 0

    it 'check whether const name in pascal case #4', ->
      convention = parser.constName "define('BarBaz', 0);", {}
      convention.constName.camel.should.equal 0
      convention.constName.pascal.should.equal 1
      convention.constName.capssnake.should.equal 0
      convention.constName.snakepascal.should.equal 0
      convention.constName.snake.should.equal 0

    it 'check whether const name in caps snake case #1', ->
      convention = parser.constName ' const FOO_BAR_BAZ = 0; ', {}
      convention.constName.camel.should.equal 0
      convention.constName.pascal.should.equal 0
      convention.constName.capssnake.should.equal 1
      convention.constName.snakepascal.should.equal 0
      convention.constName.snake.should.equal 0

    it 'check whether const name in caps snake case #2', ->
      convention = parser.constName '\t\tconst FOO_BAR_BAZ2=0; ', {}
      convention.constName.camel.should.equal 0
      convention.constName.pascal.should.equal 0
      convention.constName.capssnake.should.equal 1
      convention.constName.snakepascal.should.equal 0
      convention.constName.snake.should.equal 0

    it 'check whether const name in caps snake case #3', ->
      convention = parser.constName ' const FOO_BAR1_BAZ = 0;', {}
      convention.constName.camel.should.equal 0
      convention.constName.pascal.should.equal 0
      convention.constName.capssnake.should.equal 1
      convention.constName.snakepascal.should.equal 0
      convention.constName.snake.should.equal 0

    it 'check whether const name in caps snake case #4', ->
      convention = parser.constName 'define("BAR_BAZ", 0);', {}
      convention.constName.camel.should.equal 0
      convention.constName.pascal.should.equal 0
      convention.constName.capssnake.should.equal 1
      convention.constName.snakepascal.should.equal 0
      convention.constName.snake.should.equal 0

    it 'check whether const name in snake pascal case #1', ->
      convention = parser.constName '  const Foo_Bar_Baz = 0; ', {}
      convention.constName.camel.should.equal 0
      convention.constName.pascal.should.equal 0
      convention.constName.capssnake.should.equal 0
      convention.constName.snakepascal.should.equal 1
      convention.constName.snake.should.equal 0

    it 'check whether const name in snake pascal case #2', ->
      convention = parser.constName '\t\tconst Foo_Bar_Baz1=0; ', {}
      convention.constName.camel.should.equal 0
      convention.constName.pascal.should.equal 0
      convention.constName.capssnake.should.equal 0
      convention.constName.snakepascal.should.equal 1
      convention.constName.snake.should.equal 0

    it 'check whether const name in snake pascal case #3', ->
      convention = parser.constName '  const Foo_Bar2_Baz=0;', {}
      convention.constName.camel.should.equal 0
      convention.constName.pascal.should.equal 0
      convention.constName.capssnake.should.equal 0
      convention.constName.snakepascal.should.equal 1
      convention.constName.snake.should.equal 0

    it 'check whether const name in snake pascal case #4', ->
      convention = parser.constName ' define("Bar_Baz", 0); ', {}
      convention.constName.camel.should.equal 0
      convention.constName.pascal.should.equal 0
      convention.constName.capssnake.should.equal 0
      convention.constName.snakepascal.should.equal 1
      convention.constName.snake.should.equal 0

    it 'check whether const name in snake case #1', ->
      convention = parser.constName '  const foo_bar_baz = 0; ', {}
      convention.constName.camel.should.equal 0
      convention.constName.pascal.should.equal 0
      convention.constName.capssnake.should.equal 0
      convention.constName.snakepascal.should.equal 0
      convention.constName.snake.should.equal 1

    it 'check whether const name in snake case #2', ->
      convention = parser.constName '\t\tconst foo_bar_baz2=0; ', {}
      convention.constName.camel.should.equal 0
      convention.constName.pascal.should.equal 0
      convention.constName.capssnake.should.equal 0
      convention.constName.snakepascal.should.equal 0
      convention.constName.snake.should.equal 1

    it 'check whether const name in snake case #3', ->
      convention = parser.constName '  const foo_bar1_baz = 0;', {}
      convention.constName.camel.should.equal 0
      convention.constName.pascal.should.equal 0
      convention.constName.capssnake.should.equal 0
      convention.constName.snakepascal.should.equal 0
      convention.constName.snake.should.equal 1

    it 'check whether const name in snake case #4', ->
      convention = parser.constName "\t\tdefine('bar_baz', 0);  ", {}
      convention.constName.camel.should.equal 0
      convention.constName.pascal.should.equal 0
      convention.constName.capssnake.should.equal 0
      convention.constName.snakepascal.should.equal 0
      convention.constName.snake.should.equal 1

    it 'all rules ingnore this #1', ->
      convention = parser.constName '  const _Foo_bar_baz = 0;  ', {}
      convention.constName.camel.should.equal 0
      convention.constName.pascal.should.equal 0
      convention.constName.capssnake.should.equal 0
      convention.constName.snakepascal.should.equal 0
      convention.constName.snake.should.equal 0

    it 'all rules ingnore this #2', ->
      convention = parser.constName '  const Foo_bar_baz_=0; ', {}
      convention.constName.camel.should.equal 0
      convention.constName.pascal.should.equal 0
      convention.constName.capssnake.should.equal 0
      convention.constName.snakepascal.should.equal 0
      convention.constName.snake.should.equal 0

    it 'all rules ingnore this #3', ->
      convention = parser.constName '  const Foo_BAR_baz = 0;   ', {}
      convention.constName.camel.should.equal 0
      convention.constName.pascal.should.equal 0
      convention.constName.capssnake.should.equal 0
      convention.constName.snakepascal.should.equal 0
      convention.constName.snake.should.equal 0

    it 'all rules ingnore this #4', ->
      convention = parser.constName ' const Foo_bar_Baz = 0;   ', {}
      convention.constName.camel.should.equal 0
      convention.constName.pascal.should.equal 0
      convention.constName.capssnake.should.equal 0
      convention.constName.snakepascal.should.equal 0
      convention.constName.snake.should.equal 0

    it 'all rules ingnore this #5', ->
      convention = parser.constName 'const foo_BAR_Baz  = 0; ', {}
      convention.constName.camel.should.equal 0
      convention.constName.pascal.should.equal 0
      convention.constName.capssnake.should.equal 0
      convention.constName.snakepascal.should.equal 0
      convention.constName.snake.should.equal 0

    it 'all rules ingnore this #6', ->
      convention = parser.constName ' const foo_BAR_baz = 0; ', {}
      convention.constName.camel.should.equal 0
      convention.constName.pascal.should.equal 0
      convention.constName.capssnake.should.equal 0
      convention.constName.snakepascal.should.equal 0
      convention.constName.snake.should.equal 0

    it 'all rules ingnore this #7', ->
      convention = parser.constName 'const foo_BarBaz = 0; ', {}
      convention.constName.camel.should.equal 0
      convention.constName.pascal.should.equal 0
      convention.constName.capssnake.should.equal 0
      convention.constName.snakepascal.should.equal 0
      convention.constName.snake.should.equal 0

    it 'all rules ingnore this #8', ->
      convention = parser.constName 'const fooBARBaz = 0;', {}
      convention.constName.camel.should.equal 0
      convention.constName.pascal.should.equal 0
      convention.constName.capssnake.should.equal 0
      convention.constName.snakepascal.should.equal 0
      convention.constName.snake.should.equal 0

    it 'all rules ingnore this #9', ->
      convention = parser.constName 'const foo = 0;', {}
      convention.constName.camel.should.equal 0
      convention.constName.pascal.should.equal 0
      convention.constName.capssnake.should.equal 0
      convention.constName.snakepascal.should.equal 0
      convention.constName.snake.should.equal 0

    it 'all rules ingnore this #10', ->
      convention = parser.constName 'const FOO = 0;', {}
      convention.constName.camel.should.equal 0
      convention.constName.pascal.should.equal 0
      convention.constName.capssnake.should.equal 0
      convention.constName.snakepascal.should.equal 0
      convention.constName.snake.should.equal 0

    it 'all rules ingnore this #11', ->
      convention = parser.constName 'const Foo = 0;', {}
      convention.constName.camel.should.equal 0
      convention.constName.pascal.should.equal 0
      convention.constName.capssnake.should.equal 0
      convention.constName.snakepascal.should.equal 0
      convention.constName.snake.should.equal 0

    it 'all rules ingnore this #12', ->
      convention = parser.constName 'define("bar", 0);', {}
      convention.constName.camel.should.equal 0
      convention.constName.pascal.should.equal 0
      convention.constName.capssnake.should.equal 0
      convention.constName.snakepascal.should.equal 0
      convention.constName.snake.should.equal 0

    it 'all rules ingnore this #13', ->
      convention = parser.constName 'define("barBAR", 0);', {}
      convention.constName.camel.should.equal 0
      convention.constName.pascal.should.equal 0
      convention.constName.capssnake.should.equal 0
      convention.constName.snakepascal.should.equal 0
      convention.constName.snake.should.equal 0

    it 'all rules ingnore this #14', ->
      convention = parser.constName 'define("barBARBaz", 0);', {}
      convention.constName.camel.should.equal 0
      convention.constName.pascal.should.equal 0
      convention.constName.capssnake.should.equal 0
      convention.constName.snakepascal.should.equal 0
      convention.constName.snake.should.equal 0

  describe 'const naming >', ->

    it 'check whether function name in camel case #1', ->
      convention = parser.functionName 'function barBaz(){', {}
      convention.functionName.camel.should.equal 1
      convention.functionName.pascal.should.equal 0
      convention.functionName.capssnake.should.equal 0
      convention.functionName.snakepascal.should.equal 0
      convention.functionName.snake.should.equal 0

    it 'check whether function name in camel case #2', ->
      convention = parser.functionName '\t\tfunction barBaz(){', {}
      convention.functionName.camel.should.equal 1
      convention.functionName.pascal.should.equal 0
      convention.functionName.capssnake.should.equal 0
      convention.functionName.snakepascal.should.equal 0
      convention.functionName.snake.should.equal 0

    it 'check whether function name in camel case #3', ->
      convention = parser.functionName '  public function barBaz(){ ', {}
      convention.functionName.camel.should.equal 1
      convention.functionName.pascal.should.equal 0
      convention.functionName.capssnake.should.equal 0
      convention.functionName.snakepascal.should.equal 0
      convention.functionName.snake.should.equal 0

    it 'check whether function name in pascal case #1', ->
      convention = parser.functionName 'function BarBaz(){', {}
      convention.functionName.camel.should.equal 0
      convention.functionName.pascal.should.equal 1
      convention.functionName.capssnake.should.equal 0
      convention.functionName.snakepascal.should.equal 0
      convention.functionName.snake.should.equal 0

    it 'check whether function name in pascal case #2', ->
      convention = parser.functionName '\t\tfunction BarBaz(){', {}
      convention.functionName.camel.should.equal 0
      convention.functionName.pascal.should.equal 1
      convention.functionName.capssnake.should.equal 0
      convention.functionName.snakepascal.should.equal 0
      convention.functionName.snake.should.equal 0

    it 'check whether function name in pascal case #3', ->
      convention = parser.functionName '  public function BarBaz(){', {}
      convention.functionName.camel.should.equal 0
      convention.functionName.pascal.should.equal 1
      convention.functionName.capssnake.should.equal 0
      convention.functionName.snakepascal.should.equal 0
      convention.functionName.snake.should.equal 0

    it 'check whether function name in caps snake case #1', ->
      convention = parser.functionName 'function BAR_BAZ(){', {}
      convention.functionName.camel.should.equal 0
      convention.functionName.pascal.should.equal 0
      convention.functionName.capssnake.should.equal 1
      convention.functionName.snakepascal.should.equal 0
      convention.functionName.snake.should.equal 0

    it 'check whether function name in caps snake case #2', ->
      convention = parser.functionName '\t\tfunction BAR_BAZ(){', {}
      convention.functionName.camel.should.equal 0
      convention.functionName.pascal.should.equal 0
      convention.functionName.capssnake.should.equal 1
      convention.functionName.snakepascal.should.equal 0
      convention.functionName.snake.should.equal 0

    it 'check whether function name in caps snake case #3', ->
      convention = parser.functionName 'public function BAR_BAZ(){', {}
      convention.functionName.camel.should.equal 0
      convention.functionName.pascal.should.equal 0
      convention.functionName.capssnake.should.equal 1
      convention.functionName.snakepascal.should.equal 0
      convention.functionName.snake.should.equal 0

    it 'check whether function name in snake pascal case #1', ->
      convention = parser.functionName 'function Bar_Baz(){', {}
      convention.functionName.camel.should.equal 0
      convention.functionName.pascal.should.equal 0
      convention.functionName.capssnake.should.equal 0
      convention.functionName.snakepascal.should.equal 1
      convention.functionName.snake.should.equal 0

    it 'check whether function name in snake pascal case #2', ->
      convention = parser.functionName '\t\tfunction Bar_Baz(){', {}
      convention.functionName.camel.should.equal 0
      convention.functionName.pascal.should.equal 0
      convention.functionName.capssnake.should.equal 0
      convention.functionName.snakepascal.should.equal 1
      convention.functionName.snake.should.equal 0

    it 'check whether function name in snake pascal case #3', ->
      convention = parser.functionName 'public function Bar_Baz(){', {}
      convention.functionName.camel.should.equal 0
      convention.functionName.pascal.should.equal 0
      convention.functionName.capssnake.should.equal 0
      convention.functionName.snakepascal.should.equal 1
      convention.functionName.snake.should.equal 0

    it 'check whether function name in snake case #1', ->
      convention = parser.functionName 'function bar_baz(){', {}
      convention.functionName.camel.should.equal 0
      convention.functionName.pascal.should.equal 0
      convention.functionName.capssnake.should.equal 0
      convention.functionName.snakepascal.should.equal 0
      convention.functionName.snake.should.equal 1

    it 'check whether function name in snake case #2', ->
      convention = parser.functionName '\t\tfunction bar_baz(){', {}
      convention.functionName.camel.should.equal 0
      convention.functionName.pascal.should.equal 0
      convention.functionName.capssnake.should.equal 0
      convention.functionName.snakepascal.should.equal 0
      convention.functionName.snake.should.equal 1

    it 'check whether function name in snake case #3', ->
      convention = parser.functionName 'public function bar_baz(){', {}
      convention.functionName.camel.should.equal 0
      convention.functionName.pascal.should.equal 0
      convention.functionName.capssnake.should.equal 0
      convention.functionName.snakepascal.should.equal 0
      convention.functionName.snake.should.equal 1

  describe 'method declare order >', ->

    it 'check visibility - static case #1', ->
      convention = parser.methodDeclare '  public static function bar($baz) ', {}
      convention.methodDeclare.staticlate.should.equal 1

    it 'check visibility - static case #2', ->
      convention = parser.methodDeclare "\t\tprotected static $my_static = 'foo'; ", {}
      convention.methodDeclare.staticlate.should.equal 1

    it 'check visibility - static case #3', ->
      convention = parser.methodDeclare "private static $my_static = 'foo'; ", {}
      convention.methodDeclare.staticlate.should.equal 1

    it 'check visibility - static case #4', ->
      convention = parser.methodDeclare ' static public function bar($baz)  ', {}
      convention.methodDeclare.staticlate.should.equal 0

    it 'check static - visibility case #1', ->
      convention = parser.methodDeclare ' static public function bar($baz)  ', {}
      convention.methodDeclare.staticfirst.should.equal 1

    it 'check static - visibility case #2', ->
      convention = parser.methodDeclare "\t\tstatic protected $my_static = 'foo'; ", {}
      convention.methodDeclare.staticfirst.should.equal 1

    it 'check static - visibility case #3', ->
      convention = parser.methodDeclare " static private $my_static = 'foo'; ", {}
      convention.methodDeclare.staticfirst.should.equal 1

    it 'check static - visibility case #4', ->
      convention = parser.methodDeclare "protected static $my_static = 'foo';", {}
      convention.methodDeclare.staticfirst.should.equal 0

    it 'check visibility - abstract(final) case #1', ->
      convention = parser.methodDeclare "  public abstract function bar($baz); ", {}
      convention.methodDeclare.abstractlate.should.equal 1

    it 'check visibility - abstract(final) case #2', ->
      convention = parser.methodDeclare "\t\tprotected abstract function getValue(); ", {}
      convention.methodDeclare.abstractlate.should.equal 1

    it 'check visibility - abstract(final) case #3', ->
      convention = parser.methodDeclare "private abstract function getValue();", {}
      convention.methodDeclare.abstractlate.should.equal 1

    it 'check visibility - abstract(final) case #4', ->
      convention = parser.methodDeclare "  private final function getValue(); ", {}
      convention.methodDeclare.abstractlate.should.equal 1

    it 'check visibility - abstract(final) case #5', ->
      convention = parser.methodDeclare " abstract public function bar($baz); ", {}
      convention.methodDeclare.abstractlate.should.equal 0

    it 'check abstract(final) - visibility case #1', ->
      convention = parser.methodDeclare "  abstract public function bar($baz); ", {}
      convention.methodDeclare.abstractfirst.should.equal 1

    it 'check abstract(final) - visibility case #2', ->
      convention = parser.methodDeclare "\t\tabstract protected function getValue(); ", {}
      convention.methodDeclare.abstractfirst.should.equal 1

    it 'check abstract(final) - visibility case #3', ->
      convention = parser.methodDeclare "abstract private function getValue();", {}
      convention.methodDeclare.abstractfirst.should.equal 1

    it 'check abstract(final) - visibility case #4', ->
      convention = parser.methodDeclare "  final private function getValue(); ", {}
      convention.methodDeclare.abstractfirst.should.equal 1

    it 'check abstract(final) - visibility case #5', ->
      convention = parser.methodDeclare "  protected abstract function getValue(); ", {}
      convention.methodDeclare.abstractfirst.should.equal 0

