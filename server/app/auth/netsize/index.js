import express from 'express'
import { proxy } from '../../api/api-front'
import * as controller from './netsize.controller'

const router = express.Router()

router.get('/final-callback', controller.callback)

import request from 'request'


router.get('/what', (req, res) => {
  request.debug = (req.query.debug === 'true');
  request({uri:req.query.uri}, function (err, response, body) {
    res.json({
      err: err,
      response: response,
      body: body
    })
  })
})

router.use(function (req, res) {
  res.noCache()
  // on fwd le token manuellement
  let token = req.query.access_token
  delete req.query.access_token
  // HACK HACK HACK
  // backend authentification fail when using ?access_token=(...) !
  // rewriting urls.
  if (token) {
    req.url = req.url.replace('access_token=' + token, '')
    req.originalUrl = req.originalUrl.replace('access_token=' + token, '')
  }
  proxy(req, res, {headers: {'Access-Token': token}})
})

module.exports = router
