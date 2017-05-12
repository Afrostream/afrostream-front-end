import express from 'express'
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
import * as controllerReact from './controller.react.js'
import { alive as controllerAlive } from './controller.alive'

import md5 from 'md5'

// --------------------------------------------------
const {webpackDevServer: {host, port}} = config
const env = process.env.NODE_ENV || 'development'
const hostname = (env === 'development') ? `//${host}:${port}` : ''

function promiseFSAsync (filename) {
  return new Promise(function (resolve, reject) {
    try {
      fs.readFile(filename, function (err, data) {
        if (err) return reject(err)
        resolve(data)
      })
    } catch (err) {
      reject(err)
    }
  })
}

function parseMD5Files (app, files, inline) {
  let promisedMd5 = []
  let fileInfo
  _.map(files, (item) => {
    if ('production|staging'.indexOf(env) >= 0) {
      fileInfo = {
        async: item.async || false,
        file: item.file,
        hash: md5(item.file)
      }
      if (inline) {
        fileInfo.file = `${hostname}/static/${fileInfo.file}?${fileInfo.hash}`
      }
      return promisedMd5.push(fileInfo)
    }

    promisedMd5.push(promiseFSAsync(path.join(app.get('buildPath'), item.file)).then((buf) => {

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

export default function routes (app) {
  const buildPath = app.get('buildPath')

  parseMD5Files(app, app.get('initFiles'), true).then((res) => {
    app.set('hashInitFiles', res)
  })
  parseMD5Files(app, app.get('buildFiles')).then((res) => {
    app.set('hashBuildFiles', res)
  })

  // static dir
  app.use('/static', function (req, res, next) {
    res.isStatic()
    next()
  }, express.static(buildPath))

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

  app.get('/alive', controllerAlive)

  // COMPONENTS
  // --------------------------------------------------
  app.use('/components', component)

  // BOOTSTRAP
  // --------------------------------------------------

  app.get('/bootstrap.js', (req, res) => {
    res.send(bootstrapFiles(res, 'js', app.get('hashBuildFiles')))
  })

  app.get('/bootstrap.css', (req, res) => {
    res.send(bootstrapFiles(res, 'css', app.get('hashBuildFiles')))
  })

  app.get('/*', controllerReact.renderMain)
}
