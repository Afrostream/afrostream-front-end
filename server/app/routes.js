import auth from './auth'
import avatar from './api/avatar'
import sharing from './api/sharing'
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


export default function routes (app, buildPath) {


  const env = process.env.NODE_ENV || 'development'

  function parseMD5Files () {
    const buildFiles = ['vendor.js', 'main.js', 'player.js', 'polyfill.js', 'main.css']
    let promisedMd5 = []
    _.map(buildFiles, (file)=> {
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
  hashFiles = parseMD5Files().then((res)=> {
    hashFiles = res
  })
// Render layout
  const bootstrapFiles = function (res, type) {
    const matchType = new RegExp(`.${type}$`)
    let files = _.filter(hashFiles, (item)=> {
      return item.file.match(matchType)
    })
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
    _.map(files, (item) => {
      templateStr += fileLoader.replace('{url}', `${hostname}/static/${item.file}?${item.hash}`)
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

  app.use('/alive', alive)

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
    //FIXE remove cache une fois correctement set
    res.set('Cache-Control', 'public, max-age=0')
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
