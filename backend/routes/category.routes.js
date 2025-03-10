
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth.middleware');

// Importar controller quando for criado
// const categoryController = require('../controllers/category.controller');

// Rota protegida para categorias (a ser implementada)
router.get('/', verifyToken, (req, res) => {
  res.status(200).json({ message: "Lista de categorias do usuário" });
});

module.exports = router;
