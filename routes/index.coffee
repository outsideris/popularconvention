service = require '../src/service'

exports.index = (req, res) ->
  res.render 'index', { title: 'Express' }

exports.fetcharchive = (req, res) ->
  datetime = req.query.file
  service.fetchGithubArchive datetime, (err) ->
    if err?
      res.render 'fetcharchive', { msg: 'Something is wrong!!!' }
    else
      res.render 'fetcharchive', { msg: 'Registred' }
