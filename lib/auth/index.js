'use strict';

import express from 'express';
import facebook from  './facebook';

const router = express.Router();

router.use(function (req, res, next) {
  res.noCache();
  next();
});

router.use('/facebook', facebook);

module.exports = router;
