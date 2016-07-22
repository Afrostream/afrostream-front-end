import express from 'express'

import * as controller from './controller.js'

const router = express.Router()

router.use((req, res, next) => {
  res.noCache()
  next()
})

router.get('/snap', controller.snap)

module.exports = router
