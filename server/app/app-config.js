import path from 'path'

const setup = app => {
  app.set('startDate', new Date())
  app.set('x-powered-by', false)
  app.set('etag', false)
  app.set('buildPath', path.resolve(process.cwd(), 'dist'))
  app.set('staticPath', './static')
  app.set('chromecastStaticPath', './node_modules/chromecast-custom-receiver')
  app.set('initFiles', [
      {file: 'localStoragePolyfill.js'},
      {file: 'customEventPolyfill.js'},
      {file: 'requestAnimationFramePolyfill.js'},
      {file: 'isMobile.js'}
    ]
  )
  //FIXME get all webpack chunk files dynamicaly
  app.set('buildFiles', [
    {file: 'vendor.js'},
    {file: 'player.js'},
    {file: 'main.js'},
    {file: 'main.css'}
  ])
  app.set('hashInitFiles', [])
  app.set('hashBuildFiles', [])
}

export default setup
