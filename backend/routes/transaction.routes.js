
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
