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
app.use express.bodyParser()
app.use express.methodOverride()
app.use app.router
app.use '/popularconvention', require('stylus').middleware "#{__dirname}/public"
app.use '/popularconvention', express.static(path.join __dirname, 'public')

# development only
if 'development' is app.get 'env'
  app.use express.logger('dev')
  app.use express.errorHandler()

# routing
app.get '/popularconvention', routes.index
#app.get '/popularconvention/fetcharchive', routes.fetcharchive
#app.get '/popularconvention/progress', routes.progressTimeline
#app.get '/popularconvention/summarize', routes.summarizeScore
app.get '/popularconvention/score/:lang', routes.findScore

http.createServer(app).listen app.get('port'), ->
  console.log "Express server listening on port #{app.get('port')}"
