
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth.middleware');

// Importar controller quando for criado
// const transactionController = require('../controllers/transaction.controller');

// Rota protegida para transações (a ser implementada)
router.get('/', verifyToken, (req, res) => {
  res.status(200).json({ message: "Lista de transações do usuário" });
});

module.exports = router;
const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transaction.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const { validateTransaction } = require("../middlewares/validation.middleware");

// Rotas de transações
router.post("/", verifyToken, validateTransaction, transactionController.create);
router.get("/", verifyToken, transactionController.findAll);
router.get("/summary", verifyToken, transactionController.getSummary);
router.get("/:id", verifyToken, transactionController.findOne);
router.put("/:id", verifyToken, validateTransaction, transactionController.update);
router.delete("/:id", verifyToken, transactionController.delete);

module.exports = router;
const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { validateTransaction } = require('../middlewares/validation.middleware');

// Todas as rotas exigem autenticação
router.use(authenticate);

// Rota para obter todas as transações
router.get('/', transactionController.getAllTransactions);

// Rota para obter transações por período
router.get('/period', transactionController.getTransactionsByPeriod);

// Rota para obter resumo financeiro
router.get('/summary', transactionController.getFinancialSummary);

// Rota para obter uma transação específica
router.get('/:id', transactionController.getTransactionById);

// Rota para criar uma nova transação
router.post('/', validateTransaction, transactionController.createTransaction);

// Rota para atualizar uma transação
router.put('/:id', validateTransaction, transactionController.updateTransaction);

// Rota para excluir uma transação
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;
