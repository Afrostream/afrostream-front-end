import express from 'express';
import controller from './avatar.controller.js';

const router = express.Router();

router.get('/:email', controller.getAvatar);

module.exports = router;
