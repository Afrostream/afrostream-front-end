import express from 'express'
import facebook from  './facebook'
import bouygues from  './bouygues'

const router = express.Router()

router.use(function (req, res, next) {
  res.noCache()
  next()
})

router.use('/facebook', facebook)
router.use('/bouygues', bouygues)

module.exports = router
