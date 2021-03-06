import express from 'express'

import * as controllerSharing from './sharing.controller.js'

const router = express.Router()

router.use((req, res, next) => {
  res.noCache()
  next()
})

router.get('/movie/:movieId', controllerSharing.movie)
router.get('/season/:seasonId', controllerSharing.season)
router.get('/episode/:episodeId', controllerSharing.episode)
router.get('/video/:videoId', controllerSharing.video)

module.exports = router
