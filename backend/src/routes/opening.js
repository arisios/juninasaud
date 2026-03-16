const express = require('express');
const router = express.Router();

const controller = require('../controllers/openingController');
const { authenticate } = require('../middlewares/authMiddleware');

router.post('/', authenticate, controller.opening);

module.exports = router;
