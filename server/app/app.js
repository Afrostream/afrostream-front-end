import express from 'express'

import { setup as setupAppConfig } from './app-config'
import { setup as setupAppMiddlewares } from './app-middlewares'
import { setup as setupAppViewengine } from './app-viewengine'

import routes from './routes.js'

const app = express()

// config
setupAppConfig(app)

// middlewares
setupAppMiddlewares(app)

// view engine
setupAppViewengine(app)

//ROUTES
routes(app)

export default app
