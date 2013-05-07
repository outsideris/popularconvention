service = require '../src/service'

exports.index = (req, res) ->
  service.findDescription false, (err, desc) ->
    if err?
      res.send 500
    else
      res.render 'index', {
        desc: desc
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
    else if err.message is "#{req.params.lang} is not found"
      res.json 404, {results: err.message}
    else
      logger.error "findScore", {err: err}
      res.send 500