const setup = app => {
  app.use(forceSSL())
  app.use(forceWWW())
  app.use(compression())
  app.use(cacheHandler())

  app.use(userIp())
  app.use(express.static(staticPath))
  app.use('/chromecast', express.static(chromecastStaticPath))

  app.use(favicon(path.join(staticPath, 'favicon.ico')))
  app.use(bodyParser.urlencoded({extended: false}))
  app.use(bodyParser.json())
  app.use(cookieParser())
  app.use(allowOrigin())
  app.use(errorHandler())
}

export default setup
