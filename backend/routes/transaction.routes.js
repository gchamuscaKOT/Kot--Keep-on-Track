
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
