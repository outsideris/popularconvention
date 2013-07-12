# Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
# Licensed under the MIT license.
# <http://outsider.mit-license.org/>

should = require 'should'
fs = require 'fs'
path = require 'path'
parser = require '../../src/parser/parser'

describe 'parser >', ->
  commitFixture = ''

  before ->
    fixturePath = path.resolve "#{__dirname}", "../fixture"
    commitFixture  = fs.readFileSync "#{fixturePath}/commit.json", 'utf8'

  it 'parse commit info', ->
    patch = parser.parsePatch commitFixture
    patch.length.should.equal 1

  it 'parse token patch for addition', ->
    tokens = parser.parseAdditionTokens JSON.parse(commitFixture).files[0].patch
    tokens.length.should.equal 5

  it 'parse commit', ->
    conventions = parser.parse commitFixture
    #console.log require('util').inspect(conventions, false, 5)

  it 'scala parseing test', ->
    fixture =
      files: [
        {
          sha: 'b2b7c1656057e1ec4c40e6b8ca0ed47c3fb14111',
          filename: 'test/controllers/api/AbstractAPITest.scala',
          status: 'modified',
          additions: 18,
          deletions: 1,
          changes: 19,
          blob_url: 'https://github.com/partakein/partake/blob/de35b648f87bc8d1ab477b4776b24f6db187e3f5/test/controllers/api/AbstractAPITest.scala',
          raw_url: 'https://github.com/partakein/partake/raw/de35b648f87bc8d1ab477b4776b24f6db187e3f5/test/controllers/api/AbstractAPITest.scala',
          contents_url: 'https://api.github.com/repos/partakein/partake/contents/test/controllers/api/AbstractAPITest.scala?ref=de35b648f87bc8d1ab477b4776b24f6db187e3f5',
          patch: '@@ -3,6 +3,7 @@ package controllers.api\n import controllers.AbstractControllerTest\n import in.partake.resource.UserErrorCode\n import in.partake.resource.ServerErrorCode\n+import play.api.http.HeaderNames\n import play.api.test.Helpers\n import play.api.libs.json.Json\n import play.api.libs.json.JsValue\n@@ -18,6 +19,7 @@ abstract class AbstractAPITest extends AbstractControllerTest {\n   // 200 OK\n   protected def expectResultOK(result: Result): Unit = {\n     expect(Helpers.OK) { Helpers.status(result) }\n+    expectHabitAsApi(result)\n   }\n \n   // ----------------------------------------------------------------------\n@@ -26,6 +28,7 @@ abstract class AbstractAPITest extends AbstractControllerTest {\n   // 400 Bad Request\n   protected def expectResultInvalid(result: Result, ec: UserErrorCode): Unit = {\n     expect(Helpers.BAD_REQUEST) { Helpers.status(result) }\n+    expectHabitAsApi(result)\n \n     var json: JsValue = Json.parse(Helpers.contentAsString(result))\n     expect(ec.getReasonString()) { (json \\ "reason").asInstanceOf[JsString].value }\n@@ -34,6 +37,7 @@ abstract class AbstractAPITest extends AbstractControllerTest {\n   // 401 Unauthorized\n   protected def expectResultLoginRequired(result: Result): Unit = {\n     expect(Helpers.UNAUTHORIZED) { Helpers.status(result) }\n+    expectHabitAsApi(result)\n \n     expect(Some("OAuth")) { Helpers.header("WWW-Authenticate", result) }\n \n@@ -44,21 +48,34 @@ abstract class AbstractAPITest extends AbstractControllerTest {\n   // 403 Forbidden\n   protected def expectResultForbidden(result: Result): Unit = {\n     expect(Helpers.FORBIDDEN) { Helpers.status(result) }\n+    expectHabitAsApi(result)\n \n     var json: JsValue = Json.parse(Helpers.contentAsString(result))\n     expect("forbidden") { (json \\ "result").asInstanceOf[JsString].value }\n     expect(false) { StringUtils.isBlank((json \\ "reason").asInstanceOf[JsString].value) }\n   }\n \n-\n   // ----------------------------------------------------------------------\n   // Result Exceptation (5xx)\n \n   // 500 Internal Server Error\n   protected def expectResultError(result: Result, ec: ServerErrorCode): Unit = {\n     expect(Helpers.INTERNAL_SERVER_ERROR) { Helpers.status(result) }\n+    expectHabitAsApi(result)\n \n     var json: JsValue = Json.parse(Helpers.contentAsString(result))\n     expect(ec.getReasonString()) { (json \\ "reason").asInstanceOf[JsString].value }\n   }\n+\n+  // ----------------------------------------------------------------------\n+  // Shared\n+\n+  private def expectHabitAsApi(result: Result): Unit = {\n+    expect(Some("application/json; charset=utf-8")) {\n+      Helpers.header(HeaderNames.CONTENT_TYPE, result)\n+    }\n+    expect(Some("no-cache")) {\n+      Helpers.header(HeaderNames.CACHE_CONTROL, result)\n+    }\n+  }\n }'
        }

      ]

    result = parser.parse fixture
