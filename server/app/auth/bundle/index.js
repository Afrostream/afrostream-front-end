import express from 'express'
import * as controller from './bundle.controller'

const router = express.Router()

router.get('/', controller.index)

module.exports = router
