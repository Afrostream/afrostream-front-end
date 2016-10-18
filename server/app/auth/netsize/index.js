import express from 'express'
import { proxy } from '../../api/api-front'

const router = express.Router()

router.use(function (req, res) {
  proxy(req, res)
})

module.exports = router
