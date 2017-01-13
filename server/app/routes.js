import {
  proxy,
  avatar,
  sharing,
  log,
  statsd,
  component
} from './api'
import auth from './auth'
import config from '../../config'
import fs from 'fs'
import path from 'path'
import _ from 'lodash'
import render from './render'
import { alive } from './controller'
import md5 from 'md5'
import Promise from 'bluebird'

const fsPromise = Promise.promisifyAll(fs)

// --------------------------------------------------

const env = process.env.NODE_ENV || 'development'
const {webpackDevServer: {host, port}} = config
const hostname = (env === 'development') ? `//${host}:${port}` : ''

export default function routes (app, buildPath) {

  const initFiles = [
    {file: 'localStoragePolyfill.js'},
    {file: 'customEventPolyfill.js'},
    {file: 'requestAnimationFramePolyfill.js'},
    {file: 'mobile.js'}
  ]
  //FIXME get all webpack chunk files dynamicaly
  const buildFiles = [
    {file: 'vendor.js'},
    {file: 'polyfills.js'},
    {file: 'player.js'},
    {file: 'main.js'},
    {file: 'main.css'}
  ]

  function parseMD5Files (files, inline) {

    let promisedMd5 = []
    let fileInfo
    _.map(files, (item) => {
      if (env !== 'production') {
        fileInfo = {
          async: item.async || false,
          file: item.file,
          hash: md5(item.file)
        }
        if (inline) {
          fileInfo.file = `${hostname}/static/${fileInfo.file}`
        }
        return promisedMd5.push(fileInfo)
      }
      promisedMd5.push(fsPromise.readFileAsync(path.join(buildPath, item.file)).then((buf) => {
        fileInfo = {
          async: item.async || false,
          file: item.file,
          hash: md5(buf)
        }

        if (inline) {
          fileInfo.file = buf.toString()
        }

        return fileInfo
      }))
    })
    return Promise.all(promisedMd5)
  }


  let hashInitFiles = []
  let hashBuildFiles = []
  parseMD5Files(initFiles, true).then((res) => {
    hashInitFiles = res
  })
  parseMD5Files(buildFiles).then((res) => {
    hashBuildFiles = res
  })
// Render layout
  const bootstrapFiles = function (res, type, bootstrapFiles) {
    const matchType = new RegExp(`.${type}$`)
    let files = _.filter(bootstrapFiles, (item) => {
      return item.file.match(matchType)
    })
    let loadType = type === 'js' ? 'javascript' : type
    res.noCache()
    res.header('Content-type', `text/${loadType}`)
    // Js files
    let templateStr = ''
    let fileLoader = ''
    switch (type) {
      case 'js':
        fileLoader = `document.write('<scr' + 'ipt src="{url}" {async}></scr' + 'ipt>');`
        break
      case 'css':
        fileLoader = ' @import url("{url}") screen;'
        break
      default:
        break
    }
    _.map(files, (item) => {
      let sourceFile = fileLoader.replace(/{url}/, `${hostname}/static/${item.file}?${item.hash}`)
      sourceFile = sourceFile.replace(/{async}/, item.async ? 'async' : '')
      templateStr += sourceFile
    })

    return templateStr
  }

  // SiteMap
  // --------------------------------------------------
  app.get('/sitemap.xml', (req, res) => {
    res.header('Content-Type', 'application/xml')
    res.sendFile(path.join(hostname, 'sitemap.xml'))
  })

  //show headers
  app.get('/headers', (req, res) => {
    res.noCache()
    res.send('<pre>' + JSON.stringify(req.headers) + '</pre>')
  })

  //test cache
  app.get('/test/no-cache', (req, res) => {
    res.noCache()
    res.json({date: new Date()})
  })

  app.get('/test/cache', (req, res) => {
    res.cache()
    res.json({date: new Date()})
  })

  //Old routes
  app.get('/blog*', (req, res) => {
    res.redirect(301, path.join(hostname, '/life'))
  })

  // OAUTH
  // --------------------------------------------------
  app.use('/auth', auth)

  // PROXY
  // --------------------------------------------------
  app.use('/proxy', proxy)

  // PROXY
  // --------------------------------------------------
  app.use('/log', log)

  // AVATAR
  // --------------------------------------------------
  app.use('/avatar', avatar)

  // SHARING
  // --------------------------------------------------
  app.use('/sharing', sharing)

  // STATSD
  // --------------------------------------------------
  app.use('/statsd', statsd)
  // SHARING
  // --------------------------------------------------

  app.use('/alive', alive)

  // COMPONENTS
  // --------------------------------------------------
  app.use('/components', component)

  // BOOTSTRAP
  // --------------------------------------------------

  app.get('/bootstrap.js', (req, res) => {
    res.send(bootstrapFiles(res, 'js', hashBuildFiles))
  })

  app.get('/bootstrap.css', (req, res) => {
    res.send(bootstrapFiles(res, 'css', hashBuildFiles))
  })
  // BOOTSTRAP
  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------
  app.get('/*', (req, res) => {
    //set .noCache() to uncaching site

    res.cache()
    const externalsJs = config.externalsJs
    const initJs = hashInitFiles
    // Render
    const layout = 'layouts/main'
    const payload = {
      initJs,
      externalsJs,
      initialState: {},
      body: ''
    }

    render(req, res, layout, {
      payload
    })
  })

}
