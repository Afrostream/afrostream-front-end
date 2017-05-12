import path from 'path'
import expressHandlebars from 'express-handlebars'
import handlebars from 'handlebars'
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
import errorHandler from './middlewares-errorhandler'

import { setup as setupAppConfig } from './app-config'
import { setup as setupAppMiddlewares } from './app-middlewares'
import { setup as setupAppViewengine } from './app-viewengine'

const app = express()

// config
setupAppConfig(app)

// middlewares
setupMiddlewares(app)

//ROUTES
routes(app)

export default app
