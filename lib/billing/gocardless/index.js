'use strict';

import express from 'express';
import controller from './gocardless.controller.js';

const router = express.Router();

router.get('/', controller.getIdToken);
router.get('/callback', controller.callback);
router.get('/failure', controller.failure);

module.exports = router;
