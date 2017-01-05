import express from 'express'
import controller from './geo.controller.js'

const router = express.Router()

router.get('/', controller.index)

module.exports = router
