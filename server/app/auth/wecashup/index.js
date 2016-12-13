import express from 'express'
import { proxy } from '../../api/api-front'

const router = express.Router()

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
