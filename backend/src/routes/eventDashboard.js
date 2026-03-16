const { authenticate } = require('../middlewares/authMiddleware');
const express = require('express');
const router = express.Router();
const controller = require('../controllers/eventDashboardController');

router.get('/:event_id/dashboard', authenticate, controller.dashboard);

module.exports = router;
