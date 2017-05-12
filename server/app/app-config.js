const setup = app => {
  app.set('startDate', new Date())
  app.set('x-powered-by', false)
  app.set('etag', false)
  app.set('buildPath', path.resolve(process.cwd(), 'dist'))
  app.set('staticPath', './static')
  app.set('chromecastStaticPath', './node_modules/chromecast-custom-receiver')
}

export default setup
