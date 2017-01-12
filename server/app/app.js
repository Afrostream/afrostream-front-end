import path from 'path'
import expressHandlebars from 'express-handlebars'
import handlebars from 'handlebars'
import inlineScript from 'express-handlebars-inline-script'
import config from '../../config'
import routes from './routes'
import _ from 'lodash'
import express from 'express'
import favicon from 'serve-favicon'
import compression from 'compression'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import userIp from 'afrostream-node-middleware-userip'
import allowOrigin from './middlewares/middleware-allowcrossdomain'
import cacheHandler from './middlewares/middleware-cachehandler'
import { forceSSL, forceWWW } from './middlewares/middleware-redirect'
const app = express()

// Serve static files
// --------------------------------------------------

const staticPath = './static'
const buildPath = path.resolve(process.cwd(), 'dist')

function errorHandler (err, req, res, next) {
  res.status(500)
  res.render('error', {error: err})
}

app.set('startDate', new Date())
//
app.use(forceSSL())
app.use(forceWWW())
// We point to our static assets
app.use(compression())
//
app.use(cacheHandler())

app.use('/static', function (req, res, next) {
  res.isStatic()
  next()
})
app.use(userIp());
app.use(express.static(staticPath))
app.use('/static', express.static(buildPath))
app.use(favicon(path.join(staticPath, 'favicon.ico')))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(allowOrigin())
app.use(errorHandler)

// View engine
// --------------------------------------------------

handlebars.registerHelper('json-stringify', ::JSON.stringify)
handlebars.registerHelper('json-stringify', ::JSON.stringify)
handlebars.registerHelper('json', function (context) {
  return JSON.stringify(context)
})
handlebars.registerHelper('config', function (context) {
  return _.get(config, context)
})
handlebars.registerHelper('_', function () {
  var options = [].pop.call(arguments)
  var func = [].shift.call(arguments)
  return _[func].apply(_, arguments)
})


app.engine('hbs', expressHandlebars({
  extname: '.hbs',
  partialsDir: [
    'views/partials/'
  ],
  helpers: {
    inlineScript: process.env.NODE_ENV === 'production' ?
      // will inline the script by reading the file and generating a script tag
      inlineScript.inline :
      // noinline generates a script tag with the src set to the path passed
      inlineScript.noinline
  }
}))
app.set('view engine', 'hbs')
app.set('etag', false)
app.set('x-powered-by', false)

//ROUTES
routes(app, buildPath)

export default app
