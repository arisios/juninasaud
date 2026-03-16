const express = require('express');
const router = express.Router();
const controller = require('../controllers/finalController');
const { authenticate } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadAuditPhotos');

router.post('/', authenticate, upload.array('photos',4), controller.finalize);

module.exports = router;
