import express from 'express'
import  * as controllerLog from './statsd.controller'

const router = express.Router()

router.get('/', controllerLog.index)

module.exports = router
