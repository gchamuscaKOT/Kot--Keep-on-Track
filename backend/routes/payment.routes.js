
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { validatePaymentMethod } = require('../middlewares/validation.middleware');

// Todas as rotas exigem autenticação
router.use(authenticate);

// Rota para obter todos os métodos de pagamento
router.get('/', paymentController.getAllPaymentMethods);

// Rota para obter um método de pagamento específico
router.get('/:id', paymentController.getPaymentMethodById);

// Rota para criar um novo método de pagamento
router.post('/', validatePaymentMethod, paymentController.createPaymentMethod);

// Rota para atualizar um método de pagamento
router.put('/:id', validatePaymentMethod, paymentController.updatePaymentMethod);

// Rota para excluir um método de pagamento
router.delete('/:id', paymentController.deletePaymentMethod);

module.exports = router;
