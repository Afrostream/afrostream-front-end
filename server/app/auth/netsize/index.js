import express from 'express'
import { proxy } from '../../api/api-front'

const router = express.Router()

router.use(function (req, res) {
  res.noCache()
  // on fwd le token manuellement
  let token = req.query.access_token
  delete req.query.access_token
  proxy(req, res, {headers: {'Access-Token': token}})
})

module.exports = router
