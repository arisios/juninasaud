const { authenticate } = require('../middlewares/authMiddleware');
const express = require('express');
const router = express.Router();
const controller = require('../controllers/exhibitorsController');

router.post('/', authenticate, controller.create);
router.get('/', authenticate, controller.list);

module.exports = router;
