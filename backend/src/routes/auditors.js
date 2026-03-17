const express = require('express');
const router = express.Router();
const controller = require('../controllers/auditorsController');
const { authenticate } = require('../middlewares/authMiddleware');

router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/', authenticate, controller.listByProducer);
router.get('/me/events', authenticate, controller.myEvents);
router.get('/events/:event_id', authenticate, controller.listForEvent);
router.post('/events/:event_id', authenticate, controller.attachToEvent);

module.exports = router;
