const express = require('express');
const router = express.Router();
const controller = require('../controllers/nfcController');
const { authenticate } = require('../middlewares/authMiddleware');

router.get('/:uid', authenticate, controller.resolve);

module.exports = router;
