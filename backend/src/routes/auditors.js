const express = require('express');
const router = express.Router();
const controller = require('../controllers/auditorsController');
const { authenticate } = require('../middlewares/authMiddleware');

router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/', authenticate, controller.listByProducer);

module.exports = router;
