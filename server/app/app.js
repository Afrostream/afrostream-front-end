import path from 'path'
import expressHandlebars from 'express-handlebars'
import handlebars from 'handlebars'
import routes from './routes'
import express from 'express'
import favicon from 'serve-favicon'
import compression from 'compression'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import allowOrigin from './middlewares/middleware-allowcrossdomain'
import cacheHandler from './middlewares/middleware-cachehandler'
const app = express()

// Serve static files
// --------------------------------------------------

const staticPath = path.resolve(__dirname, '../../static/')
const buildPath = path.resolve(process.cwd(), 'dist')

function errorHandler (err, req, res, next) {
  res.status(500)
  res.render('error', {error: err})
}

//Get hashed path webpack
const HASH_REGXP = /\.([a-f0-9]{32})\.js/
// We point to our static assets
app.use(compression())
//
app.use(cacheHandler())

app.use('/static', function (req, res, next) {
  res.isStatic()
  next()
})
app.use(express.static(staticPath))
app.use('/static', express.static(buildPath))
app.use('/static', function (req, res, next) {
  // faire une regexp sur req.url
  if (req.url.match(HASH_REGXP)) {
    res.sendFile(req.url.replace(HASH_REGXP, hashValue))
  }
  next()
})
app.use(favicon(path.join(staticPath, 'favicon.ico')))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(allowOrigin())
app.use(errorHandler)

// View engine
// --------------------------------------------------

handlebars.registerHelper('json-stringify', ::JSON.stringify)
handlebars.registerHelper('json', function (context) {
  return JSON.stringify(context)
})

app.engine('hbs', expressHandlebars())
app.set('view engine', 'hbs')
app.set('etag', false)
app.set('x-powered-by', false)

//ROUTES
routes(app, buildPath)

export default app
