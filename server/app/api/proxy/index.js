import express from 'express'
import controller from './proxy.controller.js'

const router = express.Router()

router.get('/', controller.proxy)

module.exports = router
