'use strict';

import express from 'express';
import controller from './facebook.controller.js';

const router = express.Router();

router.get('/', controller.checkAuth);
router.get('/callback', controller.callback);
router.get('/failure', controller.failure);

module.exports = router;
