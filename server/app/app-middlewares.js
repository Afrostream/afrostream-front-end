import path from 'path'
import { forceSSL, forceWWW } from './middlewares/middleware-redirect'
import compression from 'compression'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import userIp from 'afrostream-node-middleware-userip'
import allowOrigin from './middlewares/middleware-allowcrossdomain'
import cacheHandler from './middlewares/middleware-cachehandler'
import express from 'express'

import errorHandler from './middlewares/middlewares-errorhandler'

import favicon from 'serve-favicon'

const setup = app => {
  app.use(forceSSL())
  app.use(forceWWW())
  app.use(compression())
  app.use(cacheHandler())

  app.use(userIp())
  app.use(express.static(app.get('staticPath')))
  app.use('/chromecast', express.static(app.get('chromecastStaticPath')))

  app.use(favicon(path.join(app.get('staticPath'), 'favicon.ico')))
  app.use(bodyParser.urlencoded({extended: false}))
  app.use(bodyParser.json())
  app.use(cookieParser())
  app.use(allowOrigin())
  app.use(errorHandler())
}

export default setup
