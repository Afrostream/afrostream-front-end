'use strict';

import express from 'express';
import gocardless from  './gocardless';

const router = express.Router();

router.use(function (req, res, next) {
  res.noCache();
  next();
});

router.use('/gocardless', gocardless);

module.exports = router;
