# parsing source
#
# Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
# Licensed under the MIT license.
# <http://outsider.mit-license.org/>

helpers = require '../helpers'
path = require 'path'
logger = (require '../helpers').logger
jsParser = require './js-parser'
javaParser = require './java-parser'
pythonParser = require './python-parser'
scalaParser = require './scala-parser'

parser = module.exports =
  parsePatch: (commit) ->
    commit = JSON.parse commit if 'string' is helpers.extractType commit
    commit.files

  parseAdditionTokens: (patch) ->
    patch = patch.split '\n'
    line.substr(1) for line in patch when line.charAt(0) is '+'

  parse: (commit) ->
    conventions = []
    try
      commit = JSON.parse commit if 'string' is helpers.extractType commit
      commit.files.forEach (file) ->
        ext = path.extname file.filename
        if isSupportExt(ext) and file.patch?
          convention = {lang: ext.substr(1)}
          psr = getParser ext
          lines = parser.parseAdditionTokens file.patch
          lines.forEach (line) ->
            convention = psr.parse line, convention, commit.html_url
          conventions.push convention if Object.keys(convention).length > 1
      conventions
    catch err
      logger.error 'parsing', {err: err}
      []

# private
supportExts = [
  '.js'
  '.java'
  '.py'
  '.scala'
]

isSupportExt = (ext) ->
  supportExts.some (elem) ->
    elem is ext

getParser = (ext) ->
  switch ext
    when '.js' then jsParser
    when '.java' then javaParser
    when '.py' then pythonParser
    when '.scala' then scalaParser
