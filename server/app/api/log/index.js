import express from 'express'
import  * as controllerLog from './log.controller'

const router = express.Router()

router.get('/pixel', controllerLog.pixel)

module.exports = router
