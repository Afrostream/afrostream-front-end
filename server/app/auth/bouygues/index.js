import express from 'express'
import * as controller from './bouygues.controller'

const router = express.Router()

router.get('/signin', controller.signin)
router.get('/signup', controller.signup)
router.get('/unlink', controller.unlink)
router.get('/link', controller.link)
router.get('/callback', controller.callback)
router.get('/failure', controller.failure)
// specific legacy-api.android
router.get('/callback-android', (req, res) => { res.send('') })

module.exports = router
