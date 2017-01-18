import express from 'express'
import twitter from  './twitter'
import facebook from  './facebook'
import bouygues from  './bouygues'
import orange from  './orange'
import netsize from './netsize'
import wecashup from './wecashup'
import bundle from './bundle'

const router = express.Router()

router.use(function (req, res, next) {
  res.noCache()
  next()
})

router.use('/facebook', facebook)
router.use('/twitter', twitter)
router.use('/bouygues', bouygues)
router.use('/orange', orange)
router.use('/netsize', netsize)
router.use('/wecashup', wecashup)
router.use('/bundle', bundle)

module.exports = router
