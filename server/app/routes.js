import { proxy, avatar, sharing, log, statsd, component } from './api'
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


  function parseMD5Files () {
    const buildFiles = ['vendor.js', 'player.js', 'main.js', 'main.css']
    let promisedMd5 = []
    _.map(buildFiles, (file) => {
      if (env === 'development') {
        return promisedMd5.push({
          file: file,
          hash: md5(file)
        })
      }
      promisedMd5.push(fsPromise.readFileAsync(path.join(buildPath, file)).then((buf) => {
        return {
          file: file,
          hash: md5(buf)
        }
      }))
    })
    return Promise.all(promisedMd5)
  }


  let hashFiles = []
  hashFiles = parseMD5Files().then((res) => {
    hashFiles = res
  })
// Render layout
  const bootstrapFiles = function (res, type) {
    const matchType = new RegExp(`.${type}$`)
    let files = _.filter(hashFiles, (item) => {
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
        fileLoader = `document.write('<scr' + 'ipt src="{url}"></scr' + 'ipt>');`
        break
      case 'css':
        fileLoader = ' @import url("{url}") screen;'
        break
      default:
        break
    }
    _.map(files, (item) => {
      templateStr += fileLoader.replace('{url}', `${hostname}/static/${item.file}?${item.hash}`)
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
    res.send(bootstrapFiles(res, 'js'))
  })

  app.get('/bootstrap.css', (req, res) => {
    res.send(bootstrapFiles(res, 'css'))
  })
  // BOOTSTRAP
  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------
  app.get('/*', (req, res) => {
    //set .noCache() to caching site

    res.cache()
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
