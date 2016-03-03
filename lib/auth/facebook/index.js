'use strict';

import express from 'express';
import * as controller from './facebook.controller';

const router = express.Router();

router.get('/', controller.checkAuth);
router.get('/unlink', controller.unlink);
router.get('/callback', controller.callback);
router.get('/failure', controller.failure);

module.exports = router;
