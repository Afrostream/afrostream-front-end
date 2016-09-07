import express from 'express'
import * as controller from './netsize.controller'

const router = express.Router()

router.get('/check', controller.check)
router.get('/subscribe', controller.subscribe)
router.get('/unsubscribe', controller.unsubscribe)
router.get('/callback', controller.callback)

module.exports = router
