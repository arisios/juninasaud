const express = require('express');
const router = express.Router();

const controller = require('../controllers/auditRequestsController');
const { authenticate } = require('../middlewares/authMiddleware');

// Produtor cria pedido de auditoria
router.post('/', authenticate, controller.create);

// Produtor lista seus pedidos (opcionalmente por evento)
router.get('/', authenticate, controller.listForProducer);

// Auditor vê fila de pedidos pendentes
router.get('/queue', authenticate, controller.queueForAuditor);

// Auditor aceita pedido
router.post('/:id/accept', authenticate, controller.accept);

// Auditor marca como concluído
router.post('/:id/complete', authenticate, controller.complete);

module.exports = router;

