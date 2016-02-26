'use strict';

import express from 'express';
import * as  controllerBilling from './gocardless.controller';

const router = express.Router();

router.get('/success', controllerBilling.subscription);
router.get('/failure', controllerBilling.failure);
router.get('/:planCode', controllerBilling.getRedirectFlow);

module.exports = router;
