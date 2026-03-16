const { authenticate } = require('../middlewares/authMiddleware');
const express = require('express');
const router = express.Router();
const controller = require('../controllers/eventBoothsController');

router.get('/:event_id/booths', authenticate, controller.listByEvent);

module.exports = router;
