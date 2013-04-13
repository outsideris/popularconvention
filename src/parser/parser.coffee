# parsing source
#
# Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
# Licensed under the MIT license.
# <http://outsider.mit-license.org/>

helpers = require '../helpers'
path = require 'path'
jsParser = require './js-parser'

parser = module.exports =
  parsePatch: (commit) ->
    commit = JSON.parse commit if 'string' is helpers.extractType commit
    commit.files

  parseAdditionTokens: (patch) ->
    patch = patch.split '\n'
    line.substr(1) for line in patch when line.charAt(0) is '+'

  parse: (commit) ->
    commit = JSON.parse commit if 'string' is helpers.extractType commit
    convention = {lang: 'js'} unless convention
    conventions = []
    commit.files.forEach (file) ->
      ext = path.extname file.filename
      if isSupportExt ext
        convention = {lang: ext.substr(1)}
        psr = getParser ext
        lines = parser.parseAdditionTokens file.patch
        lines.forEach (line) ->
          convention = psr.parse line, convention
        conventions.push convention
    conventions

# private
supportExts = [
  '.js'
]

isSupportExt = (ext) ->
  supportExts.some (elem) ->
    elem is ext

getParser = (ext) ->
  if ext is '.js'
    jsParser
