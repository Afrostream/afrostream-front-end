'use strict';

import express from 'express';

import { show } from './blog.controller';

const router = express.Router();

/**
 * redirecting route
 *    /blog/Afrostream-24-hour-love.html
 * to
 *    /blog/761b1042-7d0a-40a9-83ac-1b2ee5918b24/Afrostream-24-hour-love
 */
router.use(function (req, res, next) {
  console.log('middleware !' + req.url);
  const matches = req.url.match(/^\/([^/]+)\.html$/);
  if (matches && matches[1]) {

  }
  next();
});

router.get('/:postUUID/*', show);

module.exports = router;