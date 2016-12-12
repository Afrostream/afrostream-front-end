import express from 'express'
import facebook from  './facebook'
import bouygues from  './bouygues'
import orange from  './orange'
import netsize from './netsize'
import wecashup from './wecashup'

const router = express.Router()

router.use(function (req, res, next) {
  res.noCache()
  next()
})

router.use('/facebook', facebook)
router.use('/bouygues', bouygues)
router.use('/orange', orange)
router.use('/netsize', netsize)
router.use('/wecashup', wecashup)

module.exports = router
