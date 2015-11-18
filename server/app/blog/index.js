'use strict';

import express from 'express';

import { show, redirect } from './blog.controller';

const router = express.Router();

router.get('/:slug.html', redirect);
router.get('/:postUUID/*', show);

module.exports = router;