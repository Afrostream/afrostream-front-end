import { forceSSL, forceWWW } from './middlewares/middleware-redirect'
import compression from 'compression'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import userIp from 'afrostream-node-middleware-userip'
import allowOrigin from './middlewares/middleware-allowcrossdomain'
import cacheHandler from './middlewares/middleware-cachehandler'
import errorHandler from './middlewares/middleware-errorhandler'

export const setup = app => {
  app.use(forceSSL())
  app.use(forceWWW())
  app.use(compression())
  app.use(cacheHandler())
  app.use(userIp())
  app.use(bodyParser.urlencoded({extended: false}))
  app.use(bodyParser.json())
  app.use(cookieParser())
  app.use(allowOrigin())
  app.use(errorHandler())
}
