service = require '../src/service'

exports.index = (req, res) ->
  res.render 'index', {
    title: 'Express'
  }

exports.fetcharchive = (req, res) ->
  datetime = req.query.file
  service.fetchGithubArchive datetime, (err) ->
    if err?
      res.render 'fetcharchive', { msg: 'Something is wrong!!!' }
    else
      res.render 'fetcharchive', { msg: 'Registred' }

exports.progressTimeline = (req, res) ->
  service.progressTimeline ->
    res.render 'fetcharchive', { msg: 'progressed' }

exports.summarizeScore = (req, res) ->
  service.summarizeScore ->
    res.render 'fetcharchive', { msg: 'summarized' }

exports.findScore = (req, res) ->
  service.findScore req.params.lang, (err, data) ->
    if not err?
      res.json 200, {results: data}
    else
      res.send 500