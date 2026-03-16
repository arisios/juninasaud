const express = require('express');
const router = express.Router();
const controller = require('../controllers/withdrawalsController');
const { authenticate } = require('../middlewares/authMiddleware');

router.post('/', authenticate, controller.create);

module.exports = router;
