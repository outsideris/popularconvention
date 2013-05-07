express = require 'express'
routes = require './routes'
http = require 'http'
path = require 'path'

app = express()

# all environments
app.set 'port', 8020
app.set 'views', "#{__dirname}/views"
app.set 'view engine', 'jade'
app.use express.favicon()
app.use express.logger('dev')
app.use express.bodyParser()
app.use express.methodOverride()
app.use app.router
app.use require('stylus').middleware "#{__dirname}/public"
app.use '/popluarconvention', express.static(path.join __dirname, 'public')

# development only
if 'development' is app.get 'env'
  app.use express.errorHandler()

# routing
app.get '/popluarconvention', routes.index
app.get '/popluarconvention/fetcharchive', routes.fetcharchive
app.get '/popluarconvention/progress', routes.progressTimeline
app.get '/popluarconvention/summarize', routes.summarizeScore
app.get '/popluarconvention/score/:lang', routes.findScore

http.createServer(app).listen app.get('port'), ->
  console.log "Express server listening on port #{app.get('port')}"
