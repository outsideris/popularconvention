service = require '../src/service'
hljs = require 'highlight.js'

exports.index = (req, res) ->
  highlight1 = hljs.highlight('javascript', ', key: value\nvar a = function() {};').value
  highlight2 = hljs.highlight('javascript', 'key: value,').value
  res.render 'index', {
    title: 'Express'
    highlight1: highlight1
    highlight2: highlight2
  }

exports.fetcharchive = (req, res) ->
  datetime = req.query.file
  service.fetchGithubArchive datetime, (err) ->
    if err?
      res.render 'fetcharchive', { msg: 'Something is wrong!!!' }
    else
      res.render 'fetcharchive', { msg: 'Registred' }
