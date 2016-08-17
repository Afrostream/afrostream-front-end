import auth from './auth'
import avatar from './api/avatar'
import sharing from './api/sharing'
import config from '../../config'
import fs from 'fs'
import path from 'path'
import render from './render'
// --------------------------------------------------

export default function routes (app, buildPath) {

  const env = process.env.NODE_ENV || 'development'
//Get hashed path webpack
  const hashValue = (env !== 'development') ? fs.readFileSync(path.join(buildPath, 'hash.txt')) : ''
// Render layout
  const bootstrapFiles = function (res, files, type) {
    let loadType = type === 'js' ? 'javascript' : type
    res.set('Cache-Control', 'public, max-age=0')
    res.header('Content-type', `text/${loadType}`)
    let {webpackDevServer: {host, port}} = config
    const hostname = (env === 'development') ? `//${host}:${port}` : ''
    // Js files
    let templateStr = ''
    let fileLoader = ''
    switch (type) {
      case 'js':
        fileLoader = `document.write('<scr' + 'ipt src="{url}"></scr' + 'ipt>');`
        break
      case 'css':
        fileLoader = ' @import url("{url}") screen;'
        break
      default:
        break
    }
    files.map(basename => {
      templateStr += fileLoader.replace("{url}", `${hostname}/static/${basename}${hashValue}.${type}`)
    })

    return templateStr
  }

  // SiteMap
  // --------------------------------------------------
  app.get('/sitemap.xml', (req, res) => {
    res.header('Content-Type', 'application/xml')
    res.sendFile(path.join(staticPath, 'sitemap.xml'))
  })

  // OAUTH
  // --------------------------------------------------
  app.use('/auth', auth)

  // AVATAR
  // --------------------------------------------------
  app.use('/avatar', avatar)

  // SHARING
  // --------------------------------------------------
  app.use('/sharing', sharing)
  // SHARING
  // --------------------------------------------------
  // BOOTSTRAP
  // --------------------------------------------------

  app.get('/static/bootstrap.js', (req, res) => {
    res.send(bootstrapFiles(res, ['vendor', 'main', 'player', 'polyfill'], 'js'))
  })

  app.get('/static/bootstrap.css', (req, res) => {
    res.send(bootstrapFiles(res, ['main'], 'css'))
  })
  // BOOTSTRAP
  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------
  app.get('/*', (req, res) => {

    const externalsJs = config.externalsJs

    // Render
    const layout = 'layouts/main'
    const payload = {
      externalsJs,
      initialState: {},
      body: ''
    }

    render(req, res, layout, {
      payload
    })
  })

}
