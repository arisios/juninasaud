const express = require('express');
const router = express.Router();
const controller = require('../controllers/eventsController');
const { authenticate } = require('../middlewares/authMiddleware');

router.post('/', authenticate, controller.create);
router.get('/', authenticate, controller.listByProducer);
router.get('/:id', authenticate, controller.getById);

module.exports = router;
