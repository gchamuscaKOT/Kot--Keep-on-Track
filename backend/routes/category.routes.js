
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
const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const { verifyToken, isAdmin } = require("../middlewares/auth.middleware");
const { validateCategory } = require("../middlewares/validation.middleware");

// Rotas de categorias
router.post("/", verifyToken, isAdmin, validateCategory, categoryController.create);
router.get("/", verifyToken, categoryController.findAll);
router.get("/:id", verifyToken, categoryController.findOne);
router.put("/:id", verifyToken, isAdmin, validateCategory, categoryController.update);
router.delete("/:id", verifyToken, isAdmin, categoryController.delete);

module.exports = router;
